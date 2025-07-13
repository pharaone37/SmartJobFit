import { auth, ConfigParams } from 'express-openid-connect';
import { storage } from '../storage';
import type { Express } from 'express';

export function setupAuth0(app: Express) {
  console.log('Setting up Auth0 with domain:', process.env.REPLIT_DOMAINS?.split(',')[0]);
  
  const config: ConfigParams = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SESSION_SECRET!,
    baseURL: `https://${process.env.REPLIT_DOMAINS?.split(',')[0] || 'smartjobfit.com'}`,
    clientID: process.env.AUTH0_CLIENT_ID!,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN!}`,
    clientSecret: process.env.AUTH0_CLIENT_SECRET!,
    routes: {
      login: '/auth/login',
      logout: '/auth/logout',
      callback: '/auth/callback'
    },
    authorizationParams: {
      response_type: 'code',
      scope: 'openid profile email'
    },
    afterCallback: async (req, res, session, decodedState) => {
      try {
        if (session.user) {
          // Extract user data from Auth0 profile
          const userData = {
            id: `auth0_${session.user.sub}`,
            email: session.user.email || '',
            firstName: session.user.given_name || session.user.name?.split(' ')[0] || '',
            lastName: session.user.family_name || session.user.name?.split(' ').slice(1).join(' ') || '',
            profileImageUrl: session.user.picture || '',
            provider: 'auth0'
          };

          // Upsert user in database
          await storage.upsertUser(userData);
        }
        
        return session;
      } catch (error) {
        console.error('Error in Auth0 afterCallback:', error);
        return session;
      }
    }
  };

  app.use(auth(config));

  // Get current user endpoint
  app.get('/api/auth/user', async (req, res) => {
    try {
      if (!req.oidc?.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const auth0User = req.oidc.user;
      const userId = `auth0_${auth0User?.sub}`;
      
      // Get user from database
      let user = await storage.getUser(userId);
      
      // If user doesn't exist, create from Auth0 profile
      if (!user) {
        const userData = {
          id: userId,
          email: auth0User.email || '',
          firstName: auth0User.given_name || auth0User.name?.split(' ')[0] || '',
          lastName: auth0User.family_name || auth0User.name?.split(' ').slice(1).join(' ') || '',
          profileImageUrl: auth0User.picture || '',
          provider: 'auth0'
        };
        
        user = await storage.upsertUser(userData);
      }

      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Failed to fetch user' });
    }
  });

  // Auth status endpoint
  app.get('/api/auth/status', (req, res) => {
    res.json({
      isAuthenticated: req.oidc?.isAuthenticated() || false,
      user: req.oidc?.user || null
    });
  });
}

// Helper function to check authentication
export function requireAuth(req: any, res: any, next: any) {
  if (!req.oidc?.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

// Helper function to get user ID from Auth0
export function getUserId(req: any): string {
  return `auth0_${req.oidc.user.sub}`;
}
import passport from "passport";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import { storage } from "../storage";
import type { Express } from "express";

export function setupLinkedInAuth(app: Express) {
  // LinkedIn OAuth Strategy
  passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID!,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    callbackURL: `${process.env.BASE_URL || 'https://smartjobfit.com'}/auth/linkedin/callback`,
    scope: ['openid', 'profile', 'email'],
    state: true
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Extract user data from LinkedIn profile
      const userData = {
        id: `linkedin_${profile.id}`,
        email: profile.emails?.[0]?.value || '',
        firstName: profile.name?.givenName || '',
        lastName: profile.name?.familyName || '',
        profileImageUrl: profile.photos?.[0]?.value || '',
        provider: 'linkedin'
      };

      // Upsert user in database
      const user = await storage.upsertUser(userData);
      
      return done(null, {
        ...user,
        accessToken,
        refreshToken,
        provider: 'linkedin'
      });
    } catch (error) {
      return done(error, null);
    }
  }));

  // LinkedIn OAuth Routes
  app.get('/auth/linkedin', 
    passport.authenticate('linkedin', { 
      scope: ['openid', 'profile', 'email'],
      state: true
    })
  );

  app.get('/auth/linkedin/callback',
    passport.authenticate('linkedin', { 
      failureRedirect: '/login?error=linkedin_failed',
      successRedirect: '/'
    })
  );
}
# LinkedIn OAuth Setup Instructions

## Overview
Your SmartJobFit application now supports both **Replit Auth** (email-based) and **LinkedIn OAuth** for user authentication. Users can choose their preferred login method on a unified login page.

## LinkedIn Developer Setup

### Step 1: Create LinkedIn App
1. Go to [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Click "Create app" or use an existing app
3. Fill in required information:
   - App name: "SmartJobFit"
   - LinkedIn Page: Your company page (or create one)
   - App logo: Upload SmartJobFit logo
   - Legal terms: Accept LinkedIn's terms

### Step 2: Configure App Settings
1. Go to **Settings** tab
2. Add these **Authorized redirect URLs**:
   ```
   https://smartjobfit.com/auth/linkedin/callback
   https://your-replit-url.replit.app/auth/linkedin/callback
   ```

### Step 3: Request Product Access
1. Go to **Products** tab
2. Find "Sign in with LinkedIn using OpenID Connect"
3. Click "Request access"
4. Fill out the form explaining your use case:
   ```
   "SmartJobFit is a job search platform that helps users find employment opportunities. 
   We need LinkedIn authentication to allow users to sign in with their professional 
   profiles and optionally import their work experience and skills."
   ```

### Step 4: Get Credentials
1. Go to **Auth** tab
2. Copy your **Client ID** and **Client Secret**
3. You'll need to provide these to me as environment variables

## Environment Variables Needed

Please provide these credentials from your LinkedIn app:

```
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
```

## Current Authentication Flow

### For Users:
1. Visit `/login` page
2. Choose between:
   - **LinkedIn**: Professional profile login
   - **Email**: Standard email/password login (via Replit Auth)

### Technical Implementation:
- **LinkedIn OAuth**: Uses OpenID Connect with scopes: `openid`, `profile`, `email`
- **Replit Auth**: Existing email-based authentication
- **Session Management**: Unified session handling for both providers
- **User Data**: Both providers map to the same user schema

## Features Available:
- ✅ LinkedIn OAuth integration
- ✅ Unified login page with both options
- ✅ Automatic user profile creation
- ✅ Session management
- ✅ Error handling for failed authentications
- ✅ Database schema updated with provider field

## Next Steps:
1. Complete LinkedIn app setup above
2. Provide the Client ID and Client Secret
3. I'll configure the environment variables
4. Test the authentication flow

## Security Notes:
- Authorization codes expire in 20 seconds (LinkedIn requirement)
- All redirects must match exactly between frontend and backend
- Client secrets are kept secure on backend only
- HTTPS required for all OAuth flows

Let me know when you have the LinkedIn credentials ready!
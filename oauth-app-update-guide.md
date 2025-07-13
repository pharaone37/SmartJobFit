# OAuth App Configuration Update Guide

## Issue
The Replit OAuth consent screen still shows "CareerCatalyst" instead of "SmartJobFit" when users try to sign in.

## Solution Steps

### 1. Update Replit OAuth App Settings
1. Go to your Replit account settings
2. Navigate to "Account" → "OAuth Apps" or visit: https://replit.com/account/oauth-apps
3. Find your OAuth app (likely named "CareerCatalyst")
4. Click "Edit" on the OAuth app
5. Update the following fields:
   - **App Name**: Change from "CareerCatalyst" to "SmartJobFit"
   - **Description**: Update to match your current app description
   - **Website URL**: Update to `https://smartjobfit.com`
   - **Callback URLs**: Ensure they include:
     - `https://smartjobfit.com/api/callback`
     - `https://your-repl-url.replit.app/api/callback` (for development)
   - **Logo**: Upload the SmartJobFit logo if you have one

### 2. Alternative: Create New OAuth App
If updating doesn't work, create a new OAuth app:
1. Go to https://replit.com/account/oauth-apps
2. Click "Create OAuth App"
3. Fill in the details:
   - **App Name**: SmartJobFit
   - **Description**: AI-powered job search platform
   - **Website URL**: https://smartjobfit.com
   - **Callback URLs**: 
     - `https://smartjobfit.com/api/callback`
     - `https://your-repl-url.replit.app/api/callback`
4. Save the new app
5. Copy the new `REPL_ID` (Client ID)
6. Update your environment variables with the new `REPL_ID`

### 3. Update Environment Variables
After updating the OAuth app, you may need to update:
```
REPL_ID=your_new_oauth_app_client_id
```

### 4. Test the Changes
1. Clear your browser cache and cookies
2. Try logging in again
3. The consent screen should now show "SmartJobFit"

## Current OAuth App Configuration
Based on your screenshot, the current configuration shows:
- App Name: CareerCatalyst (needs to be changed to SmartJobFit)
- URL: https://smartjobfit.com (this looks correct)
- Permissions: Identity, email, profile, stay signed in

## Important Notes
- The OAuth consent screen is controlled by Replit's OAuth app settings, not your application code
- Changes to the OAuth app name and branding will be reflected immediately
- Users who previously authorized the app may need to re-authorize after changes
- The consent screen cannot be completely customized beyond name, description, and logo

## Custom Authentication Alternative
If you prefer to have your own branded login page with multiple providers (Gmail, Outlook, LinkedIn), you would need to:
1. Implement custom OAuth flows for each provider
2. Use providers like Auth0, Supabase, or Firebase Auth
3. This would require significant code changes and additional API keys

## Recommendation
For now, updating the Replit OAuth app name to "SmartJobFit" is the quickest solution. The consent screen will then show the correct branding while maintaining the same functionality.
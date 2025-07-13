# OAuth App Configuration Update Guide

## Issue: Replit OAuth shows "CareerCatalyst" instead of "SmartJobFit"

The OAuth authorization screen is controlled by the Replit OAuth app registration, not our code. To fix this, you need to update your OAuth app settings in Replit.

## Steps to Update OAuth App Name:

### 1. Access Replit Account Settings
- Go to https://replit.com/account
- Navigate to "Connected Services" or "OAuth Apps"
- Find your OAuth app (currently named "CareerCatalyst")

### 2. Update App Information
**Change these fields:**
- **App Name**: `SmartJobFit` (instead of CareerCatalyst)
- **Description**: `AI-powered job search and career development platform`
- **Website**: `https://smartjobfit.com`
- **Redirect URIs**: 
  - `https://smartjobfit.com/api/callback`
  - `https://www.smartjobfit.com/api/callback`

### 3. Optional: Upload Logo
- Upload a logo file (PNG/SVG) with your SmartJobFit branding
- Recommended size: 128x128px or 256x256px

### 4. Update Privacy & Terms Links
- **Privacy Policy**: `https://smartjobfit.com/privacy`
- **Terms of Service**: `https://smartjobfit.com/terms`

## What Users Will See After Update:

**Before:**
```
CareerCatalyst would like to access your Replit account
```

**After:**
```
SmartJobFit would like to access your Replit account
```

## Alternative Solution: Custom Auth Page

I've also created a custom auth page at `/auth` that shows your SmartJobFit branding before redirecting to the OAuth flow. This provides a more professional experience:

**Features:**
- Shows SmartJobFit logo and branding
- Lists key features (AI matching, resume optimization, interview prep)
- Professional design matching your domain
- Redirects to actual OAuth after user clicks "Sign In"

**How to use:**
- Users go to `/auth` instead of directly to OAuth
- They see your branded page first
- Click "Sign In to SmartJobFit" to proceed to OAuth

## Environment Variables

Make sure you have these set:
```bash
REPLIT_DOMAINS=smartjobfit.com,www.smartjobfit.com
ISSUER_URL=https://replit.com/oidc
```

## Testing

After updating the OAuth app settings:
1. Clear browser cache
2. Try the login flow at `/auth`
3. Verify the OAuth screen shows "SmartJobFit"
4. Confirm successful redirect to `/dashboard`

## Note

The OAuth app name change may take a few minutes to propagate. If you continue to see "CareerCatalyst", wait 5-10 minutes and try again.
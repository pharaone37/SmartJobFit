# Domain Setup Guide for SmartJobFit

## Current Status
- **Domain**: smartjobfit.com (purchased from Namecheap)
- **Current DNS**: Pointing to Namecheap parking page
- **Target**: Connect to your hosting platform

## DNS Configuration Steps

### For Replit Deployments

1. **Get Replit Deployment URL**
   - Deploy your app on Replit
   - Note the deployment URL (e.g., `yourapp.replit.app`)

2. **Update DNS Records in Namecheap**
   - Log into Namecheap account
   - Go to Domain List → Manage for smartjobfit.com
   - Go to Advanced DNS tab
   - Add/Update these records:

   ```
   Type: A Record
   Host: @
   Value: [Replit's IP - get from Replit docs]
   TTL: 1 min

   Type: CNAME
   Host: www
   Value: your-deployment-url.replit.app
   TTL: 1 min
   ```

3. **Configure Custom Domain in Replit**
   - Go to your Replit deployment settings
   - Add custom domain: `smartjobfit.com`
   - Add custom domain: `www.smartjobfit.com`
   - Replit will provide specific DNS instructions

### For Vercel

1. **Deploy to Vercel**
   - Connect your GitHub repository
   - Deploy your application

2. **Add Custom Domain in Vercel**
   - Go to Project Settings → Domains
   - Add `smartjobfit.com` and `www.smartjobfit.com`
   - Vercel will show DNS configuration

3. **Update Namecheap DNS**
   ```
   Type: A Record
   Host: @
   Value: 76.76.19.19
   TTL: 1 min

   Type: CNAME
   Host: www
   Value: cname.vercel-dns.com
   TTL: 1 min
   ```

### For Railway

1. **Deploy to Railway**
   - Connect your repository
   - Deploy application

2. **Add Custom Domain**
   - Go to Railway dashboard
   - Add custom domain in settings
   - Get the provided CNAME value

3. **Update DNS**
   ```
   Type: CNAME
   Host: @
   Value: [Railway provided CNAME]
   TTL: 1 min

   Type: CNAME
   Host: www
   Value: [Railway provided CNAME]
   TTL: 1 min
   ```

## SSL Certificate Setup

Most modern hosting platforms provide automatic SSL certificates:
- **Replit**: Automatic SSL with custom domains
- **Vercel**: Automatic SSL via Let's Encrypt
- **Railway**: Automatic SSL included
- **Cloudflare**: Can be added as additional layer

## DNS Propagation

- **Time**: 24-48 hours (usually much faster)
- **Check Status**: Use tools like whatsmydns.net
- **Test**: Try accessing both `smartjobfit.com` and `www.smartjobfit.com`

## Verification Steps

1. **DNS Check**
   ```bash
   nslookup smartjobfit.com
   nslookup www.smartjobfit.com
   ```

2. **SSL Check**
   - Visit https://smartjobfit.com
   - Check for green lock icon
   - Use SSL checker tools

3. **Functionality Test**
   - Test login/logout
   - Test all major features
   - Check mobile responsiveness

## Common Issues & Solutions

### Issue 1: DNS Not Propagating
- **Solution**: Clear DNS cache, wait longer, check TTL settings

### Issue 2: SSL Certificate Issues
- **Solution**: Most platforms auto-generate SSL, contact support if needed

### Issue 3: Subdomain Not Working
- **Solution**: Ensure both @ and www records are configured

### Issue 4: Mixed Content Warnings
- **Solution**: Ensure all resources load via HTTPS

## Environment Variables Update

When switching hosting, update these variables:
```
REPLIT_DOMAINS=smartjobfit.com,www.smartjobfit.com
```

## Monitoring Setup

After domain is live, set up:
1. **Uptime Monitoring**: UptimeRobot or similar
2. **Analytics**: Google Analytics
3. **Error Tracking**: Sentry or similar
4. **Performance**: Web.dev or PageSpeed Insights

## Next Steps

1. Choose hosting platform
2. Deploy application
3. Configure custom domain
4. Update DNS records
5. Verify SSL certificate
6. Test all functionality
7. Set up monitoring

Would you like me to help you with any specific platform setup?
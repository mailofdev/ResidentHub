# Deployment Guide - ResidentHub PWA

This guide covers deploying the ResidentHub PWA to various platforms.

## 🚀 Quick Deployment Options

### 1. Vercel (Recommended for Frontend)

#### Prerequisites
- Vercel account
- GitHub repository

#### Steps
1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy from project directory
   vercel
   ```

2. **Configure Environment Variables**
   In Vercel dashboard, add:
   ```
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

3. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

### 2. Firebase Hosting

#### Prerequisites
- Firebase project
- Firebase CLI

#### Steps
1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login and Initialize**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Configure firebase.json**
   ```json
   {
     "hosting": {
       "public": "build",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ],
       "headers": [
         {
           "source": "/sw.js",
           "headers": [
             {
               "key": "Cache-Control",
               "value": "no-cache"
             }
           ]
         }
       ]
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

### 3. Netlify

#### Steps
1. **Connect Repository**
   - Link your GitHub repository to Netlify
   - Or drag and drop the `build` folder

2. **Build Settings**
   - Build Command: `npm run build`
   - Publish Directory: `build`

3. **Environment Variables**
   Add the same Firebase environment variables as Vercel

4. **Redirects**
   Create `public/_redirects`:
   ```
   /*    /index.html   200
   ```

## 🔧 Production Configuration

### 1. Environment Variables
Create `.env.production`:
```env
REACT_APP_FIREBASE_API_KEY=your-production-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_ENV=production
```

### 2. Build Optimization
```bash
# Analyze bundle size
npm run build
npx serve -s build

# Check bundle analysis
npm install --save-dev webpack-bundle-analyzer
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

### 3. PWA Configuration
Update `public/manifest.json` for production:
```json
{
  "short_name": "ResidentHub",
  "name": "ResidentHub - Apartment Maintenance Tracker",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#0d6efd",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "logo192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "logo512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

## 🔐 Security Configuration

### 1. Firebase Security Rules
Deploy updated Firestore rules:
```bash
firebase deploy --only firestore:rules
```

### 2. CORS Configuration
Configure Firebase Storage CORS:
```bash
# Create cors.json
echo '[{"origin": ["https://your-domain.com"], "method": ["GET", "POST", "PUT", "DELETE"], "maxAgeSeconds": 3600}]' > cors.json

# Deploy CORS
gsutil cors set cors.json gs://your-bucket-name
```

### 3. Content Security Policy
Add to `public/index.html`:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://*.firebaseapp.com https://*.googleapis.com;
">
```

## 📊 Performance Optimization

### 1. Service Worker Configuration
Ensure `public/sw.js` is properly configured for production caching.

### 2. Image Optimization
- Use WebP format for images
- Implement lazy loading
- Optimize image sizes

### 3. Bundle Optimization
```bash
# Check bundle size
npm run build
ls -la build/static/js/
```

## 🔍 Monitoring & Analytics

### 1. Firebase Analytics
Enable in Firebase Console and add to `src/config/firebase.js`:
```javascript
import { getAnalytics } from "firebase/analytics";

const analytics = getAnalytics(app);
```

### 2. Error Tracking
Consider adding Sentry or similar error tracking service.

### 3. Performance Monitoring
- Use Firebase Performance Monitoring
- Implement Web Vitals tracking
- Monitor Core Web Vitals

## 🚀 CI/CD Pipeline

### GitHub Actions Example
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test -- --coverage --watchAll=false
    
    - name: Build
      run: npm run build
      env:
        REACT_APP_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
        REACT_APP_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
        REACT_APP_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
        REACT_APP_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
        REACT_APP_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
        REACT_APP_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: ./
```

## 🔄 Domain Configuration

### 1. Custom Domain
- Configure custom domain in hosting platform
- Update Firebase Auth authorized domains
- Update CORS settings

### 2. SSL Certificate
- Most hosting platforms provide free SSL
- Ensure HTTPS is enforced
- Update manifest.json start_url to use HTTPS

## 📱 PWA Deployment Checklist

- [ ] Service worker is registered and working
- [ ] Manifest.json is properly configured
- [ ] Icons are optimized and available
- [ ] HTTPS is enabled
- [ ] Offline functionality works
- [ ] Install prompt appears
- [ ] Push notifications are configured
- [ ] Performance is optimized
- [ ] Security headers are set
- [ ] Analytics are configured

## 🆘 Troubleshooting

### Common Issues

1. **Service Worker Not Updating**
   - Clear browser cache
   - Check service worker registration
   - Verify cache version

2. **PWA Not Installable**
   - Check manifest.json validity
   - Ensure HTTPS is enabled
   - Verify service worker is active

3. **Firebase Connection Issues**
   - Verify environment variables
   - Check Firebase project configuration
   - Ensure security rules are correct

4. **Build Failures**
   - Check for TypeScript errors
   - Verify all dependencies are installed
   - Check for missing environment variables

### Debug Commands
```bash
# Check service worker
npx serve -s build
# Open DevTools > Application > Service Workers

# Test PWA
lighthouse https://your-domain.com --view

# Check bundle size
npm run build && npx webpack-bundle-analyzer build/static/js/*.js
```

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review platform-specific documentation
3. Create an issue in the repository
4. Contact the development team

---

**Happy Deploying!** 🚀

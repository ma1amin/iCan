# Deployment Guide

Complete guide for deploying the iCan platform to various hosting platforms.

## Pre-Deployment Checklist

### Code Preparation

- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Environment variables configured
- [ ] Dependencies updated
- [ ] Production build tested locally
- [ ] Documentation updated
- [ ] Changelog updated

### Configuration

- [ ] Production environment variables set
- [ ] API endpoints configured
- [ ] Analytics tracking configured
- [ ] Error reporting setup
- [ ] Backup strategy defined
- [ ] Monitoring configured

## Build Process

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `build/` directory including:
- Minified JavaScript
- Optimized assets
- Tree shaking
- Code splitting
- Source maps (if enabled)

### Build Optimization

```bash
# Analyze bundle size
npm run build -- --profile

# Build with specific environment
NODE_ENV=production npm run build
```

### Build Verification

Test the production build locally:

```bash
# Install serve globally
npm install -g serve

# Serve production build
serve -s build -l 3000
```

## Deployment Platforms

### Netlify

#### Setup

1. Create Netlify account at [netlify.com](https://netlify.com)
2. Connect your Git repository
3. Configure build settings

#### Configuration

**Build Settings:**
- **Build Command**: `npm run build`
- **Publish Directory**: `build`
- **Node Version**: 16

**Environment Variables:**
```
REACT_APP_API_URL=https://api.example.com
REACT_APP_ENABLE_ANALYTICS=true
```

#### Deploy via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

#### Continuous Deployment

Netlify automatically deploys on:
- Push to main branch
- Pull request merge
- Manual trigger

### Vercel

#### Setup

1. Create Vercel account at [vercel.com](https://vercel.com)
2. Import your Git repository
3. Configure project settings

#### Configuration

**Build Settings:**
- **Framework Preset**: Create React App
- **Build Command**: `npm run build`
- **Output Directory**: `build`

**Environment Variables:**
```
REACT_APP_API_URL=https://api.example.com
REACT_APP_ENABLE_ANALYTICS=true
```

#### Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### GitHub Pages

#### Setup

1. Enable GitHub Pages in repository settings
2. Configure source to `gh-pages` branch
3. Add homepage to package.json

#### Configuration

**package.json:**
```json
{
  "homepage": "https://username.github.io/ican",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

**Install gh-pages:**
```bash
npm install gh-pages --save-dev
```

#### Deploy

```bash
npm run deploy
```

### AWS S3

#### Setup

1. Create S3 bucket
2. Configure bucket for static website hosting
3. Set up CloudFront CDN (optional)

#### Deploy via AWS CLI

```bash
# Install AWS CLI
npm install -g aws-cli

# Configure credentials
aws configure

# Sync build directory
aws s3 sync build/ s3://your-bucket-name --delete

# Set cache headers
aws s3 cp build/ s3://your-bucket-name --recursive --cache-control "max-age=31536000"
```

### Docker

#### Dockerfile

```dockerfile
# Build stage
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Build and Run

```bash
# Build image
docker build -t ican-platform .

# Run container
docker run -p 80:80 ican-platform
```

## Environment Variables

### Required Variables

```env
REACT_APP_API_URL=https://api.example.com
```

### Optional Variables

```env
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ANALYTICS_ID=GA-XXXXX
REACT_APP_SENTRY_DSN=https://sentry.io/...
REACT_APP_ENABLE_ERROR_REPORTING=true
```

### Accessing Variables

```javascript
const apiUrl = process.env.REACT_APP_API_URL;
const enableAnalytics = process.env.REACT_APP_ENABLE_ANALYTICS === 'true';
```

## Performance Optimization

### Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev @bundle analyzer

# Analyze build
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

### Optimization Techniques

- **Code Splitting**: Lazy load heavy components
- **Tree Shaking**: Remove unused code
- **Image Optimization**: Compress and lazy load images
- **CDN**: Use CDN for static assets
- **Caching**: Implement proper cache headers
- **Gzip Compression**: Enable gzip on server

### Caching Strategy

```nginx
# Static assets - long cache
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# HTML - no cache
location / {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

## Monitoring

### Error Tracking

**Sentry Setup:**

```bash
npm install @sentry/react
```

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

### Analytics

**Google Analytics:**

```javascript
// Initialize GA
ReactGA.initialize(process.env.REACT_APP_ANALYTICS_ID);

// Track page views
ReactGA.pageview(window.location.pathname + window.location.search);
```

### Performance Monitoring

**Web Vitals:**

```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Security

### HTTPS

Always use HTTPS in production:
- Use Let's Encrypt for free SSL
- Configure proper SSL certificates
- Force HTTPS redirects
- Enable HSTS

### Security Headers

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

### Environment Variables

- Never commit `.env` files
- Use different variables for each environment
- Rotate secrets regularly
- Use secret management services

## Backup Strategy

### Data Backup

```javascript
// Export user data
const exportData = async () => {
  const data = await localStorage.getItem('ican-data');
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ican-backup-${Date.now()}.json`;
  a.click();
};
```

### Automated Backups

- Implement scheduled backups
- Store backups in secure location
- Test backup restoration
- Maintain backup retention policy

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.1
        with:
          publish-dir: './build'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Troubleshooting

### Common Issues

**Build fails:**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Environment variables not working:**
- Ensure variables start with `REACT_APP_`
- Restart development server after adding variables
- Check `.env` file is in root directory

**Deployment fails:**
- Check build logs for errors
- Verify environment variables are set
- Ensure all dependencies are installed
- Check platform-specific requirements

**Performance issues:**
- Analyze bundle size
- Implement code splitting
- Optimize images
- Enable compression
- Use CDN

## Post-Deployment

### Verification Checklist

- [ ] Application loads successfully
- [ ] All features work correctly
- [ ] No console errors
- [ ] Analytics tracking working
- [ ] Error reporting configured
- [ ] Performance metrics acceptable
- [ ] Security headers present
- [ ] SSL certificate valid
- [ ] Backup system working
- [ ] Monitoring configured

### User Communication

- Send deployment notification
- Update documentation
- Provide release notes
- Communicate any breaking changes
- Provide support contact information

## Maintenance

### Regular Tasks

- **Weekly**: Review error logs and performance metrics
- **Monthly**: Update dependencies and review security
- **Quarterly**: Conduct full security audit
- **Annually**: Review and update hosting strategy

### Dependency Updates

```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Audit for vulnerabilities
npm audit
npm audit fix
```

This deployment guide provides comprehensive coverage for deploying the iCan platform to various hosting environments.

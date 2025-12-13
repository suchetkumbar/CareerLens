# Deploy CareerLens to Netlify - Step by Step Guide

This guide walks you through deploying CareerLens to Netlify (free tier).

## Prerequisites

- A GitHub account
- A Netlify account (free tier is sufficient)
- Git installed on your machine

## Step 1: Fix Build Errors (If Any)

Before deploying, ensure your project builds successfully:

```bash
# Navigate to project directory
cd D:\github_d\FullStack\GuidedProjects\CareerLens

# Clean previous builds
rm -rf build node_modules/.cache

# Install dependencies
npm install

# Test the build
npm run build
```

If build succeeds, you're ready to deploy!

## Step 2: Push Code to GitHub

### 2.1 Initialize Git (if not already done)

```bash
# Check if git is initialized
git status

# If not initialized, run:
git init
```

### 2.2 Create .gitignore (if not exists)

Ensure you have a `.gitignore` file with:
```
node_modules/
build/
.env
.DS_Store
*.log
```

### 2.3 Commit and Push to GitHub

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for Netlify deployment"

# Add your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/CareerLens.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note:** If you already have a GitHub repo, skip the `git remote add` step and just push.

## Step 3: Deploy to Netlify

### Option A: Deploy via Netlify Dashboard (Recommended for Beginners)

1. **Go to Netlify**
   - Visit [https://app.netlify.com](https://app.netlify.com)
   - Sign up or log in (you can use GitHub to sign in)

2. **Add New Site**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your GitHub account

3. **Select Repository**
   - Find and select your `CareerLens` repository
   - Click "Next"

4. **Configure Build Settings**
   - **Build command:** `npm run build`
   - **Publish directory:** `build/client`
   - Netlify should auto-detect these from `netlify.toml`, but verify:
     - Build command: `npm run build`
     - Publish directory: `build/client`

5. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete (usually 2-5 minutes)

6. **Your Site is Live!**
   - Netlify will provide a URL like: `https://random-name-123.netlify.app`
   - You can customize this in Site settings → Domain management

### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```
   This will open your browser to authenticate.

3. **Initialize Netlify Site**
   ```bash
   cd D:\github_d\FullStack\GuidedProjects\CareerLens
   netlify init
   ```
   Follow the prompts:
   - Create & configure a new site
   - Choose your team
   - Site name (or leave blank for auto-generated)
   - Build command: `npm run build`
   - Directory to deploy: `build/client`

4. **Deploy**
   ```bash
   netlify deploy --prod
   ```

   For first deployment, you might want to test first:
   ```bash
   # Deploy to draft URL (for testing)
   netlify deploy
   
   # If everything looks good, deploy to production
   netlify deploy --prod
   ```

## Step 4: Configure Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Enter your domain name
4. Follow DNS configuration instructions

## Step 5: Verify Deployment

1. **Check Site URL**
   - Visit your Netlify site URL
   - Verify the homepage loads

2. **Test Functionality**
   - Test authentication (Puter.js sign-in)
   - Test file upload
   - Test resume analysis

3. **Check Build Logs**
   - Go to Deploys tab
   - Click on latest deploy
   - Review build logs for any errors

## Troubleshooting

### Build Fails on Netlify

**Error: "Build command failed"**
- Check build logs in Netlify dashboard
- Ensure `package.json` has correct build script
- Verify Node.js version (Netlify uses Node 18 by default, we need 20)

**Fix:** Add to `netlify.toml`:
```toml
[build.environment]
  NODE_VERSION = "20"
```

### 404 Errors on Routes

**Problem:** Navigating to routes like `/upload` shows 404

**Solution:** The `netlify.toml` file includes redirect rules. If it's not working:
1. Verify `netlify.toml` is in the root directory
2. Check that redirect rule is present:
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### Puter.js Not Loading

**Problem:** Authentication or file operations don't work

**Solution:**
- Ensure your site uses HTTPS (Netlify provides this automatically)
- Check browser console for errors
- Verify Puter.js script loads: `<script src="https://js.puter.com/v2/"></script>`

### Build Takes Too Long

**Problem:** Build exceeds free tier limits (300 build minutes/month)

**Solution:**
- Optimize dependencies
- Use build caching (Netlify does this automatically)
- Consider upgrading to Pro plan if needed

## Continuous Deployment

Once connected to GitHub, Netlify automatically:
- Deploys when you push to `main` branch
- Creates preview deployments for pull requests
- Shows deploy status in GitHub

### Workflow:
1. Make changes locally
2. Commit: `git commit -m "Your changes"`
3. Push: `git push origin main`
4. Netlify automatically builds and deploys

## Netlify Free Tier Limits

- **Build minutes:** 300/month
- **Bandwidth:** 100 GB/month
- **Sites:** Unlimited
- **Deploy previews:** Unlimited

## Next Steps

- Set up custom domain
- Configure environment variables (if needed later)
- Set up form handling (if you add contact forms)
- Enable analytics (optional)

## Quick Reference Commands

```bash
# Build locally
npm run build

# Deploy to Netlify (CLI)
netlify deploy --prod

# View site status
netlify status

# Open Netlify dashboard
netlify open

# View logs
netlify logs
```

## Support

- **Netlify Docs:** https://docs.netlify.com/
- **Netlify Community:** https://answers.netlify.com/
- **React Router Docs:** https://reactrouter.com/

---

**Your site should now be live on Netlify! 🚀**


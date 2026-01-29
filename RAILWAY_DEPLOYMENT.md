# 🚂 Railway Deployment Guide - VEDA Carbon Calculator

This guide will help you deploy the VEDA Carbon Calculator to Railway as a self-hosted application.

---

## 📋 Prerequisites

1. **Railway Account** - Sign up at https://railway.app
2. **GitHub Account** - Connected to Railway
3. **PostgreSQL Database** - Will be created on Railway
4. **API Keys:**
   - Anthropic API Key (for Sage AI chatbot)
   - Optional: OpenAI API Key (if using OpenAI features)

---

## 🚀 Quick Deployment Steps

### Step 1: Create New Railway Project

1. Go to https://railway.app/new
2. Click **"Deploy from GitHub repo"**
3. Select your repository: `ethicsbuild/Vada-Carbon-Calculator`
4. Select branch: `producer-first-transformation` (or `main` after merging)

### Step 2: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically create a PostgreSQL instance
4. The `DATABASE_URL` will be automatically added to your environment variables

### Step 3: Configure Environment Variables

In Railway project settings, add these environment variables:

```bash
# Database (automatically set by Railway PostgreSQL)
DATABASE_URL=postgresql://...  # Auto-populated

# AI Services
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional
OPENAI_API_KEY=your_openai_api_key_here  # If using OpenAI features

# Node Environment
NODE_ENV=production
```

### Step 4: Deploy

1. Railway will automatically detect the `railway.json` configuration
2. It will run `npm run build` to build the application
3. Then start with `npm run start`
4. Your app will be live at: `https://your-app.up.railway.app`

---

## 🔧 Configuration Files

### railway.json (Already Configured)

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Build Process

The build command in `package.json`:
```json
"build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist && npm run db:push"
```

This will:
1. Build the frontend with Vite
2. Bundle the backend with esbuild
3. Push database schema with Drizzle

### Start Command

```json
"start": "NODE_ENV=production node dist/index.js"
```

---

## 🗄️ Database Setup

### Automatic Schema Migration

The build process includes `npm run db:push` which automatically:
- Creates all necessary tables
- Sets up the schema defined in `shared/schema.ts`
- No manual SQL needed!

### Database Tables

The app will create these tables:
- `users` - User accounts (for future auth)
- `events` - Saved event calculations
- `conversations` - Sage chatbot conversations
- `messages` - Chat message history

---

## 🔐 Environment Variables Explained

### Required Variables

**DATABASE_URL**
- Automatically set by Railway PostgreSQL
- Format: `postgresql://user:password@host:port/database`
- No action needed if using Railway PostgreSQL

**ANTHROPIC_API_KEY**
- Get from: https://console.anthropic.com/
- Required for Sage Riverstone AI chatbot
- Format: `sk-ant-...`

### Optional Variables

**OPENAI_API_KEY**
- Get from: https://platform.openai.com/api-keys
- Only needed if using OpenAI features
- Format: `sk-...`

**NODE_ENV**
- Set to `production` for Railway
- Automatically optimizes performance

---

## 🌐 Custom Domain (Optional)

### Add Your Own Domain

1. In Railway project, go to **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `carbon.yourdomain.com`)
4. Add the CNAME record to your DNS:
   ```
   CNAME carbon your-app.up.railway.app
   ```
5. Wait for DNS propagation (5-30 minutes)
6. Railway will automatically provision SSL certificate

---

## 📊 Monitoring & Logs

### View Logs

1. In Railway project, click on your service
2. Go to **"Deployments"** tab
3. Click on the latest deployment
4. View real-time logs

### Monitor Performance

Railway provides:
- CPU usage
- Memory usage
- Network traffic
- Request metrics

---

## 🔄 Continuous Deployment

### Automatic Deployments

Railway automatically deploys when you:
1. Push to the connected branch
2. Merge a pull request
3. Make changes in the GitHub repository

### Manual Deployment

1. Go to your Railway project
2. Click **"Deploy"** button
3. Select the branch/commit to deploy

---

## 💰 Pricing & Resources

### Railway Pricing

- **Starter Plan:** $5/month
  - 500 hours of usage
  - $0.000231/GB-hour for RAM
  - $0.000463/vCPU-hour

- **Pro Plan:** $20/month
  - More resources and features

### Recommended Resources

For this app:
- **Memory:** 512MB - 1GB
- **CPU:** 0.5 - 1 vCPU
- **Database:** PostgreSQL (included)

---

## 🐛 Troubleshooting

### Build Fails

**Issue:** Build fails with "DATABASE_URL not found"

**Solution:**
1. Make sure PostgreSQL is added to your project
2. Check environment variables are set
3. Redeploy after adding database

**Issue:** Build fails with "Module not found"

**Solution:**
```bash
# Locally test the build
npm install
npm run build
```

### Runtime Errors

**Issue:** App crashes on startup

**Solution:**
1. Check logs in Railway dashboard
2. Verify all environment variables are set
3. Ensure DATABASE_URL is correct
4. Check Anthropic API key is valid

**Issue:** Database connection fails

**Solution:**
1. Verify PostgreSQL service is running
2. Check DATABASE_URL format
3. Ensure database migrations ran successfully

### Performance Issues

**Issue:** App is slow

**Solution:**
1. Increase memory allocation in Railway
2. Check database query performance
3. Enable connection pooling
4. Monitor logs for bottlenecks

---

## 🔒 Security Best Practices

### Environment Variables

- ✅ Never commit API keys to Git
- ✅ Use Railway's environment variables
- ✅ Rotate keys periodically
- ✅ Use different keys for dev/prod

### Database

- ✅ Railway PostgreSQL is automatically secured
- ✅ Connections are encrypted
- ✅ Regular backups are maintained
- ✅ Access is restricted to your Railway project

### API Keys

- ✅ Store in Railway environment variables
- ✅ Never expose in client-side code
- ✅ Monitor usage in API provider dashboards
- ✅ Set up usage alerts

---

## 📈 Scaling

### Horizontal Scaling

Railway supports:
- Multiple instances
- Load balancing
- Auto-scaling based on traffic

### Database Scaling

- Upgrade PostgreSQL plan as needed
- Enable connection pooling
- Add read replicas for high traffic

---

## 🔄 Updates & Maintenance

### Deploying Updates

1. **Merge PR to main branch**
   ```bash
   # After testing, merge your PR
   gh pr merge 1
   ```

2. **Railway auto-deploys**
   - Detects new commit
   - Runs build process
   - Deploys new version
   - Zero-downtime deployment

3. **Verify deployment**
   - Check Railway logs
   - Test the live site
   - Monitor for errors

### Database Migrations

When you update the schema:
1. Update `shared/schema.ts`
2. Commit and push
3. Railway runs `npm run db:push` automatically
4. Schema updates applied

---

## 📝 Deployment Checklist

Before deploying to Railway:

- [ ] Merge PR to main branch
- [ ] Create Railway project
- [ ] Add PostgreSQL database
- [ ] Set ANTHROPIC_API_KEY environment variable
- [ ] Set NODE_ENV=production
- [ ] Deploy and wait for build
- [ ] Check deployment logs
- [ ] Test the live application
- [ ] Verify database connection
- [ ] Test Sage chatbot
- [ ] Test calculator functionality
- [ ] Test save/load events
- [ ] Set up custom domain (optional)
- [ ] Configure monitoring/alerts

---

## 🎯 Post-Deployment Testing

### Essential Tests

1. **User Flow**
   - [ ] Landing page loads
   - [ ] User type selection works
   - [ ] Calculator loads properly
   - [ ] Forms are functional

2. **Calculator**
   - [ ] Can complete calculation
   - [ ] Results display correctly
   - [ ] Plain English summary shows
   - [ ] Recommendations appear

3. **Sage Chatbot**
   - [ ] Chat opens
   - [ ] Can send messages
   - [ ] Receives responses
   - [ ] No looping issues

4. **Data Persistence**
   - [ ] Can save events
   - [ ] Can view history
   - [ ] Can load saved events
   - [ ] Data persists across sessions

5. **Performance**
   - [ ] Page loads quickly
   - [ ] No console errors
   - [ ] Responsive on mobile
   - [ ] All features work

---

## 🆘 Support Resources

### Railway Documentation
- https://docs.railway.app/

### Project Documentation
- `IMPLEMENTATION_SUMMARY.md` - All changes made
- `TESTING_GUIDE.md` - Testing instructions
- `README.md` - Project overview

### Getting Help
- Railway Discord: https://discord.gg/railway
- Railway Support: support@railway.app
- GitHub Issues: Create issue in your repo

---

## 🎉 Success!

Once deployed, your VEDA Carbon Calculator will be:
- ✅ Live at your Railway URL
- ✅ Automatically backed up
- ✅ Continuously deployed from GitHub
- ✅ Monitored and scalable
- ✅ Secure and production-ready

**Your Railway URL will be:**
`https://your-project-name.up.railway.app`

Share this with your users and start calculating carbon footprints! 🌱

---

**Need Help?** Check the troubleshooting section or create an issue in the GitHub repository.
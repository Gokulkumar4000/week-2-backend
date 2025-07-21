# FeedbackPro Deployment Guide

## Frontend (Netlify) ✅ DEPLOYED
- **Live URL**: https://gokulkumar-week-2.netlify.app/
- **Status**: Successfully deployed

## Backend (Render) ✅ DEPLOYED
- **Live URL**: https://gokulkumar-week-2.onrender.com
- **Status**: Successfully deployed (may take 1-2 minutes to start up on first request)

## Updated Frontend for Production

### Step 1: Create Render Account
1. Go to [render.com](https://render.com) and sign up/login
2. Connect your GitHub account

### Step 2: Deploy Backend
1. **Create New Web Service**
2. **Connect Repository** (if using GitHub integration)
3. **Configure Settings:**
   - **Name**: `feedbackpro-backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist`
   - **Start Command**: `node dist/index.js`

### Step 3: Set Environment Variables
Add these environment variables in Render dashboard:
- `NODE_ENV` = `production`
- `GOOGLE_SERVICE_ACCOUNT_KEY` = (Your Google Service Account JSON)
- `GOOGLE_SHEET_ID` = (Your Google Sheet ID)

## Ready-to-Deploy Frontend
Your frontend is now built and configured with your backend URL:
- **Built with**: `VITE_API_BASE_URL=https://gokulkumar-week-2.onrender.com`
- **Location**: `dist/public/` folder
- **Ready for**: Drag-and-drop to Netlify

### Deploy Updated Frontend to Netlify:
1. **Go to your Netlify site**: https://gokulkumar-week-2.netlify.app/
2. **Go to "Site Overview"** → **"Deploys"**
3. **Drag and drop** the entire `dist/public` folder to deploy
4. **Your site will update** with the new backend connection

## Architecture
- **Frontend**: React + Vite on Netlify
- **Backend**: Express.js on Render  
- **Storage**: Google Sheets API
- **CORS**: Configured for your Netlify domain

## Environment Variables Needed
- `GOOGLE_SERVICE_ACCOUNT_KEY`: Your Google Service Account JSON key
- `GOOGLE_SHEET_ID`: Your Google Sheet ID for data storage
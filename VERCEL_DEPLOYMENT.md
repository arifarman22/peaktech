# Vercel Deployment Guide

## Backend Deployment

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Deploy Backend
```bash
cd backend
vercel
```

### 3. Add Environment Variables in Vercel Dashboard
Go to your project settings and add:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Your JWT secret key
- `JWT_REFRESH_SECRET` - Your refresh token secret
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `RESEND_API_KEY` - Resend API key
- `EMAIL_FROM` - Email sender address
- `FRONTEND_URL` - Your frontend Vercel URL (e.g., https://peaktech.vercel.app)

### 4. Get Backend URL
After deployment, copy your backend URL (e.g., https://peaktech-backend.vercel.app)

## Frontend Deployment

### 1. Update Frontend Environment
Create `frontend/.env.production`:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
```

### 2. Deploy Frontend
```bash
cd frontend
vercel
```

### 3. Update Backend CORS
After frontend deployment, update backend `FRONTEND_URL` environment variable with your frontend URL.

## MongoDB Atlas Setup (Required)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Whitelist all IPs (0.0.0.0/0) for Vercel
5. Get connection string and add to backend env vars

## Important Notes

- Vercel serverless functions have 10-second timeout on free tier
- Use MongoDB Atlas (not local MongoDB)
- Backend will be at: `https://your-project.vercel.app`
- Frontend will be at: `https://your-frontend.vercel.app`

## Commands

```bash
# Deploy to production
vercel --prod

# Check deployment logs
vercel logs

# List deployments
vercel ls
```

# 🚀 Deployment Guide - Environment Variables Only

## 🎯 Goal
Configure your app to work on any domain by changing **ONLY environment variables** - no code changes needed!

## 📁 Files to Change

### 1. Frontend Production (.env.production)
```env
# Change ONLY this line:
VITE_API_BASE_URL=https://your-domain.com
```

### 2. Backend Production (.env.production)
```env
# Optional - only if you want to restrict CORS to specific domain:
FRONTEND_URL=https://your-domain.com
# If not set, allows all origins in production
```

## 🌍 Domain Examples

### For `https://nirmaantracker.ddcdeveloper.com/`
```env
# frontend/.env.production
VITE_API_BASE_URL=https://nirmaantracker.ddcdeveloper.com

# backend/.env.production
FRONTEND_URL=https://nirmaantracker.ddcdeveloper.com
```

### For `https://myapp.com/`
```env
# frontend/.env.production
VITE_API_BASE_URL=https://myapp.com

# backend/.env.production
FRONTEND_URL=https://myapp.com
```

### For `https://api.myapp.com/` (separate API domain)
```env
# frontend/.env.production
VITE_API_BASE_URL=https://api.myapp.com

# backend/.env.production
FRONTEND_URL=https://myapp.com
```

## 🚀 Deployment Steps

### Frontend Deployment:
```bash
cd frontend
npm run build
# Upload dist/ folder to your web server
```

### Backend Deployment:
```bash
cd backend
# Copy .env.production to .env
cp .env.production .env
npm start
```

## ✅ That's It!
- **Local Development**: Works automatically
- **Production**: Change only 2 environment variables
- **No Code Changes**: Ever needed for different domains

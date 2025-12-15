# Deployment Guide

This guide explains how to deploy the DDC Developer application with backend, frontend, and database on separate servers.

## Architecture Overview

- **Frontend**: React + Vite (served from web server)
- **Backend**: Node.js + Express (API server)
- **Database**: MySQL (separate database server)

## Production Deployment Steps

### 1. Database Server Setup

1. Set up MySQL database on your database server
2. Create database and user
3. Run the database migration scripts

### 2. Backend Server Deployment

1. **Clone and setup**:
   ```bash
   git clone <your-repo>
   cd backend
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.production .env
   # Edit .env with your production values
   ```

3. **Key configuration changes**:
   - `DB_HOST`: Your database server IP/hostname
   - `DB_USER`: Database username
   - `DB_PASSWORD`: Database password
   - `DB_NAME`: Database name
   - `API_BASE_URL`: Your backend server URL (e.g., https://api.yourdomain.com)
   - `FRONTEND_URL`: Your frontend server URL (e.g., https://yourdomain.com)
   - `JWT_SECRET`: Strong secret key for production

4. **Start the server**:
   ```bash
   npm start
   # Or use PM2 for production: pm2 start index.js --name "ddc-backend"
   ```

### 3. Frontend Deployment

1. **Build the frontend**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Configure environment** (optional):
   ```bash
   cp .env.production .env
   # Edit if you need to override automatic detection
   ```

3. **Deploy built files**:
   - Copy `dist/` folder to your web server
   - Configure web server (nginx/apache) to serve the static files

### 4. Web Server Configuration (Nginx Example)

**Frontend Server**:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /path/to/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API calls to backend (if needed)
    location /api {
        proxy_pass http://backend-server-ip:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Backend Server** (if using nginx):
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Automatic Configuration

The app is designed to be **zero-config** for common setups:

### Frontend Auto-Detection
- **Development**: Uses `localhost:5000`
- **Production**: Automatically detects backend URL based on domain:
  - If frontend is at `yourdomain.com` → backend assumed at `api.yourdomain.com`
  - Or set `VITE_API_BASE_URL` explicitly

### CORS Configuration
- **Development**: Allows all localhost origins
- **Production**: Allows configured frontend URL and common patterns

## Environment Variables Reference

### Backend (.env)
```
PORT=5000                    # Backend port
HOST=0.0.0.0                # Bind to all interfaces
NODE_ENV=production          # Environment mode

DB_HOST=db-server            # Database server
DB_USER=user                 # DB username
DB_PASSWORD=password         # DB password
DB_NAME=ddc_developer        # Database name

JWT_SECRET=strong-secret     # JWT signing key
JWT_EXPIRES_IN=24h          # Token expiry

API_BASE_URL=https://api.domain.com    # Backend URL
FRONTEND_URL=https://domain.com        # Frontend URL
```

### Frontend (.env)
```
VITE_API_BASE_URL=https://api.domain.com  # Optional: explicit API URL
VITE_APP_NAME=DDC Developer               # App name
```

## Minimal Changes for Deployment

1. **Database**: Update DB connection details in `backend/.env`
2. **Backend**: Update `API_BASE_URL` and `FRONTEND_URL` in `backend/.env`
3. **Frontend**: Usually no changes needed (auto-detects)
4. **Web Server**: Configure nginx/apache to serve files and proxy API calls

## Security Notes

- Change `JWT_SECRET` to a strong, unique key
- Use HTTPS in production
- Configure firewall rules
- Use environment-specific database credentials
- Consider using Docker for easier deployment

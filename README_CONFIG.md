# Dynamic Configuration Setup

## Overview
This application now uses dynamic configuration for API base URLs, making it easy to change server endpoints without modifying code.

## Backend Configuration

### Files:
- `backend/src/config/config.js` - Main configuration file
- `backend/.env` - Environment variables

### Environment Variables:
```env
# Backend .env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ddc_developer
API_BASE_URL=http://localhost:5000
```

### Usage:
```javascript
const config = require('./src/config/config');
const PORT = config.server.port; // Uses env PORT or 5000
```

## Frontend Configuration

### Files:
- `frontend/src/config/config.js` - Frontend configuration
- `frontend/src/services/api.js` - Centralized API service
- `frontend/.env` - Frontend environment variables

### Environment Variables:
```env
# Frontend .env
VITE_API_BASE_URL=http://localhost:5000
```

### Usage:
```javascript
import config from '../config/config';
import apiService from '../services/api';

// Config automatically uses VITE_API_BASE_URL
const comments = await apiService.getCommentsByTask(taskId);
```

## Benefits

✅ **Single Source of Truth**: Change URLs in one place
✅ **Environment Flexibility**: Different URLs for dev/staging/prod
✅ **No Hardcoded URLs**: All API calls use configuration
✅ **Easy Deployment**: Just update environment variables
✅ **Type Safety**: Centralized API methods with error handling

## Changing API Base URL

### For Development:
1. Update `frontend/.env`: `VITE_API_BASE_URL=http://localhost:5000`
2. Update `backend/.env`: `API_BASE_URL=http://localhost:5000`

### For Production:
1. Set environment variables on your server
2. Or update the .env files for production URLs

## API Service Methods

The `apiService` provides centralized methods for all API calls:

```javascript
// Comments
await apiService.getCommentsByTask(taskId)
await apiService.createComment(data)

// Tasks
await apiService.getTasks(params)
await apiService.createTask(data)

// Users
await apiService.getUsers()
await apiService.createUser(data)

// And more...
```

This eliminates the need to manually construct fetch requests throughout the app.

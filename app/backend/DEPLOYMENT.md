# Backend Deployment Guide

## Shared Environment Variables

Regardless of the hosting provider, make sure the following variables are set:

- `MONGO_USER_URI`: MongoDB connection string for the user database
- `MONGO_DEVICE_URI`: MongoDB connection string for the device database
- `JWT_SECRET`: Secure random string for JWT token signing
- `FRONTEND_URL`: (optional) Allowed origin for CORS. If omitted, rely on the built-in allowlist.

---

## Deploying to Render

### MongoDB Setup

1. **Create MongoDB Atlas Cluster** (if you haven't already):
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a new cluster
   - Create a database user with read/write permissions
   - Get your connection strings

2. **Connection String Format**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
   ```

### Render Deployment Steps

1. **Connect your GitHub repository** to Render
2. **Create a new Web Service**
3. **Configure the service**:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `app/backend` (if deploying from root)

4. **Set Environment Variables** in Render dashboard:
   - Go to your service → Environment
   - Add all required environment variables

5. **Deploy** and check the logs for any errors

### Common Issues and Solutions

### MongoDB Connection Errors:
- **"MongoNetworkError"**: Check your connection string and network access
- **"Authentication failed"**: Verify username/password in connection string
- **"Server selection timeout"**: Check if your IP is whitelisted in MongoDB Atlas

### Environment Variable Issues:
- **"MONGO_USER_URI is not set"**: Add the environment variable in Render
- **"JWT_SECRET is not set"**: Add JWT_SECRET environment variable

### CORS Issues:
- Add your frontend URL to the allowed origins in the code
- Or set the `FRONTEND_URL` environment variable

### Testing Your Deployment

1. Check the deployment logs in Render
2. Test your API endpoints using the Render URL
3. Verify database connections are working

### Security Notes

---

## Deploying to Railway

### Service Layout

1. **Create a new Railway project** (or reuse an existing one).
2. **Add two services** inside the project:
   - **`backend` service** using the `app/backend` directory.
   - **`frontend` service** using the `app/frontend` directory (see the frontend deployment notes for build commands).

### Backend Service Configuration

- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Root Directory:** `app/backend`
- **Port:** Railway injects the `PORT` env variable automatically; no manual port configuration is required.
- **Environment Variables:** Set the same variables listed in the Shared Environment Variables section. You can optionally set:
  - `FRONTEND_URL` to the HTTPS URL of your Railway frontend service.
  - `NODE_ENV=production`

### Frontend Service Integration

- After deploying the frontend, note its HTTPS domain (for example, `https://your-frontend.up.railway.app`).
- Set `FRONTEND_URL` on the backend to this value so that CORS permits browser calls.
- On the frontend service, set:
  - `VITE_API_URL=https://your-backend.up.railway.app`
  - `VITE_WS_URL=wss://your-backend.up.railway.app`

### Verification Checklist

1. Deploy the backend service and confirm the health logs include `App listening on PORT`.
2. Deploy the frontend service and confirm it reaches the backend API (`/api/test/env`) without CORS errors.
3. Open the application in a browser and confirm WebSocket events stream from `wss://...railway.app`.

- Never commit `.env` files to your repository
- Use strong, unique passwords for MongoDB
- Generate a secure random string for JWT_SECRET
- Whitelist only necessary IP addresses in MongoDB Atlas 
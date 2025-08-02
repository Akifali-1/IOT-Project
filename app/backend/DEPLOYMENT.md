# Backend Deployment Guide for Render

## Environment Variables Required

Set these environment variables in your Render dashboard:

### Required Variables:
- `MONGO_USER_URI`: Your MongoDB connection string for user database
- `MONGO_DEVICE_URI`: Your MongoDB connection string for device database
- `JWT_SECRET`: A secure random string for JWT token signing

### Optional Variables:
- `FRONTEND_URL`: Your frontend URL for CORS configuration
- `PORT`: Port number (Render sets this automatically)

## MongoDB Setup

1. **Create MongoDB Atlas Cluster** (if you haven't already):
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a new cluster
   - Create a database user with read/write permissions
   - Get your connection strings

2. **Connection String Format**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
   ```

## Render Deployment Steps

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

## Common Issues and Solutions

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

## Testing Your Deployment

1. Check the deployment logs in Render
2. Test your API endpoints using the Render URL
3. Verify database connections are working

## Security Notes

- Never commit `.env` files to your repository
- Use strong, unique passwords for MongoDB
- Generate a secure random string for JWT_SECRET
- Whitelist only necessary IP addresses in MongoDB Atlas 
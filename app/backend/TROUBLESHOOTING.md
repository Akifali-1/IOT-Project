# MongoDB Connection Error Troubleshooting

## Error: `MongooseServerSelectionError: connect ECONNREFUSED ::1:27017, connect ECONNREFUSED 127.0.0.1:27017`

This error means your application is trying to connect to a local MongoDB instance instead of MongoDB Atlas.

## Root Cause
The environment variables `MONGO_USER_URI` and `MONGO_DEVICE_URI` are not set in Render, so Mongoose defaults to localhost.

## Solution Steps

### 1. Check Environment Variables in Render
1. Go to your Render dashboard
2. Select your backend service
3. Go to **Environment** tab
4. Verify these variables are set:
   - `MONGO_USER_URI`
   - `MONGO_DEVICE_URI`
   - `JWT_SECRET`

### 2. Test Environment Variables
After deployment, visit: `https://your-render-url.onrender.com/api/test/env`
This will show you which environment variables are set.

### 3. MongoDB Atlas Setup
If you don't have MongoDB Atlas set up:

1. **Create MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Sign up for free account

2. **Create Cluster**:
   - Click "Build a Database"
   - Choose "FREE" tier
   - Select cloud provider (AWS/Google Cloud/Azure)
   - Choose region close to your users
   - Click "Create"

3. **Create Database User**:
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Username: `iotuser` (or your choice)
   - Password: Create a strong password
   - Role: "Read and write to any database"
   - Click "Add User"

4. **Get Connection String**:
   - Go to "Database" in left sidebar
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

### 4. Set Environment Variables in Render

**For MONGO_USER_URI:**
```
mongodb+srv://iotuser:your_password@cluster0.xxxxx.mongodb.net/userdb?retryWrites=true&w=majority
```

**For MONGO_DEVICE_URI:**
```
mongodb+srv://iotuser:your_password@cluster0.xxxxx.mongodb.net/devicedb?retryWrites=true&w=majority
```

**For JWT_SECRET:**
Generate a random string (you can use an online generator)

### 5. Network Access
In MongoDB Atlas:
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### 6. Redeploy
After setting environment variables:
1. Go back to your Render service
2. Click "Manual Deploy"
3. Select "Deploy latest commit"

### 7. Check Logs
After deployment, check the logs in Render to see:
- Environment variable status
- Database connection attempts
- Any remaining errors

## Common Issues

### Issue: "Authentication failed"
- Check username/password in connection string
- Verify database user has correct permissions

### Issue: "Server selection timeout"
- Check if IP is whitelisted in MongoDB Atlas
- Verify connection string format

### Issue: "Environment variables not set"
- Double-check variable names in Render
- Ensure no extra spaces in values
- Redeploy after setting variables

## Testing Your Fix

1. **Check environment variables**: Visit `/api/test/env`
2. **Test database connection**: Check Render logs for "connected successfully"
3. **Test API endpoints**: Try your existing endpoints

## Security Notes

- Use strong passwords for MongoDB users
- Consider IP whitelisting for production
- Generate a secure JWT_SECRET
- Never commit connection strings to git 
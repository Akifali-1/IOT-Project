# Frontend Deployment Guide for Vercel

## Environment Variables Setup

### 1. Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your frontend project
3. Go to **Settings** → **Environment Variables**
4. Add the following environment variable:

**Variable Name:** `VITE_API_URL`
**Value:** `https://iot-project-4.onrender.com`
**Environment:** Production, Preview, Development

### 2. Redeploy Your Frontend

After setting the environment variable:
1. Go to your project in Vercel
2. Click **Deployments**
3. Click **Redeploy** on your latest deployment

## Local Development

For local development, create a `.env.local` file in the frontend directory:

```
VITE_API_URL=http://localhost:8080
```

## Testing Your Setup

1. **Check Environment Variables**: Visit your deployed frontend and open browser console
2. **Test Signup/Login**: Try the signup and login functionality
3. **Test API Calls**: Check if all API calls are working

## Common Issues

### Issue: "VITE_API_URL is not defined"
- Make sure the environment variable is set in Vercel
- Redeploy after setting the variable

### Issue: CORS errors
- Check that your backend CORS settings include your Vercel domain
- Update backend CORS if needed

### Issue: API calls still going to localhost
- Clear browser cache
- Hard refresh the page (Ctrl+F5)
- Check that the environment variable is correctly set

## Backend URL

Your backend is deployed at: `https://iot-project-4.onrender.com`

Make sure this URL is correct in your environment variables. 
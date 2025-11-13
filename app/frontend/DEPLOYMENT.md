# Frontend Deployment Guide

## Deploying to Render (Recommended)

### Service Setup

1. In Render, create a new **Static Site** (or **Web Service** if you prefer running `serve`).
2. Set the **Root Directory** to `app/frontend`.
3. Use the following commands:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - (If using a Web Service instead) **Start Command:** `npm install -g serve && serve -s dist`

Render will host the compiled assets over HTTPS automatically.

### Environment Variables

Add these variables under the Render service **Environment** tab:
- `VITE_API_URL=https://iot-project-1pup.onrender.com`
- `VITE_WS_URL=wss://iot-project-1pup.onrender.com`

Redeploy the site whenever you update these values or change backend domains.

### Connect to the Backend

After the backend is deployed on Render, copy its URL (`https://iot-project-1pup.onrender.com`) and plug it into the variables above. Rebuild the frontend so the URLs are bundled into the static assets.

## Deploying to Vercel (Alternative)

Follow the same environment variables pattern in Vercel:
- `VITE_API_URL=https://iot-project-1pup.onrender.com`
- `VITE_WS_URL=wss://iot-project-1pup.onrender.com`

Remember to redeploy after any changes.

## Deploying to Railway (Alternative)

If you later switch back to Railway, use the same build commands and set the env vars to the Railway backend’s domain (`https://<backend>.up.railway.app` and `wss://<backend>.up.railway.app`).

## Local Development

Create a `.env.local` in the `frontend` directory:

```
VITE_API_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080
```

## Testing Checklist

1. Confirm environment variables in the deployed app via browser devtools.
2. Exercise signup/login flows to ensure API connectivity.
3. Toggle devices and confirm WebSocket updates arrive without errors.

## Troubleshooting

- **"VITE_* is not defined"**: Check that the variable exists in the hosting provider and redeploy the frontend.
- **CORS errors**: Ensure the backend `FRONTEND_URL` contains your deployed frontend domain.
- **API calls hitting localhost**: Clear browser cache and verify the `.env` values baked into the build.
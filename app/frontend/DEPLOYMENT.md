# Frontend Deployment Guide

## Deploying to Vercel

### Environment Variables Setup

1. Go to your Vercel dashboard.
2. Select your frontend project.
3. Navigate to **Settings → Environment Variables**.
4. Add the following variables (all environments: Production, Preview, Development):
   - `VITE_API_URL=https://iot-project-4.onrender.com`
   - `VITE_WS_URL=wss://iot-project-4.onrender.com`

### Redeploy After Updating Variables

1. Go to the **Deployments** tab.
2. Click **Redeploy** on the most recent deployment so the new values are baked into the bundle.

## Deploying to Railway

### Service Configuration

1. In your Railway project, add a new **Static Site** (or **Node** service if you prefer `serve`).
2. Set the project root to `app/frontend`.
3. Recommended commands:
   - **Build Command:** `npm install && npm run build`
   - **Start Command (Static Site):** leave empty – Railway will serve `dist/`.
   - **Start Command (Node service):** `npm install -g serve && serve -s dist`

### Environment Variables

Set the following on the Railway frontend service:
- `VITE_API_URL=https://<your-backend-service>.up.railway.app`
- `VITE_WS_URL=wss://<your-backend-service>.up.railway.app`

Redeploy the service whenever these variables change.

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
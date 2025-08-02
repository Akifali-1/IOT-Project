# Deployment Checklist

## ✅ Frontend Compatibility Check

### Environment Variables
- [x] All components use `VITE_API_URL` instead of hardcoded localhost
- [x] Components updated:
  - [x] Signup.jsx
  - [x] Login.jsx
  - [x] WeeklyUsageChart.jsx
  - [x] Reports.jsx
  - [x] device.jsx
  - [x] BillPage.jsx
  - [x] deviceUtils.js
  - [x] Navbar.jsx
  - [x] guest_login.jsx

### Code Issues Fixed
- [x] WeeklyUsageChart.jsx - Fixed missing state variables
- [x] All localhost URLs replaced with environment variables

## ✅ Backend Compatibility Check

### Database Connections
- [x] UserDB connection working
- [x] DevicesDB connection working
- [x] DeviceUsage model using correct database connection
- [x] WebSocket server fixed (removed localhost connection)

### CORS Configuration
- [x] Updated to include Vercel domains:
  - [x] https://smarthome-peach.vercel.app
  - [x] https://iot-project-frontend.vercel.app
  - [x] https://iot-project-frontend-git-main.vercel.app
  - [x] https://iot-project-frontend-git-master.vercel.app
- [x] Added origin logging for debugging

### Environment Variables
- [x] MONGO_USER_URI set in Render
- [x] MONGO_DEVICE_URI set in Render
- [x] JWT_SECRET set in Render

## 🔄 What Needs to be Redeployed

### Backend (Render)
**YES - Need to redeploy** because:
- [x] Updated CORS configuration
- [x] Fixed WebSocket connection
- [x] Added origin logging

### Frontend (Vercel)
**YES - Need to redeploy** because:
- [x] Updated all components to use environment variables
- [x] Fixed WeeklyUsageChart component
- [x] Need to set VITE_API_URL environment variable

## 📋 Deployment Steps

### 1. Backend (Render)
1. Push changes to GitHub
2. Render will auto-deploy
3. Check logs for any errors

### 2. Frontend (Vercel)
1. Set environment variable in Vercel:
   - Name: `VITE_API_URL`
   - Value: `https://iot-project-4.onrender.com`
2. Redeploy frontend
3. Test signup/login functionality

## 🧪 Testing Checklist

### Backend Tests
- [ ] Visit: `https://iot-project-4.onrender.com/api/test/env`
- [ ] Visit: `https://iot-project-4.onrender.com/api/test/db`
- [ ] Check logs for CORS origin logging

### Frontend Tests
- [ ] Test signup functionality
- [ ] Test login functionality
- [ ] Test device management
- [ ] Test usage calculations
- [ ] Test weekly usage chart

## 🚨 Common Issues to Watch For

### CORS Issues
- Check browser console for CORS errors
- Verify Vercel domain is in allowed origins
- Check backend logs for blocked origins

### Environment Variable Issues
- Ensure VITE_API_URL is set in Vercel
- Redeploy frontend after setting environment variable
- Clear browser cache if needed

### Database Issues
- Check if MongoDB connections are working
- Verify environment variables are set in Render
- Check backend logs for connection errors

## 📞 Support URLs

- **Backend:** https://iot-project-4.onrender.com
- **Frontend:** Your Vercel URL
- **Backend Test:** https://iot-project-4.onrender.com/api/test/env 
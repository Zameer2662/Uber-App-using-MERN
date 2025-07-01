# Socket Connection Troubleshooting Guide

## Issue: WebSocket connection failed

### Solution Steps:

1. **Start Backend Server:**
   ```bash
   cd Backend
   npm start
   # OR
   node server.js
   ```

2. **Check if server is running:**
   - Open browser: http://localhost:4000
   - Should show "Hello World"
   - Health check: http://localhost:4000/health

3. **Check port availability:**
   ```bash
   netstat -an | find "4000"
   ```

4. **If port 4000 is busy:**
   - Change PORT in Backend/.env file
   - Update VITE_BASE_URL in Frontend/.env file

5. **Check environment variables:**
   - Backend/.env should have PORT=4000
   - Frontend/.env should have VITE_BASE_URL=http://localhost:4000

6. **Restart both servers:**
   ```bash
   # Terminal 1 - Backend
   cd Backend
   npm start

   # Terminal 2 - Frontend  
   cd Frontend
   npm run dev
   ```

### Common Errors:
- `WebSocket is closed before connection` = Backend not running
- `xhr poll error` = Backend not accessible
- `ECONNREFUSED` = Backend server down

### Connection Status:
- Green dot = Connected ✅
- Red dot = Disconnected ❌  
- Yellow dot = Connecting ⏳

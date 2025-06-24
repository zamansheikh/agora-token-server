# CORS Configuration Guide for Agora Token Server

## 📋 CORS Options in .env file

### 1. **Allow All Origins (Wildcard)**
```env
ALLOWED_ORIGINS=*
```
**Use Case**: Development, testing, or when you want to allow any website/app to access your API
**Security**: ⚠️ **Low security** - any website can call your API

### 2. **Specific Origins (Recommended for Production)**
```env
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com,https://www.yourdomain.com
```
**Use Case**: Production deployment with specific domains
**Security**: ✅ **High security** - only listed domains can access your API

### 3. **Local Development + Production**
```env
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,https://yourdomain.com
```
**Use Case**: Mixed environment (local testing + production)
**Security**: ✅ **Medium security** - controlled list of origins

### 4. **Local Network + Mobile Development**
```env
ALLOWED_ORIGINS=http://localhost:3000,http://192.168.1.100:3000,http://10.0.0.100:3000
```
**Use Case**: Testing with mobile devices on local network
**Security**: ✅ **Medium security** - network-specific access

## 🚀 Quick Setup Examples

### For Development (Allow All):
```env
ALLOWED_ORIGINS=*
```

### For Production:
```env
ALLOWED_ORIGINS=https://myflutterapp.com,https://api.myflutterapp.com
```

### For Flutter Web + Mobile:
```env
ALLOWED_ORIGINS=https://myapp.web.app,https://myapp.firebaseapp.com
```

## 📱 Flutter App Configuration

### If using wildcard (*):
```dart
class AgoraTokenService {
  // Can use any base URL
  static const String baseUrl = 'http://your-server-ip:3000/api';
}
```

### If using specific origins:
Make sure your Flutter web app is deployed on the allowed domain, or add your development URLs to ALLOWED_ORIGINS.

## 🔒 Security Recommendations

### ✅ **For Production:**
- Never use `*` in production
- Use HTTPS URLs only
- List only your actual domains
- Consider using environment-specific .env files

### ⚠️ **For Development:**
- `*` is okay for local testing
- Add your local IP for mobile device testing
- Use localhost for web development

### 🛡️ **Additional Security:**
- The server already includes rate limiting
- Consider adding API key authentication for production
- Use HTTPS in production (not HTTP)

## 📝 Examples by Use Case

### Case 1: Pure Development
```env
ALLOWED_ORIGINS=*
```

### Case 2: Flutter Web App
```env
ALLOWED_ORIGINS=http://localhost:3000,https://myapp.web.app
```

### Case 3: Mobile App Development
```env
ALLOWED_ORIGINS=http://192.168.1.100:3000,http://10.0.0.50:3000
```

### Case 4: Production Deployment
```env
ALLOWED_ORIGINS=https://api.mycompany.com,https://app.mycompany.com
```

## 🔧 Testing CORS Configuration

You can test if CORS is working by checking the server logs. The updated server will show:
- `🌐 CORS: Allowing all origins (wildcard enabled)` - when using `*`
- `✅ CORS: Allowed origin - https://example.com` - when origin is allowed
- `❌ CORS: Blocked origin - https://example.com` - when origin is blocked

## ⚡ Quick Commands

### Allow all origins (development):
```bash
# Edit .env file
ALLOWED_ORIGINS=*
```

### Reset to specific origins:
```bash
# Edit .env file
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

Remember to restart your server after changing the .env file!

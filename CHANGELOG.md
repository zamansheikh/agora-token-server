# Changelog

## Version 2.0.0 - Major Update (January 2026)

### 🎉 New Features

#### Admin Panel

- ✨ Beautiful, modern web-based admin panel
- 🎨 Gradient design with smooth animations
- 📱 Fully responsive for mobile and desktop
- 🔐 Password-protected access
- 🌈 Intuitive navigation between sections

#### Configuration Management

- ⚙️ Real-time configuration updates (no restart needed)
- 💾 JSON-based configuration storage
- 🔄 Update Agora App ID and Certificate on-the-fly
- 🎯 Set default values for token generation
- 🔐 Change admin password securely

#### Statistics & Monitoring

- 📊 Real-time request statistics
- 📈 Track RTC, RTM, and admin requests separately
- 📜 Request history (last 100 requests)
- ⏰ Timestamp tracking
- 🔄 Auto-refresh every 30 seconds
- 🗑️ Reset statistics option

#### Simple GET Endpoints

- 🚀 GET endpoints for both RTC and RTM tokens
- ✅ No data passing required from frontend
- 🎯 Uses backend configuration as defaults
- 🔧 Optional query parameters for customization
- 📝 Cleaner, simpler API

#### Token Testing

- 🧪 Built-in token testing interface
- ✅ Test RTC and RTM token generation
- 📋 Copy tokens to clipboard
- 👁️ View complete response data
- 🎯 Perfect for debugging

#### Developer Experience

- 📚 Comprehensive documentation
- 🎓 Quick start guide
- 💡 Flutter integration examples
- 📖 Admin panel guide
- 🔍 Better error messages

### 🔧 Improvements

#### Backend

- Enhanced error handling
- Better configuration validation
- Improved logging with emojis
- ConfigManager for centralized config
- Statistics tracking middleware

#### API

- Consistent response format
- Better error messages
- Added expireAt timestamp
- More detailed responses

#### Security

- Admin password protection
- Certificate masking in responses
- Rate limiting (existing)
- CORS configuration (existing)

### 📁 New Files

#### Configuration

- `config/config.json` - Server configuration storage
- `config/stats.json` - Statistics data storage
- `config/config.example.json` - Configuration example

#### Admin Panel

- `public/admin.html` - Admin panel interface
- `public/css/admin.css` - Beautiful styling
- `public/js/admin.js` - Interactive functionality

#### Backend

- `routes/admin.js` - Admin API routes
- `utils/configManager.js` - Configuration management

#### Documentation

- `ADMIN_GUIDE.md` - Complete admin panel guide
- `QUICKSTART.md` - 3-minute quick start guide
- `examples/flutter_get_integration.dart` - GET method examples

### 🔄 Modified Files

#### Core

- `server.js` - Added admin routes and static file serving
- `routes/token.js` - Added GET endpoints and statistics tracking
- `README.md` - Updated with new features
- `.gitignore` - Added config files

### 🎯 API Changes

#### New Endpoints

```
GET  /api/token/rtc        - Get RTC token (with defaults)
GET  /api/token/rtm        - Get RTM token (with defaults)
GET  /api/admin/config     - Get configuration
POST /api/admin/config     - Update configuration
GET  /api/admin/stats      - Get statistics
POST /api/admin/stats/reset - Reset statistics
POST /api/admin/verify     - Verify admin password
```

#### Enhanced Endpoints

- `POST /api/token/rtc` - Now tracks statistics
- `POST /api/token/rtm` - Now tracks statistics
- `GET /api/token/info` - Updated endpoint list

### 📊 Statistics Tracked

- Total requests
- RTC token requests
- RTM token requests
- Admin panel requests
- Request history with timestamps
- Last reset timestamp

### 🔐 Security

- Admin panel password protection
- App certificate never exposed
- Session-based authentication
- Rate limiting (existing)
- CORS configuration (existing)

### 💡 Default Configuration

```json
{
  "agoraAppId": "",
  "agoraAppCertificate": "",
  "adminPassword": "admin123",
  "defaultChannelName": "test-channel",
  "defaultUid": "0",
  "defaultRole": "publisher",
  "defaultExpireTime": 3600
}
```

### 🚀 Migration Guide

#### From v1.x to v2.0

1. **Update dependencies**: Run `npm install`
2. **Start server**: Run `npm start`
3. **Access admin panel**: Visit `/admin.html`
4. **Configure credentials**: Set your Agora credentials
5. **Change password**: Update default admin password
6. **Test endpoints**: Use the built-in tester

No breaking changes to existing POST endpoints!

### ⚠️ Important Notes

- Default admin password is `admin123` - **CHANGE IT IMMEDIATELY**
- Configuration stored in `config/` directory
- Statistics reset on server restart (unless saved)
- GET endpoints use backend defaults
- POST endpoints work as before

### 🐛 Bug Fixes

- Fixed configuration loading issues
- Improved error handling
- Better CORS error messages
- Enhanced validation

### 📚 Documentation

- Added comprehensive admin panel guide
- Created quick start guide
- Updated README with new features
- Added Flutter GET integration examples
- Improved inline code comments

### 🎨 UI Features

#### Admin Panel Sections

1. **Overview Dashboard**
   - Statistics cards with gradients
   - Server status information
   - API endpoint list
   - Current configuration display

2. **Configuration Page**
   - Form-based configuration
   - Real-time validation
   - Success/error messages
   - Password change option

3. **Statistics Page**
   - Detailed breakdowns
   - Request history timeline
   - Reset functionality
   - Last reset timestamp

4. **Test Tokens Page**
   - RTC token tester
   - RTM token tester
   - Copy to clipboard
   - Full response viewer

### 🔮 Future Plans

- [ ] Database integration option
- [ ] User management system
- [ ] Advanced analytics
- [ ] Token revocation
- [ ] Webhook support
- [ ] Multi-language support
- [ ] Dark mode theme

---

## Version 1.0.0 - Initial Release

### Features

- Basic RTC token generation (POST)
- Basic RTM token generation (POST)
- Environment variable configuration
- CORS support
- Rate limiting
- Health check endpoint
- Flutter integration examples

---

**Current Version:** 2.0.0  
**Release Date:** January 21, 2026  
**Status:** Stable ✅

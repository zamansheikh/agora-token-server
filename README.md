# Agora Token Server

A Node.js server that generates Agora RTC and RTM tokens for Flutter applications with a beautiful admin panel for configuration and monitoring.

## ✨ Features

### Core Features

- 🎥 Generate RTC tokens for video/audio calls
- 💬 Generate RTM tokens for real-time messaging
- 🚀 Simple GET endpoints - no data passing required!
- 🔧 Backend configuration storage
- 🌐 CORS support for Flutter web applications
- 🛡️ Rate limiting for security
- 📊 Real-time statistics tracking

### Admin Panel Features (NEW!)

- 🎨 Beautiful, modern web interface
- ⚙️ Real-time configuration management
- 📈 Request statistics and monitoring
- 🧪 Built-in token testing
- 🔐 Password-protected access
- 📱 Responsive design

## 🚀 Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the server:**

   ```bash
   npm start
   ```

3. **Access Admin Panel:**
   - Open: `http://localhost:3000/admin.html`
   - Default password: `admin123` (⚠️ change this immediately!)

4. **Configure via Admin Panel:**
   - Enter your Agora App ID and Certificate
   - Set default values for tokens
   - Start generating tokens!

## 📖 Documentation

- [Admin Panel Guide](ADMIN_GUIDE.md) - Complete guide for admin panel
- [CORS Configuration](CORS_GUIDE.md) - CORS setup instructions

## 🔧 Configuration

### Option 1: Admin Panel (Recommended)

Configure everything through the beautiful web interface at `/admin.html`

### Option 2: Environment Variables

Create a `.env` file:

```env
AGORA_APP_ID=your_app_id
AGORA_APP_CERTIFICATE=your_app_certificate
ADMIN_PASSWORD=your_secure_password
PORT=3000
```

## 📡 API Endpoints

### 🆕 GET Endpoints (Easiest - No Data Required!)

#### Get RTC Token

**Endpoint:** `GET /api/token/rtc`

**Query Parameters (all optional):**

- `channelName` - Channel name (uses backend default if not provided)
- `uid` - User ID (uses backend default if not provided)
- `role` - "publisher" or "subscriber" (uses backend default)
- `expireTime` - Expiration in seconds (uses backend default)

**Examples:**

```bash
# Use all defaults from backend
GET http://localhost:3000/api/token/rtc

# Custom channel name
GET http://localhost:3000/api/token/rtc?channelName=my-channel

# Custom channel and UID
GET http://localhost:3000/api/token/rtc?channelName=my-channel&uid=12345
```

**Response:**

```json
{
  "success": true,
  "token": "006...",
  "appId": "your_app_id",
  "channelName": "test-channel",
  "uid": 0,
  "role": "publisher",
  "expireTime": 3600,
  "expireAt": "2026-01-21T10:30:00.000Z"
}
```

#### Get RTM Token

**Endpoint:** `GET /api/token/rtm`

**Query Parameters (all optional):**

- `uid` - User ID (uses backend default if not provided)
- `expireTime` - Expiration in seconds (uses backend default)

**Examples:**

```bash
# Use defaults
GET http://localhost:3000/api/token/rtm

# Custom UID
GET http://localhost:3000/api/token/rtm?uid=user123
```

**Response:**

```json
{
  "success": true,
  "token": "006...",
  "appId": "your_app_id",
  "uid": "0",
  "expireTime": 3600,
  "expireAt": "2026-01-21T10:30:00.000Z"
}
```

### POST Endpoints (Traditional Method)

#### Generate RTC Token

**Endpoint:** `POST /api/token/rtc`

**Request Body:**

```json
{
  "channelName": "test_channel",
  "uid": 12345,
  "role": "publisher",
  "expireTime": 3600
}
```

**Response:**

```json
{
  "success": true,
  "token": "generated_rtc_token_here",
  "appId": "your_app_id",
  "channelName": "test_channel",
  "uid": 12345,
  "role": "publisher",
  "expireTime": 3600,
  "expireAt": "2026-01-21T10:30:00.000Z"
}
```

#### Generate RTM Token

**Endpoint:** `POST /api/token/rtm`

**Request Body:**

```json
{
  "uid": "user_12345",
  "expireTime": 3600
}
```

**Response:**

```json
{
  "success": true,
  "token": "generated_rtm_token_here",
  "appId": "your_app_id",
  "uid": "user_12345",
  "expireTime": 3600,
  "expireAt": "2026-01-21T10:30:00.000Z"
}
```

### Other Endpoints

#### Health Check

**Endpoint:** `GET /api/health`

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2026-01-21T10:00:00.000Z",
  "uptime": 12345,
  "environment": "production"
}
```

#### Admin Panel

**URL:** `http://localhost:3000/admin.html`

See [Admin Panel Guide](ADMIN_GUIDE.md) for complete documentation.

## Parameters

### RTC Token Parameters:

- `channelName` (string): The channel name
- `uid` (number): User ID (0 for dynamic assignment)
- `role` (string): "publisher" or "subscriber"
- `expireTime` (number): Token expiration time in seconds (default: 3600)

### RTM Token Parameters:

- `uid` (string): User ID for RTM
- `expireTime` (number): Token expiration time in seconds (default: 3600)

## 📱 Flutter Integration

### 🆕 Simple GET Method (Recommended)

See [examples/flutter_get_integration.dart](examples/flutter_get_integration.dart) for complete code.

**Quick Example:**

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

// Get token with backend defaults (simplest)
Future<String?> getToken() async {
  final response = await http.get(
    Uri.parse('http://your-server:3000/api/token/rtc'),
  );

  if (response.statusCode == 200) {
    final data = json.decode(response.body);
    return data['token'];
  }
  return null;
}

// Get token with custom channel
Future<String?> getTokenCustom(String channel) async {
  final response = await http.get(
    Uri.parse('http://your-server:3000/api/token/rtc?channelName=$channel'),
  );

  if (response.statusCode == 200) {
    final data = json.decode(response.body);
    return data['token'];
  }
  return null;
}
```

### Traditional POST Method

See [examples/flutter_integration.dart](examples/flutter_integration.dart) for complete POST method examples.

## 🎨 Admin Panel Features

### Configuration Management

- ✅ Update Agora App ID and Certificate in real-time
- ✅ Set default channel name, UID, role, and expiration
- ✅ Change admin password securely
- ✅ No server restart required

### Statistics Dashboard

- 📊 Total requests counter
- 📊 RTC token requests
- 📊 RTM token requests
- 📊 Admin panel requests
- 📜 Request history (last 100 requests)
- 🔄 Auto-refresh every 30 seconds

### Token Testing

- 🧪 Test RTC token generation
- 🧪 Test RTM token generation
- 📋 Copy tokens to clipboard
- 👁️ View complete response data

### Beautiful UI

- 🎨 Modern gradient design
- 📱 Fully responsive
- 🌈 Animated transitions
- 💫 Intuitive navigation

## 🔐 Security Notes

- Rate limiting prevents abuse (configurable)
- CORS configured for cross-origin security
- Admin panel password protected
- App Certificate never exposed in responses
- HTTPS ready for production
- Environment variable support

## 🚀 Deployment

### Development

```bash
npm run dev
```

### Production with PM2

```bash
npm install -g pm2
pm2 start server.js --name agora-token-server
pm2 save
pm2 startup
```

### Docker (Optional)

```bash
docker build -t agora-token-server .
docker run -p 3000:3000 -d agora-token-server
```

## 📝 Environment Variables

```env
# Agora Configuration (Optional - can configure via admin panel)
AGORA_APP_ID=your_app_id
AGORA_APP_CERTIFICATE=your_app_certificate

# Server Configuration
PORT=3000
NODE_ENV=production

# Admin Panel
ADMIN_PASSWORD=your_secure_password

# CORS Configuration
ALLOWED_ORIGINS=*

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🆘 Troubleshooting

### Can't access admin panel

1. Ensure server is running
2. Visit: `http://localhost:3000/admin.html`
3. Check browser console for errors
4. Verify firewall allows port 3000

### Configuration not saving

1. Check `config/` directory exists and is writable
2. Verify admin password is correct
3. Check server logs for errors

### GET endpoints return errors

1. Configure credentials via admin panel
2. Test tokens in admin panel's Test section
3. Check server logs

## 📚 Additional Documentation

- [Admin Panel Guide](ADMIN_GUIDE.md) - Complete admin panel documentation
- [CORS Configuration](CORS_GUIDE.md) - CORS setup guide
- [Flutter GET Integration](examples/flutter_get_integration.dart) - GET method examples
- [Flutter POST Integration](examples/flutter_integration.dart) - POST method examples

## 🎯 What's New in v2.0

- ✨ Beautiful admin panel with real-time configuration
- 🚀 Simple GET endpoints - no data passing required
- 📊 Request statistics and monitoring
- 🧪 Built-in token testing interface
- 💾 Configuration storage in JSON files
- 🔄 Real-time updates without server restart
- 📱 Responsive admin interface

## License

MIT License

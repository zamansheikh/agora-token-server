# Admin Panel Guide

## Overview

The Agora Token Server now includes a beautiful, feature-rich admin panel for managing your server configuration and monitoring token requests in real-time.

## Features

### 1. **Configuration Management**

- Update Agora App ID and App Certificate without restarting the server
- Set default values for channel name, UID, role, and expiration time
- Change admin password for enhanced security
- All changes are saved immediately and apply to new requests

### 2. **Real-time Statistics**

- Monitor total requests, RTC tokens, RTM tokens, and admin requests
- View detailed request history (last 100 requests)
- Track when statistics were last reset
- Auto-refresh every 30 seconds

### 3. **GET Endpoints**

- Simple GET endpoints for token generation
- No need to pass data from frontend
- Uses default configuration from backend
- Optional query parameters for customization

### 4. **Token Testing**

- Built-in token testing interface
- Test RTC and RTM token generation
- Copy tokens directly to clipboard
- View full response data

## Getting Started

### 1. Access Admin Panel

Navigate to: `http://localhost:3000/admin.html` (or your server URL)

### 2. Login

**Default Password:** `admin123`

⚠️ **Important:** Change this password immediately via the Configuration section!

### 3. Configure Your Server

1. Click on **Configuration** in the navigation
2. Enter your Agora credentials:
   - **Agora App ID**: Your application identifier from Agora Console
   - **Agora App Certificate**: Your application certificate (keep secret!)
3. Optionally configure defaults:
   - Default Channel Name
   - Default UID
   - Default Role (publisher/subscriber)
   - Default Expiration Time (in seconds)
4. Click **Save Configuration**

## Using GET Endpoints

### RTC Token (GET)

**Endpoint:** `GET /api/token/rtc`

**Query Parameters (all optional):**

- `channelName` - Channel name (uses default if not provided)
- `uid` - User ID (uses default if not provided)
- `role` - Role: "publisher" or "subscriber" (uses default if not provided)
- `expireTime` - Expiration time in seconds (uses default if not provided)

**Examples:**

```bash
# Use all defaults
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
  "appId": "your-app-id",
  "channelName": "test-channel",
  "uid": 0,
  "role": "publisher",
  "expireTime": 3600,
  "expireAt": "2026-01-21T10:30:00.000Z"
}
```

### RTM Token (GET)

**Endpoint:** `GET /api/token/rtm`

**Query Parameters (all optional):**

- `uid` - User ID (uses default if not provided)
- `expireTime` - Expiration time in seconds (uses default if not provided)

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
  "appId": "your-app-id",
  "uid": "0",
  "expireTime": 3600,
  "expireAt": "2026-01-21T10:30:00.000Z"
}
```

## Admin Panel Sections

### 📊 Overview

- Real-time statistics cards
- Server status information
- Quick view of available endpoints
- Current App ID display (partial for security)

### ⚙️ Configuration

- Update Agora credentials
- Set default token parameters
- Change admin password
- All changes apply immediately

### 📈 Statistics

- Detailed request breakdown
- Request history timeline
- Reset statistics option
- Last reset timestamp

### 🧪 Test Tokens

- Test RTC token generation
- Test RTM token generation
- View full response data
- Copy tokens to clipboard

## Security Features

1. **Password Protection**: Admin panel requires password authentication
2. **Session Management**: Password stored in memory only
3. **Certificate Masking**: App certificate never displayed in responses
4. **HTTPS Ready**: Works with HTTPS for production deployments

## Configuration Storage

All configuration is stored in JSON files:

- `config/config.json` - Server configuration
- `config/stats.json` - Statistics data

These files are automatically created on first run with default values.

## API Endpoints

### Admin API (Password Protected)

All admin endpoints require password in header:

```
x-admin-password: your-password
```

**Endpoints:**

- `POST /api/admin/verify` - Verify admin password
- `GET /api/admin/config` - Get current configuration
- `POST /api/admin/config` - Update configuration
- `GET /api/admin/stats` - Get statistics
- `POST /api/admin/stats/reset` - Reset statistics

## Tips & Best Practices

1. **Change Default Password**: First thing after installation
2. **Use Environment Variables**: Set credentials in `.env` for production
3. **Monitor Statistics**: Check request patterns regularly
4. **Test Tokens**: Use built-in tester before deployment
5. **Backup Config**: Keep backup of `config/config.json`

## Troubleshooting

### Cannot access admin panel

- Check server is running on correct port
- Verify URL: `http://localhost:3000/admin.html`
- Check browser console for errors

### Configuration not saving

- Check file permissions for `config/` directory
- Verify admin password is correct
- Check server logs for errors

### GET endpoints return errors

- Ensure configuration is set via admin panel
- Check Agora credentials are valid
- Verify default values are configured

## Support

For issues or questions:

1. Check server logs for error messages
2. Verify Agora credentials in console
3. Test token generation in admin panel
4. Review configuration settings

---

**Version:** 2.0.0  
**Last Updated:** January 2026

# Agora Token Server

A Node.js server that generates Agora RTC and RTM tokens for Flutter applications.

## Features

- Generate RTC tokens for video/audio calls
- Generate RTM tokens for real-time messaging
- CORS support for Flutter web applications
- Rate limiting for security
- Environment-based configuration
- RESTful API endpoints

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env` file and update with your Agora credentials
   - Get your App ID and App Certificate from [Agora Console](https://console.agora.io/)

3. **Update `.env` file:**
   ```
   AGORA_APP_ID=your_actual_app_id
   AGORA_APP_CERTIFICATE=your_actual_app_certificate
   ```

## Running the Server

### Development mode:
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server will run on `http://localhost:3000` by default.

## API Endpoints

### 1. Generate RTC Token
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
  "appId": "your_app_id"
}
```

### 2. Generate RTM Token
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
  "appId": "your_app_id"
}
```

### 3. Health Check
**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2023-12-01T10:00:00.000Z"
}
```

## Parameters

### RTC Token Parameters:
- `channelName` (string): The channel name
- `uid` (number): User ID (0 for dynamic assignment)
- `role` (string): "publisher" or "subscriber"
- `expireTime` (number): Token expiration time in seconds (default: 3600)

### RTM Token Parameters:
- `uid` (string): User ID for RTM
- `expireTime` (number): Token expiration time in seconds (default: 3600)

## Flutter Integration

### Example Flutter HTTP request:

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class AgoraTokenService {
  static const String baseUrl = 'http://localhost:3000/api';
  
  static Future<Map<String, dynamic>> getRtcToken({
    required String channelName,
    required int uid,
    required String role,
    int expireTime = 3600,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/token/rtc'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'channelName': channelName,
        'uid': uid,
        'role': role,
        'expireTime': expireTime,
      }),
    );
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to get RTC token');
    }
  }
  
  static Future<Map<String, dynamic>> getRtmToken({
    required String uid,
    int expireTime = 3600,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/token/rtm'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'uid': uid,
        'expireTime': expireTime,
      }),
    );
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to get RTM token');
    }
  }
}
```

## Security Notes

- The server includes rate limiting to prevent abuse
- CORS is configured for security
- Always use HTTPS in production
- Store sensitive credentials in environment variables
- Consider implementing additional authentication for production use

## Deployment

For production deployment, consider:
- Using PM2 for process management
- Setting up HTTPS with SSL certificates
- Configuring proper firewall rules
- Using environment-specific configuration files

## License

MIT License

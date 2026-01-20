import 'dart:convert';
import 'package:http/http.dart' as http;

/// Example Flutter integration using GET endpoints
/// No need to pass any data - all configured on backend!

class AgoraTokenService {
  final String baseUrl;

  AgoraTokenService({required this.baseUrl});

  /// Get RTC Token using defaults from backend
  /// No parameters needed - uses backend configuration
  Future<RtcTokenResponse?> getRtcToken() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/api/token/rtc'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return RtcTokenResponse.fromJson(data);
        }
      }
      return null;
    } catch (e) {
      print('Error getting RTC token: $e');
      return null;
    }
  }

  /// Get RTC Token with custom parameters (optional)
  Future<RtcTokenResponse?> getRtcTokenCustom({
    String? channelName,
    int? uid,
    String? role,
    int? expireTime,
  }) async {
    try {
      final queryParams = <String, String>{};
      if (channelName != null) queryParams['channelName'] = channelName;
      if (uid != null) queryParams['uid'] = uid.toString();
      if (role != null) queryParams['role'] = role;
      if (expireTime != null) queryParams['expireTime'] = expireTime.toString();

      final uri = Uri.parse(
        '$baseUrl/api/token/rtc',
      ).replace(queryParameters: queryParams.isEmpty ? null : queryParams);

      final response = await http.get(uri);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return RtcTokenResponse.fromJson(data);
        }
      }
      return null;
    } catch (e) {
      print('Error getting RTC token: $e');
      return null;
    }
  }

  /// Get RTM Token using defaults from backend
  Future<RtmTokenResponse?> getRtmToken() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/api/token/rtm'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return RtmTokenResponse.fromJson(data);
        }
      }
      return null;
    } catch (e) {
      print('Error getting RTM token: $e');
      return null;
    }
  }

  /// Get RTM Token with custom UID (optional)
  Future<RtmTokenResponse?> getRtmTokenCustom({
    String? uid,
    int? expireTime,
  }) async {
    try {
      final queryParams = <String, String>{};
      if (uid != null) queryParams['uid'] = uid;
      if (expireTime != null) queryParams['expireTime'] = expireTime.toString();

      final uri = Uri.parse(
        '$baseUrl/api/token/rtm',
      ).replace(queryParameters: queryParams.isEmpty ? null : queryParams);

      final response = await http.get(uri);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return RtmTokenResponse.fromJson(data);
        }
      }
      return null;
    } catch (e) {
      print('Error getting RTM token: $e');
      return null;
    }
  }
}

/// RTC Token Response Model
class RtcTokenResponse {
  final bool success;
  final String token;
  final String appId;
  final String channelName;
  final int uid;
  final String role;
  final int expireTime;
  final String expireAt;

  RtcTokenResponse({
    required this.success,
    required this.token,
    required this.appId,
    required this.channelName,
    required this.uid,
    required this.role,
    required this.expireTime,
    required this.expireAt,
  });

  factory RtcTokenResponse.fromJson(Map<String, dynamic> json) {
    return RtcTokenResponse(
      success: json['success'] ?? false,
      token: json['token'] ?? '',
      appId: json['appId'] ?? '',
      channelName: json['channelName'] ?? '',
      uid: json['uid'] ?? 0,
      role: json['role'] ?? '',
      expireTime: json['expireTime'] ?? 0,
      expireAt: json['expireAt'] ?? '',
    );
  }
}

/// RTM Token Response Model
class RtmTokenResponse {
  final bool success;
  final String token;
  final String appId;
  final String uid;
  final int expireTime;
  final String expireAt;

  RtmTokenResponse({
    required this.success,
    required this.token,
    required this.appId,
    required this.uid,
    required this.expireTime,
    required this.expireAt,
  });

  factory RtmTokenResponse.fromJson(Map<String, dynamic> json) {
    return RtmTokenResponse(
      success: json['success'] ?? false,
      token: json['token'] ?? '',
      appId: json['appId'] ?? '',
      uid: json['uid'] ?? '',
      expireTime: json['expireTime'] ?? 0,
      expireAt: json['expireAt'] ?? '',
    );
  }
}

/// Usage Example
void main() async {
  // Initialize service with your server URL
  final tokenService = AgoraTokenService(baseUrl: 'http://your-server-ip:3000');

  // Example 1: Get RTC Token with defaults (simplest way)
  print('Getting RTC token with defaults...');
  final rtcToken = await tokenService.getRtcToken();
  if (rtcToken != null) {
    print('RTC Token: ${rtcToken.token}');
    print('App ID: ${rtcToken.appId}');
    print('Channel: ${rtcToken.channelName}');
    print('UID: ${rtcToken.uid}');
  }

  // Example 2: Get RTC Token with custom channel
  print('\nGetting RTC token with custom channel...');
  final customRtcToken = await tokenService.getRtcTokenCustom(
    channelName: 'my-custom-channel',
  );
  if (customRtcToken != null) {
    print('RTC Token: ${customRtcToken.token}');
    print('Channel: ${customRtcToken.channelName}');
  }

  // Example 3: Get RTM Token with defaults
  print('\nGetting RTM token with defaults...');
  final rtmToken = await tokenService.getRtmToken();
  if (rtmToken != null) {
    print('RTM Token: ${rtmToken.token}');
    print('UID: ${rtmToken.uid}');
  }

  // Example 4: Get RTM Token with custom UID
  print('\nGetting RTM token with custom UID...');
  final customRtmToken = await tokenService.getRtmTokenCustom(
    uid: 'user-12345',
  );
  if (customRtmToken != null) {
    print('RTM Token: ${customRtmToken.token}');
    print('UID: ${customRtmToken.uid}');
  }
}

/// Integration with Agora SDK
/// 
/// After getting the token, use it with Agora SDK:
/// 
/// ```dart
/// import 'package:agora_rtc_engine/agora_rtc_engine.dart';
/// 
/// // Get token from backend
/// final tokenService = AgoraTokenService(baseUrl: 'http://your-server:3000');
/// final tokenResponse = await tokenService.getRtcToken();
/// 
/// if (tokenResponse != null) {
///   // Initialize Agora Engine
///   final engine = createAgoraRtcEngine();
///   await engine.initialize(RtcEngineContext(
///     appId: tokenResponse.appId,
///   ));
///   
///   // Join channel with token
///   await engine.joinChannel(
///     token: tokenResponse.token,
///     channelId: tokenResponse.channelName,
///     uid: tokenResponse.uid,
///     options: const ChannelMediaOptions(),
///   );
/// }
/// ```

// import 'dart:convert';
// import 'package:http/http.dart' as http;

// /// Enhanced service class with role-specific methods
// class AgoraTokenService {
//   static const String baseUrl = 'http://localhost:3000/api';

//   /// Generate token for PUBLISHER (host/broadcaster)
//   /// The publisher can send audio/video to the channel
//   static Future<AgoraTokenResponse> getPublisherToken({
//     required String channelName,
//     required int publisherUid,
//     int expireTime = 3600,
//   }) async {
//     try {
//       final response = await http.post(
//         Uri.parse('$baseUrl/token/rtc'),
//         headers: {'Content-Type': 'application/json'},
//         body: jsonEncode({
//           'channelName': channelName,
//           'uid': publisherUid,
//           'role': 'publisher', // Publisher role
//           'expireTime': expireTime,
//         }),
//       );

//       final Map<String, dynamic> data = jsonDecode(response.body);

//       if (response.statusCode == 200 && data['success'] == true) {
//         print('✅ Publisher token generated for UID: $publisherUid');
//         return AgoraTokenResponse.fromJson(data);
//       } else {
//         throw AgoraTokenException(
//           data['error'] ?? 'Failed to get publisher token',
//           response.statusCode,
//         );
//       }
//     } catch (e) {
//       if (e is AgoraTokenException) rethrow;
//       throw AgoraTokenException('Network error: $e', 0);
//     }
//   }

//   /// Generate token for AUDIENCE MEMBER (subscriber/viewer)
//   /// Each audience member needs their own unique token
//   static Future<AgoraTokenResponse> getAudienceToken({
//     required String channelName,
//     required int audienceUid,
//     int expireTime = 3600,
//   }) async {
//     try {
//       final response = await http.post(
//         Uri.parse('$baseUrl/token/rtc'),
//         headers: {'Content-Type': 'application/json'},
//         body: jsonEncode({
//           'channelName': channelName,
//           'uid': audienceUid,
//           'role': 'subscriber', // Subscriber role
//           'expireTime': expireTime,
//         }),
//       );

//       final Map<String, dynamic> data = jsonDecode(response.body);

//       if (response.statusCode == 200 && data['success'] == true) {
//         print('✅ Audience token generated for UID: $audienceUid');
//         return AgoraTokenResponse.fromJson(data);
//       } else {
//         throw AgoraTokenException(
//           data['error'] ?? 'Failed to get audience token',
//           response.statusCode,
//         );
//       }
//     } catch (e) {
//       if (e is AgoraTokenException) rethrow;
//       throw AgoraTokenException('Network error: $e', 0);
//     }
//   }

//   /// Generic method (original implementation)
//   static Future<AgoraTokenResponse> getRtcToken({
//     required String channelName,
//     int uid = 0,
//     String role = 'publisher',
//     int expireTime = 3600,
//   }) async {
//     try {
//       final response = await http.post(
//         Uri.parse('$baseUrl/token/rtc'),
//         headers: {'Content-Type': 'application/json'},
//         body: jsonEncode({
//           'channelName': channelName,
//           'uid': uid,
//           'role': role,
//           'expireTime': expireTime,
//         }),
//       );

//       final Map<String, dynamic> data = jsonDecode(response.body);

//       if (response.statusCode == 200 && data['success'] == true) {
//         return AgoraTokenResponse.fromJson(data);
//       } else {
//         throw AgoraTokenException(
//           data['error'] ?? 'Failed to get RTC token',
//           response.statusCode,
//         );
//       }
//     } catch (e) {
//       if (e is AgoraTokenException) rethrow;
//       throw AgoraTokenException('Network error: $e', 0);
//     }
//   }
// }

// /// Response model for Agora token requests
// class AgoraTokenResponse {
//   final bool success;
//   final String token;
//   final String appId;
//   final String? channelName;
//   final dynamic uid;
//   final String? role;
//   final int expireTime;
//   final String expireAt;

//   AgoraTokenResponse({
//     required this.success,
//     required this.token,
//     required this.appId,
//     this.channelName,
//     this.uid,
//     this.role,
//     required this.expireTime,
//     required this.expireAt,
//   });

//   factory AgoraTokenResponse.fromJson(Map<String, dynamic> json) {
//     return AgoraTokenResponse(
//       success: json['success'] ?? false,
//       token: json['token'] ?? '',
//       appId: json['appId'] ?? '',
//       channelName: json['channelName'],
//       uid: json['uid'],
//       role: json['role'],
//       expireTime: json['expireTime'] ?? 0,
//       expireAt: json['expireAt'] ?? '',
//     );
//   }
// }

// /// Exception class for Agora token service errors
// class AgoraTokenException implements Exception {
//   final String message;
//   final int statusCode;

//   AgoraTokenException(this.message, this.statusCode);

//   @override
//   String toString() {
//     return 'AgoraTokenException: $message (Status: $statusCode)';
//   }
// }

// /// Complete example showing publisher and audience flow
// class LiveStreamExample {
//   static void demonstrateTokenFlow() async {
//     String channelName = 'live_stream_channel';

//     try {
//       print('🎬 Starting Live Stream Demo\n');

//       // 1. PUBLISHER (Host) joins first
//       print('1️⃣ Publisher joining...');
//       final publisherToken = await AgoraTokenService.getPublisherToken(
//         channelName: channelName,
//         publisherUid: 100001, // Unique ID for publisher
//       );

//       print('   Publisher Token: ${publisherToken.token.substring(0, 30)}...');
//       print('   Publisher can now start broadcasting!\n');

//       // 2. AUDIENCE MEMBERS join one by one
//       print('2️⃣ Audience members joining...');

//       // Audience member 1
//       final audience1Token = await AgoraTokenService.getAudienceToken(
//         channelName: channelName,
//         audienceUid: 200001, // Unique ID for audience 1
//       );
//       print(
//         '   👥 Audience 1 (UID: 200001): ${audience1Token.token.substring(0, 30)}...',
//       );

//       // Audience member 2
//       final audience2Token = await AgoraTokenService.getAudienceToken(
//         channelName: channelName,
//         audienceUid: 200002, // Unique ID for audience 2
//       );
//       print(
//         '   👥 Audience 2 (UID: 200002): ${audience2Token.token.substring(0, 30)}...',
//       );

//       // Audience member 3
//       final audience3Token = await AgoraTokenService.getAudienceToken(
//         channelName: channelName,
//         audienceUid: 200003, // Unique ID for audience 3
//       );
//       print(
//         '   👥 Audience 3 (UID: 200003): ${audience3Token.token.substring(0, 30)}...',
//       );

//       print('\n✅ All tokens generated successfully!');
//       print('🎥 Publisher is broadcasting to 3 audience members');
//       print('📱 Each user has their own unique token and UID');
//     } catch (e) {
//       print('❌ Error: $e');
//     }
//   }
// }

// /// Practical Flutter implementation for your app
// class MyLiveStreamApp {
//   /// For the PUBLISHER/HOST side of your app
//   static Future<void> startLiveStream(String channelName, int hostUid) async {
//     try {
//       // Get publisher token
//       final token = await AgoraTokenService.getPublisherToken(
//         channelName: channelName,
//         publisherUid: hostUid,
//       );

//       // Initialize Agora engine and join as publisher
//       // await agoraEngine.joinChannel(
//       //   token: token.token,
//       //   channelId: channelName,
//       //   uid: hostUid,
//       //   options: ChannelMediaOptions(
//       //     clientRoleType: ClientRoleType.clientRoleBroadcaster,
//       //   ),
//       // );

//       print('🎬 Started live stream in channel: $channelName');
//     } catch (e) {
//       print('❌ Failed to start live stream: $e');
//     }
//   }

//   /// For the AUDIENCE/VIEWER side of your app
//   static Future<void> joinLiveStream(String channelName, int viewerUid) async {
//     try {
//       // Get audience token
//       final token = await AgoraTokenService.getAudienceToken(
//         channelName: channelName,
//         audienceUid: viewerUid,
//       );

//       // Initialize Agora engine and join as audience
//       // await agoraEngine.joinChannel(
//       //   token: token.token,
//       //   channelId: channelName,
//       //   uid: viewerUid,
//       //   options: ChannelMediaOptions(
//       //     clientRoleType: ClientRoleType.clientRoleAudience,
//       //   ),
//       // );

//       print('👥 Joined live stream as viewer in channel: $channelName');
//     } catch (e) {
//       print('❌ Failed to join live stream: $e');
//     }
//   }
// }

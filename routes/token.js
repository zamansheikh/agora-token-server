const express = require('express');
const { RtcTokenBuilder, RtmTokenBuilder, RtcRole } = require('agora-access-token');

const router = express.Router();

// Validate environment variables
const validateConfig = () => {
    if (!process.env.AGORA_APP_ID || !process.env.AGORA_APP_CERTIFICATE) {
        throw new Error('AGORA_APP_ID and AGORA_APP_CERTIFICATE must be set in environment variables');
    }
};

// Generate RTC Token
router.post('/token/rtc', (req, res) => {
    try {
        validateConfig();

        const { channelName, uid, role = 'publisher', expireTime = 3600 } = req.body;

        // Validate required parameters
        if (!channelName) {
            return res.status(400).json({
                success: false,
                error: 'Channel name is required',
            });
        }

        // Convert string role to RtcRole enum
        let rtcRole;
        switch (role.toLowerCase()) {
            case 'publisher':
                rtcRole = RtcRole.PUBLISHER;
                break;
            case 'subscriber':
                rtcRole = RtcRole.SUBSCRIBER;
                break;
            default:
                return res.status(400).json({
                    success: false,
                    error: 'Role must be either "publisher" or "subscriber"',
                });
        }

        // Parse UID (can be number or 0 for dynamic assignment)
        const userId = uid ? parseInt(uid) : 0;
        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                error: 'UID must be a valid number or 0 for dynamic assignment',
            });
        }

        // Calculate expiration time
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const privilegeExpiredTs = currentTimestamp + parseInt(expireTime);

        // Generate token
        const token = RtcTokenBuilder.buildTokenWithUid(
            process.env.AGORA_APP_ID,
            process.env.AGORA_APP_CERTIFICATE,
            channelName,
            userId,
            rtcRole,
            privilegeExpiredTs
        );

        console.log(`✅ Generated RTC token for channel: ${channelName}, uid: ${userId}, role: ${role}`);

        res.json({
            success: true,
            token: token,
            appId: process.env.AGORA_APP_ID,
            channelName: channelName,
            uid: userId,
            role: role,
            expireTime: expireTime,
            expireAt: new Date(privilegeExpiredTs * 1000).toISOString(),
        });

    } catch (error) {
        console.error('Error generating RTC token:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to generate RTC token',
            message: error.message,
        });
    }
});

// Generate RTM Token
router.post('/token/rtm', (req, res) => {
    try {
        validateConfig();

        const { uid, expireTime = 3600 } = req.body;

        // Validate required parameters
        if (!uid) {
            return res.status(400).json({
                success: false,
                error: 'UID is required for RTM token',
            });
        }

        // RTM UID should be a string
        const userId = uid.toString();

        // Calculate expiration time
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const privilegeExpiredTs = currentTimestamp + parseInt(expireTime);

        // Generate token
        const token = RtmTokenBuilder.buildToken(
            process.env.AGORA_APP_ID,
            process.env.AGORA_APP_CERTIFICATE,
            userId,
            privilegeExpiredTs
        );

        console.log(`✅ Generated RTM token for uid: ${userId}`);

        res.json({
            success: true,
            token: token,
            appId: process.env.AGORA_APP_ID,
            uid: userId,
            expireTime: expireTime,
            expireAt: new Date(privilegeExpiredTs * 1000).toISOString(),
        });

    } catch (error) {
        console.error('Error generating RTM token:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to generate RTM token',
            message: error.message,
        });
    }
});

// Get token info (for debugging purposes)
router.get('/token/info', (req, res) => {
    try {
        validateConfig();

        res.json({
            success: true,
            appId: process.env.AGORA_APP_ID,
            serverTime: new Date().toISOString(),
            serverTimestamp: Math.floor(Date.now() / 1000),
            availableEndpoints: {
                rtcToken: 'POST /api/token/rtc',
                rtmToken: 'POST /api/token/rtm',
            },
            rtcTokenParams: {
                channelName: 'string (required)',
                uid: 'number (optional, default: 0 for dynamic)',
                role: 'string (optional, default: "publisher", values: "publisher" | "subscriber")',
                expireTime: 'number (optional, default: 3600 seconds)',
            },
            rtmTokenParams: {
                uid: 'string (required)',
                expireTime: 'number (optional, default: 3600 seconds)',
            },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Configuration error',
            message: error.message,
        });
    }
});

module.exports = router;

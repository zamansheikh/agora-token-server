const express = require('express');
const configManager = require('../utils/configManager');

const router = express.Router();

// Middleware to verify admin password
const verifyAdmin = (req, res, next) => {
    const password = req.body.password || req.query.password || req.headers['x-admin-password'];
    
    if (!password) {
        return res.status(401).json({
            success: false,
            error: 'Admin password required'
        });
    }

    if (!configManager.verifyAdminPassword(password)) {
        return res.status(403).json({
            success: false,
            error: 'Invalid admin password'
        });
    }

    next();
};

// Get current configuration (password protected)
router.get('/config', verifyAdmin, (req, res) => {
    try {
        const config = configManager.getConfig();
        
        // Don't send the admin password back
        const safeConfig = { ...config };
        delete safeConfig.adminPassword;

        // Do NOT count config reads in statistics

        res.json({
            success: true,
            config: safeConfig
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to get configuration',
            message: error.message
        });
    }
});

// Update configuration (password protected)
router.post('/config', verifyAdmin, (req, res) => {
    try {
        const { agoraAppId, agoraAppCertificate, defaultChannelName, defaultUid, defaultRole, defaultExpireTime, adminPassword } = req.body;

        const updates = {};
        if (agoraAppId !== undefined) updates.agoraAppId = agoraAppId;
        if (agoraAppCertificate !== undefined) updates.agoraAppCertificate = agoraAppCertificate;
        if (defaultChannelName !== undefined) updates.defaultChannelName = defaultChannelName;
        if (defaultUid !== undefined) updates.defaultUid = defaultUid;
        if (defaultRole !== undefined) updates.defaultRole = defaultRole;
        if (defaultExpireTime !== undefined) updates.defaultExpireTime = parseInt(defaultExpireTime);
        if (adminPassword !== undefined) updates.adminPassword = adminPassword;

        const success = configManager.updateConfig(updates);

        if (success) {
            // Do NOT count config updates in statistics
            
            res.json({
                success: true,
                message: 'Configuration updated successfully',
                config: {
                    agoraAppId: configManager.getConfig().agoraAppId,
                    defaultChannelName: configManager.getConfig().defaultChannelName,
                    defaultUid: configManager.getConfig().defaultUid,
                    defaultRole: configManager.getConfig().defaultRole,
                    defaultExpireTime: configManager.getConfig().defaultExpireTime
                }
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Failed to update configuration'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update configuration',
            message: error.message
        });
    }
});

// Get statistics (password protected)
router.get('/stats', verifyAdmin, (req, res) => {
    try {
        const stats = configManager.getStats();
        
        // Do NOT count admin panel reload requests in statistics
        // Only valid API requests (RTC/RTM tokens) should be counted

        res.json({
            success: true,
            stats: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to get statistics',
            message: error.message
        });
    }
});

// Reset statistics (password protected)
router.post('/stats/reset', verifyAdmin, (req, res) => {
    try {
        configManager.resetStats();
        
        res.json({
            success: true,
            message: 'Statistics reset successfully',
            stats: configManager.getStats()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to reset statistics',
            message: error.message
        });
    }
});

// Verify admin password (for login)
router.post('/verify', (req, res) => {
    const { password } = req.body;
    
    if (!password) {
        return res.status(400).json({
            success: false,
            error: 'Password required'
        });
    }

    const isValid = configManager.verifyAdminPassword(password);
    
    if (isValid) {
        res.json({
            success: true,
            message: 'Password verified'
        });
    } else {
        res.status(403).json({
            success: false,
            error: 'Invalid password'
        });
    }
});

module.exports = router;

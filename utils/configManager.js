const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '../config/config.json');
const STATS_PATH = path.join(__dirname, '../config/stats.json');

class ConfigManager {
    constructor() {
        this.config = null;
        this.stats = null;
        this.loadConfig();
        this.loadStats();
    }

    loadConfig() {
        try {
            const data = fs.readFileSync(CONFIG_PATH, 'utf8');
            this.config = JSON.parse(data);

            // Override with environment variables if present
            if (process.env.AGORA_APP_ID) {
                this.config.agoraAppId = process.env.AGORA_APP_ID;
            }
            if (process.env.AGORA_APP_CERTIFICATE) {
                this.config.agoraAppCertificate = process.env.AGORA_APP_CERTIFICATE;
            }
            if (process.env.ADMIN_PASSWORD) {
                this.config.adminPassword = process.env.ADMIN_PASSWORD;
            }
        } catch (error) {
            console.error('Error loading config:', error.message);
            this.config = {
                agoraAppId: '',
                agoraAppCertificate: '',
                adminPassword: 'admin123',
                defaultChannelName: 'test-channel',
                defaultUid: '0',
                defaultRole: 'publisher',
                defaultExpireTime: 3600
            };
        }
    }

    loadStats() {
        try {
            const data = fs.readFileSync(STATS_PATH, 'utf8');
            this.stats = JSON.parse(data);
        } catch (error) {
            console.error('Error loading stats:', error.message);
            this.stats = {
                totalRequests: 0,
                rtcRequests: 0,
                rtmRequests: 0,
                adminRequests: 0,
                lastReset: new Date().toISOString(),
                requestHistory: []
            };
            this.saveStats();
        }
    }

    saveConfig() {
        try {
            const dir = path.dirname(CONFIG_PATH);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(CONFIG_PATH, JSON.stringify(this.config, null, 2));
            return true;
        } catch (error) {
            console.error('Error saving config:', error.message);
            return false;
        }
    }

    saveStats() {
        try {
            const dir = path.dirname(STATS_PATH);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(STATS_PATH, JSON.stringify(this.stats, null, 2));
            return true;
        } catch (error) {
            console.error('Error saving stats:', error.message);
            return false;
        }
    }

    getConfig() {
        return this.config;
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        return this.saveConfig();
    }

    getAppId() {
        return this.config.agoraAppId;
    }

    getAppCertificate() {
        return this.config.agoraAppCertificate;
    }

    validateCredentials() {
        return this.config.agoraAppId && this.config.agoraAppCertificate;
    }

    getStats() {
        return this.stats;
    }

    incrementStat(type) {
        this.stats.totalRequests++;

        switch (type) {
            case 'rtc':
                this.stats.rtcRequests++;
                break;
            case 'rtm':
                this.stats.rtmRequests++;
                break;
            case 'admin':
                this.stats.adminRequests++;
                break;
        }

        // Add to history (keep last 100 requests)
        this.stats.requestHistory.unshift({
            type,
            timestamp: new Date().toISOString()
        });

        if (this.stats.requestHistory.length > 100) {
            this.stats.requestHistory = this.stats.requestHistory.slice(0, 100);
        }

        this.saveStats();
    }

    resetStats() {
        this.stats = {
            totalRequests: 0,
            rtcRequests: 0,
            rtmRequests: 0,
            adminRequests: 0,
            lastReset: new Date().toISOString(),
            requestHistory: []
        };
        this.saveStats();
    }

    verifyAdminPassword(password) {
        return this.config.adminPassword === password;
    }
}

module.exports = new ConfigManager();

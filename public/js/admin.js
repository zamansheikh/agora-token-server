// Global state
let adminPassword = '';
let statsInterval = null;

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const adminDashboard = document.getElementById('adminDashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Login
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => switchSection(item.dataset.section));
    });

    // Config
    document.getElementById('configForm').addEventListener('submit', handleConfigUpdate);
    document.getElementById('loadConfigBtn').addEventListener('click', loadConfig);

    // Statistics
    document.getElementById('refreshStatsBtn').addEventListener('click', loadStatistics);
    document.getElementById('resetStatsBtn').addEventListener('click', handleResetStats);

    // Test
    document.getElementById('testRtcForm').addEventListener('submit', handleTestRtc);
    document.getElementById('testRtmForm').addEventListener('submit', handleTestRtm);
}

// Login Handler
async function handleLogin(e) {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/admin/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });

        const data = await response.json();

        if (data.success) {
            adminPassword = password;
            showDashboard();
            loadDashboardData();
        } else {
            showError(loginError, data.error || 'Invalid password');
        }
    } catch (error) {
        showError(loginError, 'Failed to connect to server');
    }
}

// Logout Handler
function handleLogout() {
    adminPassword = '';
    clearInterval(statsInterval);
    loginScreen.style.display = 'flex';
    adminDashboard.style.display = 'none';
    document.getElementById('password').value = '';
}

// Show Dashboard
function showDashboard() {
    loginScreen.style.display = 'none';
    adminDashboard.style.display = 'block';
    
    // Auto-refresh stats every 30 seconds
    statsInterval = setInterval(loadStatistics, 30000);
}

// Switch Section
function switchSection(section) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-item').classList.add('active');

    // Update content
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(section + 'Section').classList.add('active');

    // Load section data
    if (section === 'config') {
        loadConfig();
    } else if (section === 'statistics') {
        loadStatistics();
    }
}

// Load Dashboard Data
async function loadDashboardData() {
    await loadStatistics();
    await loadConfig();
}

// Load Statistics
async function loadStatistics() {
    try {
        const response = await fetch('/api/admin/stats', {
            headers: {
                'x-admin-password': adminPassword
            }
        });

        const data = await response.json();

        if (data.success) {
            updateStatsDisplay(data.stats);
        }
    } catch (error) {
        console.error('Failed to load statistics:', error);
    }
}

// Update Stats Display
function updateStatsDisplay(stats) {
    // Overview stats
    document.getElementById('totalRequests').textContent = stats.totalRequests || 0;
    document.getElementById('rtcRequests').textContent = stats.rtcRequests || 0;
    document.getElementById('rtmRequests').textContent = stats.rtmRequests || 0;
    document.getElementById('adminRequests').textContent = stats.adminRequests || 0;
    
    const lastReset = stats.lastReset ? new Date(stats.lastReset).toLocaleString() : 'Never';
    document.getElementById('lastReset').textContent = lastReset;

    // Request history
    const historyContainer = document.getElementById('requestHistory');
    if (stats.requestHistory && stats.requestHistory.length > 0) {
        historyContainer.innerHTML = stats.requestHistory.slice(0, 20).map(req => `
            <div class="history-item">
                <span class="type ${req.type}">${req.type.toUpperCase()}</span>
                <span class="timestamp">${new Date(req.timestamp).toLocaleString()}</span>
            </div>
        `).join('');
    } else {
        historyContainer.innerHTML = '<p class="no-data">No requests recorded yet</p>';
    }
}

// Load Config
async function loadConfig() {
    try {
        const response = await fetch('/api/admin/config', {
            headers: {
                'x-admin-password': adminPassword
            }
        });

        const data = await response.json();

        if (data.success) {
            const config = data.config;
            
            // Update form
            document.getElementById('agoraAppId').value = config.agoraAppId || '';
            document.getElementById('agoraAppCertificate').value = config.agoraAppCertificate || '';
            document.getElementById('defaultChannelName').value = config.defaultChannelName || '';
            document.getElementById('defaultUid').value = config.defaultUid || '';
            document.getElementById('defaultRole').value = config.defaultRole || 'publisher';
            document.getElementById('defaultExpireTime').value = config.defaultExpireTime || 3600;
            
            // Update overview
            const appIdDisplay = config.agoraAppId ? 
                config.agoraAppId.substring(0, 8) + '...' : 
                'Not configured';
            document.getElementById('overviewAppId').textContent = appIdDisplay;
        }
    } catch (error) {
        console.error('Failed to load config:', error);
    }
}

// Handle Config Update
async function handleConfigUpdate(e) {
    e.preventDefault();
    
    const configData = {
        agoraAppId: document.getElementById('agoraAppId').value,
        agoraAppCertificate: document.getElementById('agoraAppCertificate').value,
        defaultChannelName: document.getElementById('defaultChannelName').value,
        defaultUid: document.getElementById('defaultUid').value,
        defaultRole: document.getElementById('defaultRole').value,
        defaultExpireTime: parseInt(document.getElementById('defaultExpireTime').value),
        password: adminPassword
    };

    const newPassword = document.getElementById('newAdminPassword').value;
    if (newPassword) {
        configData.adminPassword = newPassword;
    }

    try {
        const response = await fetch('/api/admin/config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-password': adminPassword
            },
            body: JSON.stringify(configData)
        });

        const data = await response.json();
        const messageBox = document.getElementById('configMessage');

        if (data.success) {
            showMessage(messageBox, 'Configuration updated successfully!', 'success');
            
            // Update password if changed
            if (newPassword) {
                adminPassword = newPassword;
                document.getElementById('newAdminPassword').value = '';
            }
            
            // Reload overview data
            loadConfig();
        } else {
            showMessage(messageBox, data.error || 'Failed to update configuration', 'error');
        }
    } catch (error) {
        showMessage(document.getElementById('configMessage'), 'Failed to connect to server', 'error');
    }
}

// Handle Reset Stats
async function handleResetStats() {
    if (!confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch('/api/admin/stats/reset', {
            method: 'POST',
            headers: {
                'x-admin-password': adminPassword
            }
        });

        const data = await response.json();

        if (data.success) {
            alert('Statistics reset successfully!');
            loadStatistics();
        } else {
            alert(data.error || 'Failed to reset statistics');
        }
    } catch (error) {
        alert('Failed to connect to server');
    }
}

// Handle Test RTC
async function handleTestRtc(e) {
    e.preventDefault();
    
    const channelName = document.getElementById('testRtcChannel').value;
    const url = channelName ? 
        `/api/token/rtc?channelName=${encodeURIComponent(channelName)}` : 
        '/api/token/rtc';

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        const resultDiv = document.getElementById('rtcTestResult');
        if (data.success) {
            resultDiv.innerHTML = `
                <h4 style="color: #28a745; margin-bottom: 10px;">✓ Success</h4>
                <pre>${JSON.stringify(data, null, 2)}</pre>
                <button class="copy-btn" onclick="copyToClipboard('${data.token}')">
                    <i class="fas fa-copy"></i> Copy Token
                </button>
            `;
        } else {
            resultDiv.innerHTML = `
                <h4 style="color: #dc3545; margin-bottom: 10px;">✗ Error</h4>
                <pre>${JSON.stringify(data, null, 2)}</pre>
            `;
        }
        resultDiv.classList.add('show');
    } catch (error) {
        document.getElementById('rtcTestResult').innerHTML = `
            <h4 style="color: #dc3545;">✗ Error</h4>
            <p>Failed to connect to server</p>
        `;
    }
}

// Handle Test RTM
async function handleTestRtm(e) {
    e.preventDefault();
    
    const uid = document.getElementById('testRtmUid').value;
    const url = uid ? 
        `/api/token/rtm?uid=${encodeURIComponent(uid)}` : 
        '/api/token/rtm';

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        const resultDiv = document.getElementById('rtmTestResult');
        if (data.success) {
            resultDiv.innerHTML = `
                <h4 style="color: #28a745; margin-bottom: 10px;">✓ Success</h4>
                <pre>${JSON.stringify(data, null, 2)}</pre>
                <button class="copy-btn" onclick="copyToClipboard('${data.token}')">
                    <i class="fas fa-copy"></i> Copy Token
                </button>
            `;
        } else {
            resultDiv.innerHTML = `
                <h4 style="color: #dc3545; margin-bottom: 10px;">✗ Error</h4>
                <pre>${JSON.stringify(data, null, 2)}</pre>
            `;
        }
        resultDiv.classList.add('show');
    } catch (error) {
        document.getElementById('rtmTestResult').innerHTML = `
            <h4 style="color: #dc3545;">✗ Error</h4>
            <p>Failed to connect to server</p>
        `;
    }
}

// Utility Functions
function showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
    setTimeout(() => {
        element.classList.remove('show');
    }, 5000);
}

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = 'message-box show ' + type;
    setTimeout(() => {
        element.classList.remove('show');
    }, 5000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Token copied to clipboard!');
    }).catch(() => {
        alert('Failed to copy token');
    });
}

// Global state
let adminPassword = '';
let statsInterval = null;
let mobileMenuOpen = false;

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const adminDashboard = document.getElementById('adminDashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const liveIndicator = document.getElementById('liveIndicator');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebarDrawer = document.querySelector('.sidebar-drawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const closeDrawerBtn = document.getElementById('closeDrawerBtn');
const dashboardNav = document.querySelector('.dashboard-nav');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    checkPersistence();
});

// Check for saved session
function checkPersistence() {
    const savedPassword = localStorage.getItem('agora_admin_password');
    if (savedPassword) {
        performSilentLogin(savedPassword);
    }
}

async function performSilentLogin(password) {
    try {
        const response = await fetch('/api/admin/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        const data = await response.json();

        if (data.success) {
            adminPassword = password;
            showDashboard();
            loadDashboardData();
        } else {
            // Saved password no longer valid
            localStorage.removeItem('agora_admin_password');
        }
    } catch (error) {
        console.error('Silent login failed:', error);
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Login
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);

    // Mobile Menu and Drawer
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    if (closeDrawerBtn) {
        closeDrawerBtn.addEventListener('click', closeMobileMenu);
    }

    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', closeMobileMenu);
    }

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            switchSection(item.dataset.section);
            closeMobileMenu();
        });
    });

    // Config
    document.getElementById('configForm').addEventListener('submit', handleConfigUpdate);
    document.getElementById('loadConfigBtn').addEventListener('click', loadConfig);
    document.getElementById('copyAppIdBtn').addEventListener('click', () => copyToClipboard('agoraAppId'));
    document.getElementById('copyAppCertBtn').addEventListener('click', () => copyToClipboard('agoraAppCertificate'));

    // Statistics
    document.getElementById('refreshStatsBtn').addEventListener('click', () => {
        loadStatistics();
        flashIndicator();
    });
    document.getElementById('resetStatsBtn').addEventListener('click', handleResetStats);

    // Test
    document.getElementById('testRtcForm').addEventListener('submit', handleTestRtc);
    document.getElementById('testRtmForm').addEventListener('submit', handleTestRtm);
}

// Visual Effects
function flashIndicator() {
    if (liveIndicator) {
        liveIndicator.style.opacity = '0.5';
        setTimeout(() => liveIndicator.style.opacity = '1', 200);
    }
}

// Mobile Menu Functions
function toggleMobileMenu() {
    if (mobileMenuOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

function openMobileMenu() {
    if (sidebarDrawer) {
        sidebarDrawer.classList.add('mobile-open');
    }
    if (drawerOverlay) {
        drawerOverlay.classList.add('active');
    }
    if (mobileMenuBtn) {
        mobileMenuBtn.classList.add('active');
    }
    mobileMenuOpen = true;
}

function closeMobileMenu() {
    if (sidebarDrawer) {
        sidebarDrawer.classList.remove('mobile-open');
    }
    if (drawerOverlay) {
        drawerOverlay.classList.remove('active');
    }
    if (mobileMenuBtn) {
        mobileMenuBtn.classList.remove('active');
    }
    mobileMenuOpen = false;
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (mobileMenuOpen && !e.target.closest('.sidebar-drawer') && !e.target.closest('.mobile-menu-btn')) {
        closeMobileMenu();
    }
});

// Login Handler
async function handleLogin(e) {
    e.preventDefault();

    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/admin/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        const data = await response.json();

        if (data.success) {
            adminPassword = password;
            localStorage.setItem('agora_admin_password', password);
            showDashboard();
            loadDashboardData();
        } else {
            loginError.textContent = data.error || 'Invalid password';
            loginError.style.display = 'block';
        }
    } catch (error) {
        loginError.textContent = 'Failed to connect to server';
        loginError.style.display = 'block';
    }
}

// Logout Handler
function handleLogout() {
    adminPassword = '';
    localStorage.removeItem('agora_admin_password');
    clearInterval(statsInterval);
    loginScreen.style.display = 'flex';
    adminDashboard.style.display = 'none';
    document.getElementById('password').value = '';
    loginError.style.display = 'none';
}

// Show Dashboard
function showDashboard() {
    loginScreen.style.display = 'none';
    adminDashboard.style.display = 'grid'; // Maintain grid layout

    // Auto-refresh stats every 5 seconds for "Live" feel
    statsInterval = setInterval(loadStatistics, 5000);
}

// Switch Section
function switchSection(section) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.section === section);
    });

    // Update content
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(section + 'Section').classList.add('active');

    // Load section data
    if (section === 'config') loadConfig();
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
            headers: { 'x-admin-password': adminPassword }
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
    const animateValue = (id, valid) => {
        const el = document.getElementById(id);
        if (el.textContent != valid) {
            el.textContent = valid;
            el.parentElement.style.transform = "scale(1.05)";
            setTimeout(() => el.parentElement.style.transform = "scale(1)", 200);
        }
    };

    animateValue('totalRequests', stats.totalRequests || 0);
    animateValue('rtcRequests', stats.rtcRequests || 0);
    animateValue('rtmRequests', stats.rtmRequests || 0);
    animateValue('adminRequests', stats.adminRequests || 0);

    const lastReset = stats.lastReset ? new Date(stats.lastReset).toLocaleString() : 'Never';
    document.getElementById('lastReset').textContent = lastReset;

    // Request history
    const historyContainer = document.getElementById('requestHistory');
    if (stats.requestHistory && stats.requestHistory.length > 0) {
        historyContainer.innerHTML = stats.requestHistory.slice(0, 50).map(req => `
            <div class="history-item">
                <span class="type ${req.type}">${req.type.toUpperCase()}</span>
                <span class="timestamp">${new Date(req.timestamp).toLocaleTimeString()}</span>
            </div>
        `).join('');
    } else {
        historyContainer.innerHTML = '<p class="no-data" style="text-align:center; padding:1rem; color:var(--text-secondary);">No requests recorded yet</p>';
    }
}

// Load Config
async function loadConfig() {
    try {
        const response = await fetch('/api/admin/config', {
            headers: { 'x-admin-password': adminPassword }
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
                'Not Configured';
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

    const messageBox = document.getElementById('configMessage');
    messageBox.textContent = 'Saving...';
    messageBox.className = '';

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

        if (data.success) {
            showMessage(messageBox, 'Configuration saved successfully!', 'success');

            if (newPassword) {
                adminPassword = newPassword;
                localStorage.setItem('agora_admin_password', newPassword);
                document.getElementById('newAdminPassword').value = '';
            }
            loadConfig();
        } else {
            showMessage(messageBox, data.error || 'Failed to update configuration', 'error');
        }
    } catch (error) {
        showMessage(messageBox, 'Failed to connect to server', 'error');
    }
}

// Handle Reset Stats
async function handleResetStats() {
    if (!confirm('Are you sure you want to reset all statistics?')) return;

    try {
        const response = await fetch('/api/admin/stats/reset', {
            method: 'POST',
            headers: { 'x-admin-password': adminPassword }
        });

        loadStatistics();
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

    runTokenTest(url, 'rtcTestResult');
}

// Handle Test RTM
async function handleTestRtm(e) {
    e.preventDefault();
    const uid = document.getElementById('testRtmUid').value;
    const url = uid ?
        `/api/token/rtm?uid=${encodeURIComponent(uid)}` :
        '/api/token/rtm';

    runTokenTest(url, 'rtmTestResult');
}

async function runTokenTest(url, resultElementId) {
    const resultDiv = document.getElementById(resultElementId);
    resultDiv.innerHTML = '<span style="color:var(--text-secondary)">Generating...</span>';

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            resultDiv.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                    <span style="color:var(--success-color); font-weight:bold;">✓ Token Generated</span>
                    <button class="copy-btn" onclick="copyToClipboard('${data.token}')">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <div style="font-size:0.75rem; color:var(--text-secondary); word-break:break-all;">
                    ${data.token.substring(0, 50)}...
                </div>
            `;
            // Don't reload stats here - it was causing dummy admin requests to be tracked
        } else {
            resultDiv.innerHTML = `<span style="color:var(--danger-color)">Error: ${data.error || 'Unknown error'}</span>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<span style="color:var(--danger-color)">Connection Error</span>`;
    }
}

// Utilities
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = 'message-box show ' + type;
    setTimeout(() => {
        element.className = '';
        element.textContent = '';
    }, 3000);
}

function copyToClipboard(elementIdOrText) {
    let text;
    if (typeof elementIdOrText === 'string' && document.getElementById(elementIdOrText)) {
        // It's an element ID
        const element = document.getElementById(elementIdOrText);
        text = element.value || element.textContent;
        
        // Visual feedback for config copy buttons
        if (elementIdOrText === 'agoraAppId' || elementIdOrText === 'agoraAppCertificate') {
            const button = elementIdOrText === 'agoraAppId' ? document.getElementById('copyAppIdBtn') : document.getElementById('copyAppCertBtn');
            const originalIcon = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.classList.add('copied');
            
            setTimeout(() => {
                button.innerHTML = originalIcon;
                button.classList.remove('copied');
            }, 2000);
        }
    } else {
        // It's direct text
        text = elementIdOrText;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        // Additional feedback could be added here
    }).catch(err => {
        console.error('Failed to copy: ', err);
        // Fallback for older browsers
        if (document.getElementById(elementIdOrText)) {
            const element = document.getElementById(elementIdOrText);
            element.select();
            document.execCommand('copy');
        }
    });
}


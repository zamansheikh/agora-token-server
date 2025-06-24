const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const tokenRoutes = require('./routes/token');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.',
    },
});

app.use(limiter);

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const allowedOrigins = process.env.ALLOWED_ORIGINS
            ? process.env.ALLOWED_ORIGINS.split(',')
            : ['http://localhost:3000', 'http://127.0.0.1:3000'];

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api', tokenRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Agora Token Server is running!',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            rtcToken: 'POST /api/token/rtc',
            rtmToken: 'POST /api/token/rtm',
        },
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);

    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            error: 'CORS policy violation',
            message: 'Origin not allowed',
        });
    }

    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested endpoint does not exist',
    });
});

// Function to get server's actual IP address
const getServerIP = () => {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    const results = {};

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }

    // Return the first external IPv4 address found
    const interfaces = Object.values(results);
    return interfaces.length > 0 ? interfaces[0][0] : 'localhost';
};

// Start server
app.listen(PORT, () => {
    const serverIP = getServerIP();

    console.log(`🚀 Agora Token Server is running on port ${PORT}`);
    console.log(`📱 Ready to serve Flutter app tokens!`);
    console.log(`🌐 Server URLs:`);
    console.log(`   Local:    http://localhost:${PORT}`);
    console.log(`   Network:  http://${serverIP}:${PORT}`);
    console.log(`   Health:   http://${serverIP}:${PORT}/api/health`);
    console.log(`   API Base: http://${serverIP}:${PORT}/api`);

    // Validate environment variables
    if (!process.env.AGORA_APP_ID || !process.env.AGORA_APP_CERTIFICATE) {
        console.warn('⚠️  Warning: AGORA_APP_ID and AGORA_APP_CERTIFICATE must be set in .env file');
    }
});

module.exports = app;

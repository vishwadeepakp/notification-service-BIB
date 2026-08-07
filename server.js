const express = require('express');
const app = express();
require("dotenv").config();


// Render और UptimeRobot के लिए हैल्थ-चेक API
app.get('/', (req, res) => {
    res.send('Notification Service is active and running!');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Service is healthy' });
});

// Port नंबर Render खुद सेट करेगा (process.env.PORT)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Dummy HTTP server started on port ${PORT}`);

    // ----------------------------------------------------
    // यहाँ अपनी Kafka/Notification की मुख्य फ़ाइल (जैसे index.js) कॉल कर लो
    // ----------------------------------------------------
    try {
        const { startService } = require('./index.js'); // या आपकी जो भी फ़ाइल है
        startService();
        console.log('🚀 Kafka Consumer service initialized successfully!');
    } catch (error) {
        console.error('❌ Error starting Kafka service:', error);
    }
});
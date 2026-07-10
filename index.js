const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox', 
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ]
    }
});

// लॉग्स में QR कोड दिखाने के लिए
client.on('qr', (qr) => {
    console.log('=== नीचे दिए गए QR कोड को अपने व्हाट्सएप से स्कैन करें ===');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('बधाई हो! आपका व्हाट्सएप बोट पूरी तरह चालू हो गया है!');
});

// मैसेज भेजने के लिए API Endpoint
app.post('/send-message', async (req, res) => {
    const { phone, message } = req.body;
    try {
        const formattedPhone = phone.includes('@c.us') ? phone : `${phone}@c.us`;
        await client.sendMessage(formattedPhone, message);
        res.status(200).json({ status: 'success', message: 'मैसेज भेज दिया गया है!' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.get('/', (req, res) => { res.send('WhatsApp Bot Server is Running Fine!'); });

app.listen(port, '0.0.0.0', () => {
    console.log(`सर्वर पोर्ट ${port} पर चल रहा है`);
    client.initialize();
});

const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
const port = 3000;

// Middleware لتحليل JSON
app.use(express.json());

// تقديم ملفات HTML/CSS
app.use(express.static(path.join(__dirname, 'public')));

// الوظيفة التي تُنشئ الروبوتات
async function createBot(url, botNumber) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });

    console.log(`Bot ${botNumber} visiting ${url}`);
    await page.goto(url);

    // البقاء لمدة 40 ثانية
    await page.waitForTimeout(40000);

    console.log(`Bot ${botNumber} finished visit`);
    await browser.close();
}

// تشغيل الروبوتات عند تلقي الرابط
app.post('/start-bots', async (req, res) => {
    const { url } = req.body;
    const botCount = 1000; // عدد الروبوتات
    let botArray = [];

    if (!url) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    for (let i = 1; i <= botCount; i++) {
        botArray.push(createBot(url, i));
        await new Promise(resolve => setTimeout(resolve, 100)); // تأخير بسيط لتوزيع الزيارات
    }

    await Promise.all(botArray);
    res.json({ message: 'Bots started successfully' });
});

// تشغيل الخادم
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

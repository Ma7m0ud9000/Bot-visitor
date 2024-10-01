const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// إعداد الخادم لتقديم الملفات الثابتة
app.use(express.static(path.join(__dirname, 'public')));

// إعداد تحليل البيانات الواردة من الطلبات
app.use(express.urlencoded({ extended: true }));

// نقطة دخول الصفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// نقطة دخول API للبوتات (يمكن تخصيصها لاحقًا)
app.post('/start-bots', (req, res) => {
    const siteUrl = req.body.siteUrl;
    
    // هنا يمكن إضافة منطق بدء الروبوتات بناءً على الموقع المدخل
    if (siteUrl) {
        // إرجاع رسالة نجاح مع رابط الموقع
        res.json({ message: `تم بدء الروبوتات لزيارة ${siteUrl}` });
    } else {
        res.status(400).json({ error: 'يرجى إدخال رابط صالح' });
    }
});

// بدء الخادم
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

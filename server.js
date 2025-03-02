const express = require('express');
const app = express();
const port = 3000;

// Разрешаем отдавать статические файлы (HTML, CSS, JS)
app.use(express.static('public'));

// API для получения данных
app.get('/api/news', (req, res) => {
    res.json([
        { id: 1, title: "Новость 1", content: "Описание первой новости." },
        { id: 2, title: "Новость 2", content: "Описание второй новости." }
    ]);
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});

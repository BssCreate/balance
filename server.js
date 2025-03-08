const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Статическая обработка HTML файлов
app.use(express.static('public'));

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});

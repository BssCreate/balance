const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Создание или открытие базы данных SQLite
const db = new sqlite3.Database('./database.db');

// Настройка парсера для JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Создание таблицы пользователей (если она не существует)
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        nickname TEXT,
        password TEXT
    )
`);

// Маршрут для регистрации пользователя
app.post('/register', (req, res) => {
    const { email, nickname, password } = req.body;

    db.run('INSERT INTO users (email, nickname, password) VALUES (?, ?, ?)', [email, nickname, password], function(err) {
        if (err) {
            return res.json({ success: false, message: 'Ошибка при регистрации' });
        }
        res.json({ success: true, message: 'Пользователь зарегистрирован' });
    });
});

// Маршрут для входа пользователя
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
        if (err || !row) {
            return res.json({ success: false, message: 'Неверный email или пароль' });
        }
        res.json({ success: true, message: 'Вход успешен', user: row });
    });
});

// Статическая обработка HTML файлов
app.use(express.static('public'));

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});

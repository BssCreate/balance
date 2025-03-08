const apiUrl = "https://script.google.com/macros/s/AKfycbygLpe2adm1TqoLSIYRp0wjNu7F6dn53DCZ-nMlCRW-hKbR0UziRLNaf-lfQ_tun1ed/exec"; // Вставь ссылку API

let timer;
let timeRemaining = 59;
let email = '';
let verificationCode = ''; // Храним код для верификации
let interval; // Таймер повторной отправки кода

// Показать профиль
function showProfile() {
    showLoading(true); // Показываем анимацию загрузки
    setTimeout(() => {
        checkUserProfile(email)
            .then(profileData => {
                if (profileData) {
                    // Если профиль есть, показываем данные
                    document.getElementById('nickname').innerText = profileData.nickname;
                    document.getElementById('email').innerText = profileData.email;
                    document.getElementById('profile-content').style.display = 'block';
                    showLoading(false);
                } else {
                    // Если профиля нет, показываем форму входа/регистрации
                    document.getElementById('auth-form').style.display = 'block';
                    document.getElementById('email-step').style.display = 'block';
                    showLoading(false);
                }
            })
            .catch(() => {
                showLoading(false);
                alert('Ошибка при загрузке профиля');
            });
    }, 1000);
}

// Функция для показа/скрытия анимации загрузки
function showLoading(isLoading) {
    document.getElementById('loading').style.display = isLoading ? 'block' : 'none';
}

// Переход между содержимым через навигацию
function showContent(contentId) {
    document.querySelectorAll('.content').forEach(content => {
        content.classList.remove('active');
    });

    document.getElementById(contentId).classList.add('active');
    document.querySelectorAll('.bottom-nav button').forEach(button => {
        button.classList.remove('active');
    });

    document.getElementById(`btn-${contentId}`).classList.add('active');
}

// Отправить код на почту
document.getElementById('sendCodeBtn').addEventListener('click', () => {
    email = document.getElementById('email').value;

    if (!validateEmail(email)) {
        alert('Введите правильный email');
        return;
    }

    sendVerificationCode();
});

// Валидация email
function validateEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
}

// Отправить код на почту
function sendVerificationCode() {
    // Симуляция отправки кода на email через API
    verificationCode = generateVerificationCode(); // Генерация случайного кода
    document.getElementById('user-email').innerText = email;

    // Скрываем шаг ввода почты и показываем шаг ввода кода
    document.getElementById('email-step').style.display = 'none';
    document.getElementById('code-step').style.display = 'block';
    
    // Запускаем таймер
    startResendTimer();
}

// Генерация случайного 6-значного кода
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Таймер повторной отправки кода
function startResendTimer() {
    timer = document.getElementById('resend-timer');
    timer.innerText = `Отправить повторно через ${timeRemaining}s`;
    
    interval = setInterval(() => {
        timeRemaining -= 1;
        timer.innerText = `Отправить повторно через ${timeRemaining}s`;

        if (timeRemaining <= 0) {
            clearInterval(interval);
            timer.innerText = 'Отправить повторно';
            timer.style.color = 'blue';
        }
    }, 1000);
}

// Ввод кода
function moveNext(index) {
    const inputs = document.querySelectorAll('.otp-input');
    if (index < inputs.length && inputs[index].value.length === 1) {
        inputs[index + 1]?.focus();
    }
}

// Проверка кода
document.getElementById('verifyCodeBtn').addEventListener('click', () => {
    const code = Array.from(document.querySelectorAll('.otp-input')).map(input => input.value).join('');
    
    if (code === verificationCode) {
        // Если код правильный
        showPasswordStep();
    } else {
        alert('Неверный код!');
        resetCodeInputs();
    }
});

// Сбросить поля кода
function resetCodeInputs() {
    const inputs = document.querySelectorAll('.otp-input');
    inputs.forEach(input => input.value = '');
    inputs[0]?.focus();
}

// Показать шаг с вводом пароля
function showPasswordStep() {
    document.getElementById('code-step').style.display = 'none';
    document.getElementById('password-step').style.display = 'block';
}

// Вход в систему
function login() {
    const password = document.getElementById('password').value;
    
    // Проверка пароля (если данные совпадают с тем, что в базе, то вход успешен)
    // В реальном приложении здесь будет запрос к серверу для проверки данных

    checkUserPassword(email, password)
        .then(profileData => {
            if (profileData) {
                // Сохраняем данные профиля в сессионной переменной или другом месте
                alert('Успешный вход');
                showProfile();
            } else {
                alert('Неверный пароль');
            }
        })
        .catch(() => alert('Ошибка при проверке пароля'));
}

// Регистрация нового пользователя
function register() {
    const nickname = document.getElementById('nickname').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Пароли не совпадают!');
        return;
    }

    // Регистрация пользователя в Google Таблицах
    registerUser(email, nickname, password)
        .then(() => {
            alert('Регистрация успешна!');
            showProfile();
        })
        .catch(() => alert('Ошибка при регистрации'));
}

// Функция для проверки существующего пользователя в Google Таблицах
async function checkUserProfile(email) {
    const response = await fetch(`${apiUrl}?action=checkUser&email=${email}`);
    const data = await response.json();
    return data.profile || null; // Возвращаем профиль, если найден
}

// Функция для проверки пароля пользователя
async function checkUserPassword(email, password) {
    const response = await fetch(`${apiUrl}?action=checkPassword&email=${email}&password=${password}`);
    const data = await response.json();
    return data.profile || null; // Возвращаем профиль, если пароль совпадает
}

// Функция для регистрации пользователя в Google Таблицах
async function registerUser(email, nickname, password) {
    const response = await fetch(`${apiUrl}?action=registerUser&email=${email}&nickname=${nickname}&password=${password}`);
    const data = await response.json();
    return data.success; // Возвращаем успех или неудачу регистрации
}

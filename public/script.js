const apiUrl = "https://script.google.com/macros/s/AKfycbxdivQqwTaFb3UTLTaIG95EdVyc1MHNFia99TAvMYHIMGNv51wt6Unltx26wdgebxPO/exec"; // Вставь ссылку API

let timer;
let timeRemaining = 59;
let email = '';
let verificationCode = ''; // Храним код для верификации
let interval; // Таймер повторной отправки кода

// Показать профиль
function showProfile() {
    showLoading(true); // Показываем анимацию загрузки
    setTimeout(() => {
        const profileData = JSON.parse(localStorage.getItem('profileData'));

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

    // Сохраняем данные профиля в localStorage
    const profileData = { nickname: 'User', email: email };
    localStorage.setItem('profileData', JSON.stringify(profileData));

    // Переходим к профилю
    showProfile();
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

    // Сохраняем данные профиля в localStorage
    const profileData = { nickname, email, password };
    localStorage.setItem('profileData', JSON.stringify(profileData));

    // Переходим к профилю
    showProfile();
}

// Переход на экран профиля при нажатии на кнопку
function showProfileContent() {
    document.getElementById('auth-form').style.display = 'none';
    document.getElementById('profile-content').style.display = 'block';
}

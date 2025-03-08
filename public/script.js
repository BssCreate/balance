const apiUrl = "https://script.google.com/macros/s/AKfycbxdivQqwTaFb3UTLTaIG95EdVyc1MHNFia99TAvMYHIMGNv51wt6Unltx26wdgebxPO/exec"; // Ваш API URL
let verificationCode;  // Код для проверки

document.addEventListener("DOMContentLoaded", function() {
    console.log('DOMContentLoaded');
    showProfile();
});

// Навигация
function showContent(contentId) {
    const contents = document.querySelectorAll(".content");
    contents.forEach(content => content.classList.remove("active"));

    const buttons = document.querySelectorAll(".bottom-nav button");
    buttons.forEach(button => button.classList.remove("active"));

    document.getElementById(contentId).classList.add("active");
    document.getElementById(`btn-${contentId}`).classList.add("active");
}

function showProfile() {
    console.log('showProfile called');

    // Показать индикатор загрузки и скрыть контент профиля
    const loading = document.getElementById("loading");
    const profileContent = document.getElementById("profile-content");
    const authForm = document.getElementById("auth-form");

    loading.style.display = "block";
    profileContent.style.display = "none";
    authForm.style.display = "none";

    const userEmail = localStorage.getItem("email");
    console.log(`Email из localStorage: ${userEmail}`);

    if (userEmail) {
        console.log('Проверка профиля');
        checkProfile(userEmail);
    } else {
        console.log('Нет сохраненного email, показываем форму авторизации');
        setTimeout(() => {
            loading.style.display = "none";
            authForm.style.display = "block";
        }, 2000);
    }
}

// Проверка профиля пользователя
function checkProfile(email) {
    console.log(`Проверка профиля для email: ${email}`);
    fetch(`${apiUrl}?action=checkProfile&email=${email}`)
        .then(response => response.json())
        .then(data => {
            console.log('Ответ от API:', data);
            const loading = document.getElementById("loading");
            const profileContent = document.getElementById("profile-content");
            const authForm = document.getElementById("auth-form");

            loading.style.display = "none";
            if (data.exists) {
                console.log('Профиль найден, показываем профиль');
                profileContent.style.display = "block";
                document.getElementById("nickname").innerText = data.nickname;
                document.getElementById("email").innerText = data.email;
            } else {
                console.log('Профиль не найден, показываем форму регистрации');
                authForm.style.display = "block";
                document.getElementById("email-step").style.display = "none";
                document.getElementById("password-step").style.display = "none";
                document.getElementById("register-step").style.display = "block";
            }
        })
        .catch(error => {
            console.error('Ошибка при проверке профиля:', error);
        });
}



// Получение кода и отправка на email
document.getElementById("sendCodeBtn").addEventListener("click", function() {
    const email = document.getElementById("email").value;
    if (email) {
        sendVerificationCode(email);
    }
});

function sendVerificationCode(email) {
    // Генерируем случайный код для примера
    verificationCode = Math.floor(100000 + Math.random() * 900000);  // Генерация 6-значного кода
    console.log(`Отправленный код: ${verificationCode}`);  // Отправляем код в консоль

    // Переход на этап ввода кода
    document.getElementById("user-email").innerText = email;
    document.getElementById("email-step").style.display = "none";
    document.getElementById("code-step").style.display = "block";

    // Сохраняем код для проверки позже
    startCountdown();
}

// Таймер для повторной отправки кода
let countdownValue = 59;
let countdown;

function startCountdown() {
    countdownValue = 59;
    countdown = setInterval(function() {
        if (countdownValue <= 0) {
            clearInterval(countdown);
            document.getElementById("resend-text").innerText = "Введите код из почты";
            document.getElementById("resend-text").style.color = "blue";
        } else {
            document.getElementById("resend-text").innerText = `Отправить повторно через ${countdownValue}s`;
            countdownValue--;
        }
    }, 1000);
}

// Обработка ввода кода
function moveNext(index) {
    const otpInputs = document.querySelectorAll(".otp-input");
    if (otpInputs[index].value.length === 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
    }
}

function verifyCode() {
    const enteredCode = Array.from(document.querySelectorAll(".otp-input")).map(input => input.value).join("");
    if (enteredCode === verificationCode.toString()) {
        login();
    } else {
        alert("Неверный код");
        resetCodeFields();
    }
}

function resetCodeFields() {
    const otpInputs = document.querySelectorAll(".otp-input");
    otpInputs.forEach(input => input.value = "");
}

// Вход в систему
function login() {
    const password = document.getElementById("password").value;
    fetch(`${apiUrl}?action=login&email=${document.getElementById("user-email").innerText}&password=${password}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem("email", data.email);
                showProfile();  // После успешного входа, показываем профиль
                showContent('profile');  // Переключаем на страницу профиля
            } else {
                alert("Неверный пароль");
            }
        });
}

// Регистрация
function register() {
    const nickname = document.getElementById("nickname").value;
    const password = document.getElementById("reg-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password === confirmPassword) {
        fetch(`${apiUrl}?action=register&nickname=${nickname}&password=${password}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Регистрация успешна");
                    localStorage.setItem("email", data.email);
                    showProfile();
                    showContent('profile');  // После регистрации переключаем на профиль
                } else {
                    alert("Ошибка регистрации");
                }
            });
    } else {
        alert("Пароли не совпадают");
    }
}

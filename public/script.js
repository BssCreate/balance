const apiUrl = "https://script.google.com/macros/s/AKfycbxdivQqwTaFb3UTLTaIG95EdVyc1MHNFia99TAvMYHIMGNv51wt6Unltx26wdgebxPO/exec"; // Вставь ссылку API

let verificationCode;
let countdown;
let countdownValue = 60;

document.addEventListener("DOMContentLoaded", function() {
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

// Показать профиль
function showProfile() {
    document.getElementById("loading").style.display = "block";
    document.getElementById("profile-content").style.display = "none";
    document.getElementById("auth-form").style.display = "none";

    const userEmail = localStorage.getItem("email");
    if (userEmail) {
        checkProfile(userEmail);
    } else {
        setTimeout(() => {
            document.getElementById("loading").style.display = "none";
            document.getElementById("auth-form").style.display = "block";
        }, 2000);
    }
}

// Проверка профиля пользователя
function checkProfile(email) {
    fetch(`${apiUrl}?email=${email}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("loading").style.display = "none";
            if (data.exists) {
                document.getElementById("profile-content").style.display = "block";
                document.getElementById("nickname").innerText = data.nickname;
                document.getElementById("email").innerText = data.email;
            } else {
                document.getElementById("auth-form").style.display = "block";
                document.getElementById("email-step").style.display = "none";
                document.getElementById("password-step").style.display = "none";
                document.getElementById("register-step").style.display = "block";
            }
        });
}

// Получение кода и отправка
document.getElementById("sendCodeBtn").addEventListener("click", function() {
    const email = document.getElementById("email").value;
    if (email) {
        sendVerificationCode(email);
    }
});

function sendVerificationCode(email) {
    fetch(`${apiUrl}?action=send_code&email=${email}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                verificationCode = data.code;
                startCountdown();
                document.getElementById("user-email").innerText = email;
                document.getElementById("email-step").style.display = "none";
                document.getElementById("code-step").style.display = "block";
            }
        });
}

// Таймер для повторной отправки кода
function startCountdown() {
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
    if (enteredCode === verificationCode) {
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

// Вход
function login() {
    const password = document.getElementById("password").value;
    fetch(`${apiUrl}?action=login&email=${document.getElementById("user-email").innerText}&password=${password}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem("email", data.email);
                showProfile();  // После успешного входа, показываем профиль
                showContent('profile');  // Обязательно переключаем на страницу профиля
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

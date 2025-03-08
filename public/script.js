const apiUrl = "https://script.google.com/macros/s/AKfycbxdivQqwTaFb3UTLTaIG95EdVyc1MHNFia99TAvMYHIMGNv51wt6Unltx26wdgebxPO/exec"; // Вставь ссылку API

let currentUser = null;  
let timer = null;
let timerCount = 59;

document.addEventListener("DOMContentLoaded", () => {
    console.log("Скрипт загружен!");

    const sendCodeBtn = document.getElementById("sendCodeBtn");
    if (sendCodeBtn) {
        sendCodeBtn.addEventListener("click", sendCode);
    }

    const verifyCodeBtn = document.getElementById("verifyCodeBtn");
    if (verifyCodeBtn) {
        verifyCodeBtn.addEventListener("click", verifyCode);
    }
});

async function sendCode() {
    const email = document.getElementById('email').value;
    if (!email) {
        alert("Введите email!");
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: "register", email, nickname: "", password: "" })
        });

        const data = await response.json();
        if (data.success) {
            alert("Письмо отправлено");
            startTimer();
        } else {
            alert("Ошибка: " + data.message);
        }
    } catch (error) {
        console.error("Ошибка при отправке кода:", error);
        alert("Ошибка соединения с сервером");
    }
}

function startTimer() {
    const resendText = document.getElementById("resendText");
    resendText.textContent = `Отправить повторно через ${timerCount} секунд`;
    resendText.style.color = "gray";
    document.getElementById("sendCodeBtn").disabled = true;  // Отключаем кнопку отправки кода

    timer = setInterval(() => {
        if (timerCount > 1) {
            timerCount--;
            resendText.textContent = `Отправить повторно через ${timerCount} секунд`;
        } else {
            clearInterval(timer);
            resendText.textContent = "Отправить повторно";
            resendText.style.color = "blue";
            document.getElementById("sendCodeBtn").disabled = false;  // Включаем кнопку отправки кода
            timerCount = 59;  // Сбрасываем таймер
        }
    }, 1000);
}

async function verifyCode() {
    const code = document.getElementById("verificationCode").value;
    if (code.length !== 6) {
        alert("Введите 6 цифр!");
        return;
    }

    const email = document.getElementById("email").value;

    // Здесь можно добавить проверку кода (сейчас это фиктивная проверка)
    if (code === "123456") {
        alert("Код подтвержден!");
        showProfile();
    } else {
        alert("Неверный код!");
        document.getElementById("verificationCode").value = "";  // Очищаем поле
    }
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: "login", email, password })
    });

    const data = await response.json();
    if (data.success) {
        alert('Вход успешен!');
        currentUser = data.user;
        showProfile();
    } else {
        alert('Ошибка: ' + data.message);
    }
}

function showProfile() {
    document.getElementById("loading").style.display = "block";
    document.getElementById("profile-content").style.display = "none";
    document.getElementById("auth-form").style.display = "none";

    setTimeout(() => {
        document.getElementById("loading").style.display = "none";

        if (currentUser) {
            document.getElementById("nickname").textContent = currentUser.nickname;
            document.getElementById("email").textContent = currentUser.email;
            document.getElementById("profile-content").style.display = "block";
        } else {
            document.getElementById("auth-form").style.display = "block";
        }
    }, 2000);

    // Обновляем навигацию
    document.querySelectorAll('.bottom-nav button').forEach(btn => btn.classList.remove('active'));
    document.getElementById('btn-profile').classList.add('active');

    // Показываем секцию профиля
    document.querySelectorAll('.content').forEach(content => content.classList.remove('active'));
    document.getElementById("profile").classList.add("active");
}

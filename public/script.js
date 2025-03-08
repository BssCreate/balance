const apiUrl = "https://script.google.com/macros/s/AKfycbygLpe2adm1TqoLSIYRp0wjNu7F6dn53DCZ-nMlCRW-hKbR0UziRLNaf-lfQ_tun1ed/exec"; // Вставь ссылку API

document.getElementById("btn-profile").addEventListener("click", showProfile);

document.addEventListener('DOMContentLoaded', function() {
    const btnProfile = document.getElementById("btn-profile");

    // Проверим, существует ли кнопка профиля
    if (btnProfile) {
        btnProfile.addEventListener("click", showProfile);
    } else {
        console.error("Кнопка профиля не найдена! Проверьте HTML.");
    }
});

function showProfile() {
    console.log("Переход в профиль начался...");
    // Показываем анимацию загрузки
    document.getElementById("loading").style.display = "block";
    document.getElementById("profile-content").style.display = "none";
    document.getElementById("auth-form").style.display = "none";
    
    // Симуляция загрузки и затем проверка наличия профиля
    setTimeout(function() {
        // После завершения "загрузки", скрываем её и показываем форму
        document.getElementById("loading").style.display = "none";
        document.getElementById("auth-form").style.display = "block";
    }, 2000); // Задержка для симуляции загрузки (2 секунды)
}



function sendCode() {
    const email = document.getElementById("email").value;

    // Здесь будет код отправки кода на почту
    // Для реализации с Google Таблицами, необходимо использовать Google Apps Script или интеграцию с API

    // Пока что покажем текст с почтой
    document.getElementById("user-email").textContent = email;
    
    // Переходим к следующему шагу (ввод кода)
    document.getElementById("email-step").style.display = "none";
    document.getElementById("code-step").style.display = "block";
}

// Функция для перехода между полями ввода OTP
function moveNext(index) {
    const otpInputs = document.querySelectorAll('.otp-input');
    if (index < otpInputs.length - 1 && otpInputs[index].value.length === 1) {
        otpInputs[index + 1].focus();
    }
}

// Добавь сюда дальнейшие функции для регистрации, входа и проверки кода


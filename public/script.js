const apiUrl = "https://script.google.com/macros/s/AKfycbxdivQqwTaFb3UTLTaIG95EdVyc1MHNFia99TAvMYHIMGNv51wt6Unltx26wdgebxPO/exec"; // Вставь ссылку API

// Переменная для хранения информации о текущем пользователе
let currentUser = null;  

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

        // Сохраняем пользователя в переменную
        currentUser = data.user;

        document.getElementById('nickname').textContent = currentUser.nickname;
        document.getElementById('email').textContent = currentUser.email;

        // Показываем профиль
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

        if (currentUser) {  // Проверяем, есть ли пользователь
            document.getElementById("nickname").textContent = currentUser.nickname;
            document.getElementById("email").textContent = currentUser.email;
            document.getElementById("profile-content").style.display = "block";
        } else {
            document.getElementById("auth-form").style.display = "block";
        }
    }, 2000);

    // Обновляем состояние навигации
    document.querySelectorAll('.bottom-nav button').forEach(btn => btn.classList.remove('active'));
    document.getElementById('btn-profile').classList.add('active');

    // Показываем секцию профиля
    document.querySelectorAll('.content').forEach(content => content.classList.remove('active'));
    document.getElementById("profile").classList.add("active");
}


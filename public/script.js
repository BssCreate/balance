const apiUrl = "https://script.google.com/macros/s/AKfycbxdivQqwTaFb3UTLTaIG95EdVyc1MHNFia99TAvMYHIMGNv51wt6Unltx26wdgebxPO/exec"; // Вставь ссылку API

async function sendCode() {
    const email = document.getElementById('email').value;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: "register", email, nickname: "", password: "" })
    });

    const data = await response.json();
    alert(data.success ? "Письмо отправлено" : "Ошибка: " + data.message);
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
        document.getElementById('nickname').textContent = data.user.nickname;
        document.getElementById('email').textContent = data.user.email;
    } else {
        alert('Ошибка: ' + data.message);
    }
}

async function register() {
    const email = document.getElementById('email').value;
    const nickname = document.getElementById('nickname').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Пароли не совпадают!');
        return;
    }

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: "register", email, nickname, password })
    });

    const data = await response.json();
    alert(data.success ? "Регистрация успешна!" : "Ошибка: " + data.message);
}

function showContent(section) {
             document.querySelectorAll('.content').forEach(content => content.classList.remove('active'));
             document.getElementById(section).classList.add('active');
         }
 
         function showProfile() {        function showProfile() {
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
         }

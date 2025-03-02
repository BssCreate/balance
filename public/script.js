function sendCode() {
    const email = document.getElementById('email').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, nickname: '', password: '' })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Письмо отправлено для подтверждения');
        } else {
            alert('Ошибка: ' + data.message);
        }
    });
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Вход успешен!');
            document.getElementById('nickname').textContent = data.user.nickname;
            document.getElementById('email').textContent = data.user.email;
        } else {
            alert('Ошибка: ' + data.message);
        }
    });
}

function register() {
    const email = document.getElementById('email').value;
    const nickname = document.getElementById('nickname').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Пароли не совпадают!');
        return;
    }

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, nickname, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Регистрация успешна!');
        } else {
            alert('Ошибка: ' + data.message);
        }
    });
}

const apiUrl = "https://script.google.com/macros/s/AKfycbygLpe2adm1TqoLSIYRp0wjNu7F6dn53DCZ-nMlCRW-hKbR0UziRLNaf-lfQ_tun1ed/exec"; // Вставь ссылку API

function showProfile() {
    // Показываем анимацию загрузки
    document.getElementById('loading').style.display = 'block';
    document.getElementById('profile-content').style.display = 'none';

    // Симуляция загрузки (например, 2 секунды)
    setTimeout(function() {
        // После завершения загрузки скрываем анимацию и показываем профиль
        document.getElementById('loading').style.display = 'none';
        document.getElementById('profile-content').style.display = 'block';

        // Здесь можно загрузить данные профиля (например, через API или из Google Sheets)
        document.getElementById('nickname').innerText = "Пример Ник";
        document.getElementById('email').innerText = "example@mail.com";
    }, 2000); // 2 секунды для примера
}

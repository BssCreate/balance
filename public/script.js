            if (!window.supabase) {
                console.error("Supabase SDK не загружен!");
            } else {
                console.log("Supabase загружен!");
            }

            const SUPABASE_URL = "https://gspbugpedugmabacagrc.supabase.co"; // Замени на свой URL
            const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzcGJ1Z3BlZHVnbWFiYWNhZ3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5MjM1NjIsImV4cCI6MjA1NjQ5OTU2Mn0.mdcmjQCQVDC2LX8DfzJyLjrwXn9kz0SYtDulcS78aCE"; // Замени на свой ключ
            const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
            let currentUser = null;
            let verificationCode = "";
            let codeExpiration = null;

        function showContent(section) {
            document.querySelectorAll('.content').forEach(content => content.classList.remove('active'));
            document.getElementById(section).classList.add('active');
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
        }


        async function sendCode() {
            const email = document.getElementById("email").value;
        
            // Проверяем, есть ли email в базе
            const { data: user, error } = await supabase
                .from("users")
                .select("*")
                .eq("email", email)
                .single();
        
            if (error || !user) {
                document.getElementById("email-step").style.display = "none";
                document.getElementById("register-step").style.display = "block";
            } else {
                verificationCode = generateVerificationCode();
                codeExpiration = new Date(new Date().getTime() + 10 * 60000); // 10 минут
        
                console.log("Код:", verificationCode); // Для теста
        
                document.getElementById("email-step").style.display = "none";
                document.getElementById("code-step").style.display = "block";
                document.getElementById("user-email").textContent = email;
            }
        }


        function generateVerificationCode() {
            return Math.floor(100000 + Math.random() * 900000).toString(); // Генерация случайного 6-значного кода
        }

        function verifyCode() {
            const codeEntered = Array.from(document.querySelectorAll('.otp-input'))
                .map(input => input.value).join('');
        
            if (codeEntered === verificationCode && new Date() < codeExpiration) {
                document.getElementById("code-step").style.display = "none";
        
                if (currentUser) {
                    document.getElementById("password-step").style.display = "block";
                } else {
                    document.getElementById("register-step").style.display = "block";
                }
            } else {
                alert("Неверный код!");
                document.querySelectorAll(".otp-input").forEach(input => input.value = "");
            }
        }


        function moveNext(index) {
            let inputs = document.querySelectorAll('.otp-input');
            if (inputs[index].value && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
            if (inputs.every(input => input.value.length === 1)) {
                verifyCode();
            }
        }

        async function login() {
            const email = document.getElementById("user-email").textContent;
            const password = document.getElementById("password").value;
        
            const { data: user, error } = await supabase
                .from("users")
                .select("*")
                .eq("email", email)
                .eq("password", password)
                .single();
        
            if (user) {
                alert("Успешный вход!");
                currentUser = user;
                showProfile();
            } else {
                alert("Неверный пароль!");
            }
        }


        async function register() {
            const email = document.getElementById("user-email").textContent;
            const nickname = document.getElementById("nickname").value;
            const password = document.getElementById("reg-password").value;
            const confirmPassword = document.getElementById("confirm-password").value;
        
            if (password !== confirmPassword) {
                alert("Пароли не совпадают!");
                return;
            }
        
            const { error } = await supabase
                .from("users")
                .insert([{ email, password, nickname }]);
        
            if (error) {
                alert("Ошибка регистрации!");
            } else {
                alert("Регистрация успешна!");
                currentUser = { email, nickname };
                showProfile();
            }
        }

// script.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Các phần tử DOM ---
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const googleBtn = document.getElementById('google-btn');
    const facebookBtn = document.getElementById('facebook-btn');
    const messageEl = document.getElementById('auth-message');
    
    // Nút chuyển đổi form
    const showRegisterBtn = document.getElementById('show-register');
    const showLoginBtn = document.getElementById('show-login');

    const API_BASE_URL = 'http://localhost:3000/api'; // URL gốc của API

    // --- Chuyển đổi giữa form đăng nhập và đăng ký ---
    showRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        messageEl.textContent = '';
    });

    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        messageEl.textContent = '';
    });

    // --- Xử lý ĐĂNG KÝ ---
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        messageEl.textContent = '';

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Đăng ký thất bại.');
            }
            
            // Đăng ký thành công, lưu token và chuyển hướng
            localStorage.setItem('authToken', result.token);
            window.location.href = 'dashboard.html'; // Chuyển đến trang dashboard

        } catch (error) {
            messageEl.textContent = `Lỗi: ${error.message}`;
        }
    });

    // --- Xử lý ĐĂNG NHẬP ---
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        messageEl.textContent = '';

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Đăng nhập thất bại.');
            }
            
            // Đăng nhập thành công, lưu token và chuyển hướng
            localStorage.setItem('authToken', result.token);
            window.location.href = 'dashboard.html'; // Chuyển đến trang dashboard

        } catch (error) {
            messageEl.textContent = `Lỗi: ${error.message}`;
        }
    });

    // --- Xử lý đăng nhập mạng xã hội ---
    googleBtn.addEventListener('click', () => {
        window.location.href = `${API_BASE_URL}/auth/google`;
    });

    facebookBtn.addEventListener('click', () => {
        window.location.href = `${API_BASE_URL}/auth/facebook`;
    });
});
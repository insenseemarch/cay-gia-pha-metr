// dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Lấy token từ localStorage ---
    const token = localStorage.getItem('authToken');

    // Nếu không có token, người dùng chưa đăng nhập, quay về trang index.html
    if (!token) {
        window.location.href = '/index.html';
        return;
    }

    // --- Các phần tử DOM ---
    const showCreateBtn = document.getElementById('show-create-form');
    const showJoinBtn = document.getElementById('show-join-form');
    const createSection = document.getElementById('create-tree-section');
    const joinSection = document.getElementById('join-tree-section');
    const createForm = document.getElementById('create-tree-form');
    const joinForm = document.getElementById('join-tree-form');
    const messageEl = document.getElementById('dashboard-message');
    const logoutBtn = document.getElementById('logout-btn');

    const API_BASE_URL = 'http://localhost:3000/api';

    // --- Hiển thị các form tương ứng ---
    showCreateBtn.addEventListener('click', () => {
        createSection.style.display = 'block';
        joinSection.style.display = 'none';
        messageEl.textContent = '';
    });

    showJoinBtn.addEventListener('click', () => {
        joinSection.style.display = 'block';
        createSection.style.display = 'none';
        messageEl.textContent = '';
    });

    // --- Xử lý TẠO CÂY MỚI ---
    createForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('tree-name').value;
        const description = document.getElementById('tree-description').value;
        messageEl.textContent = 'Đang xử lý...';

        try {
            const response = await fetch(`${API_BASE_URL}/trees/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Gửi token để xác thực
                },
                body: JSON.stringify({ name, description })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Tạo cây thất bại.');
            }

            // Tạm thời chỉ thông báo, sau này có thể chuyển hướng đến trang chi tiết cây
            messageEl.textContent = `Tạo cây "${result.name}" thành công! ID để chia sẻ: ${result.shareable_id}`;
            createForm.reset();
            createSection.style.display = 'none';

        } catch (error) {
            messageEl.textContent = `Lỗi: ${error.message}`;
        }
    });

    // --- Xử lý GIA NHẬP CÂY ---
    joinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const shareableId = document.getElementById('shareable-id').value;
        messageEl.textContent = 'Đang xử lý...';

        try {
            const response = await fetch(`${API_BASE_URL}/trees/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Gửi token để xác thực
                },
                body: JSON.stringify({ shareableId })
            });
            
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Gia nhập thất bại.');
            }
            
            // Tạm thời chỉ thông báo, sau này có thể chuyển hướng đến trang chi tiết cây
            messageEl.textContent = result.message;
            joinForm.reset();
            joinSection.style.display = 'none';

        } catch (error) {
            messageEl.textContent = `Lỗi: ${error.message}`;
        }
    });

    // --- Xử lý ĐĂNG XUẤT ---
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('authToken'); // Xóa token
        window.location.href = '/index.html'; // Quay về trang đăng nhập
    });
});
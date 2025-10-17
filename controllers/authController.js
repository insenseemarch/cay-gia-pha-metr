// --- HÀM XỬ LÝ SOCIAL LOGIN (ĐÃ CHỈNH SỬA ĐỂ CHUYỂN HƯỚNG) ---
exports.socialLogin = (req, res) => {
    if (!req.user) {
        // Chuyển về trang đăng nhập với một thông báo lỗi nếu thất bại
        // Lưu ý: Port 5500 là port mặc định của Live Server, nếu của bạn khác, hãy thay đổi nó
        return res.redirect('http://127.0.0.1:5500/index.html?error=authentication_failed');
    }

    // Tạo token
    const token = generateToken(req.user);

    // Chuyển hướng người dùng đến trang auth-success.html cùng với token
    // Trang này sẽ lấy token từ URL, lưu nó và chuyển tiếp đến dashboard
    res.redirect(`http://127.0.0.1:5500/auth-success.html?token=${token}`);
};
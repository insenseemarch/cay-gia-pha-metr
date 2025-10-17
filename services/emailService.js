const nodemailer = require('nodemailer');

// Cấu hình transporter (người gửi mail)
const transporter = nodemailer.createTransport({
    service: 'gmail', // Hoặc một dịch vụ mail khác
    auth: {
        user: 'tranthithuytien1003@gmail.com', // Email của bạn
        pass: 'ldzj vqpe efht fndz' // Mật khẩu ứng dụng của Gmail, không phải mật khẩu thường
    }
});

// Hàm gửi email yêu cầu cấp quyền
const sendPermissionRequestEmail = async (adminEmail, requesterInfo, treeInfo) => {
    const mailOptions = {
        from: '"Ứng dụng Gia Phả" <tranthithuytien1003@gmail.com>',
        to: adminEmail,
        subject: `[Gia Phả] Yêu cầu cấp quyền chỉnh sửa từ ${requesterInfo.username}`,
        html: `
            <p>Xin chào Admin,</p>
            <p>Người dùng <b>${requesterInfo.username}</b> (Họ tên: ${requesterInfo.fullName}) vừa gửi yêu cầu xin cấp quyền chỉnh sửa cho cây gia phả "<b>${treeInfo.name}</b>".</p>
            <p>Vui lòng đăng nhập vào hệ thống để xem xét và cấp quyền cho người dùng này.</p>
            <p>Trân trọng,</p>
            <p>Đội ngũ phát triển.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email yêu cầu đã được gửi thành công.');
        return true;
    } catch (error) {
        console.error('Lỗi khi gửi email:', error);
        return false;
    }
};

module.exports = { sendPermissionRequestEmail };
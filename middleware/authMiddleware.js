const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Lấy token từ header
            token = req.headers.authorization.split(' ')[1];

            // Xác thực token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Gắn thông tin người dùng vào request (trừ mật khẩu)
            const userResult = await db.query('SELECT id, email, username FROM users WHERE id = $1', [decoded.id]);
            req.user = userResult.rows[0];

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Không được phép, token không hợp lệ.' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Không được phép, không có token.' });
    }
};
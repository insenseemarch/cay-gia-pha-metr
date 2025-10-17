const express = require('express');
const router = express.Router();
const treeController = require('../controllers/treeController');
const { protect } = require('../middleware/authMiddleware'); // Middleware để bảo vệ route

// Các route này yêu cầu người dùng phải đăng nhập (đã có token)
router.post('/create', protect, treeController.createTree);
router.post('/join', protect, treeController.joinTree);

// Các route khác liên quan đến việc thêm/sửa/xóa thành viên trong cây...
// Ví dụ: router.post('/:treeId/members', protect, memberController.addMember);

module.exports = router;
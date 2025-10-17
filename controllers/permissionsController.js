const db = require('../config/db');
const { sendPermissionRequestEmail } = require('../services/emailService');

// ==========================================================
// Dành cho ADMIN cấp quyền cho người khác
// ==========================================================
exports.grantPermissions = async (req, res) => {
    const { treeId } = req.params;
    const { userToGrantId, permissions } = req.body;

    if (!userToGrantId || !permissions) {
        return res.status(400).json({ error: 'Thiếu thông tin người dùng hoặc quyền hạn.' });
    }

    const { can_add, can_edit, can_delete } = permissions;

    try {
        const query = `
            INSERT INTO user_permissions (family_tree_id, user_id, can_add, can_edit, can_delete)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (family_tree_id, user_id) 
            DO UPDATE SET 
                can_add = EXCLUDED.can_add,
                can_edit = EXCLUDED.can_edit,
                can_delete = EXCLUDED.can_delete
            RETURNING *;
        `;
        
        const values = [treeId, userToGrantId, can_add, can_edit, can_delete];
        const result = await db.query(query, values);

        res.status(200).json({ 
            message: 'Cập nhật quyền thành công!',
            permissions: result.rows[0] 
        });

    } catch (error) {
        console.error("Lỗi khi cấp quyền:", error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ.' });
    }
};

// ==========================================================
// Dành cho USER gửi yêu cầu xin quyền
// ==========================================================
exports.requestPermission = async (req, res) => {
    const { treeId } = req.params;
    const requesterId = req.user.userId;

    try {
        // Lấy thông tin cây và email của admin (owner)
        const treeResult = await db.query(
            `SELECT t.name, t.owner_id, u.email as admin_email, p.full_name as requester_name, u_req.username as requester_username
             FROM family_trees t
             JOIN users u ON t.owner_id = u.id
             JOIN persons p ON p.user_account_id = $2
             JOIN users u_req ON u_req.id = $2
             WHERE t.id = $1`,
            [treeId, requesterId]
        );

        if (treeResult.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy thông tin cây hoặc người dùng.' });
        }

        const { admin_email, requester_name, requester_username, name: tree_name } = treeResult.rows[0];
        
        if (!admin_email) {
            return res.status(500).json({ error: 'Quản trị viên của cây này chưa cập nhật email.' });
        }

        // Gửi email
        const emailSent = await sendPermissionRequestEmail(
            admin_email,
            { username: requester_username, fullName: requester_name },
            { name: tree_name }
        );
        
        if (emailSent) {
            res.status(200).json({ message: 'Yêu cầu của bạn đã được gửi đến quản trị viên.' });
        } else {
            res.status(500).json({ message: 'Không thể gửi email yêu cầu vào lúc này. Vui lòng thử lại sau.' });
        }

    } catch (error) {
        console.error("Lỗi khi gửi yêu cầu quyền:", error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ.' });
    }
};
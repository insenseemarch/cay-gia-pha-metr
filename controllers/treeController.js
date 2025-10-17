const db = require('../config/db');
const { nanoid } = require('nanoid'); // Cần cài đặt: npm install nanoid

// --- HÀM MỚI: Tạo cây gia phả mới ---
exports.createTree = async (req, res) => {
    const { name, description } = req.body;
    const ownerId = req.user.id; // Lấy từ middleware xác thực JWT

    if (!name) {
        return res.status(400).json({ message: 'Tên cây gia phả là bắt buộc.' });
    }

    // Tạo một ID chia sẻ ngẫu nhiên và dễ đọc
    const shareableId = nanoid(8); // Ví dụ: 'aB1cDeFg'

    try {
        // Bắt đầu một transaction
        await db.query('BEGIN');

        // 1. Thêm cây mới vào bảng family_trees
        const newTreeResult = await db.query(
            'INSERT INTO family_trees (name, description, owner_id, shareable_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, ownerId, shareableId]
        );
        const newTree = newTreeResult.rows[0];

        // 2. Cấp quyền sở hữu (owner) cho người tạo cây
        await db.query(
            'INSERT INTO user_permissions (user_id, family_tree_id, permission_level) VALUES ($1, $2, $3)',
            [ownerId, newTree.id, 'owner']
        );

        // Kết thúc transaction
        await db.query('COMMIT');

        res.status(201).json(newTree);

    } catch (err) {
        await db.query('ROLLBACK'); // Hoàn tác nếu có lỗi
        console.error(err);
        res.status(500).json({ message: 'Lỗi khi tạo cây gia phả.' });
    }
};

// --- HÀM MỚI: Tham gia vào cây có sẵn ---
exports.joinTree = async (req, res) => {
    const { shareableId } = req.body;
    const userId = req.user.id;

    if (!shareableId) {
        return res.status(400).json({ message: 'Vui lòng cung cấp ID của cây.' });
    }

    try {
        // 1. Tìm cây gia phả bằng shareable_id
        const treeResult = await db.query('SELECT id FROM family_trees WHERE shareable_id = $1', [shareableId]);
        if (treeResult.rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy cây gia phả với ID này.' });
        }
        const familyTreeId = treeResult.rows[0].id;

        // 2. Kiểm tra xem người dùng đã ở trong cây chưa
        const permissionExists = await db.query(
            'SELECT * FROM user_permissions WHERE user_id = $1 AND family_tree_id = $2',
            [userId, familyTreeId]
        );
        if (permissionExists.rows.length > 0) {
            return res.status(409).json({ message: 'Bạn đã là thành viên của cây này.' });
        }

        // 3. Thêm quyền 'edit' cho người dùng vào cây
        await db.query(
            'INSERT INTO user_permissions (user_id, family_tree_id, permission_level) VALUES ($1, $2, $3)',
            [userId, familyTreeId, 'edit'] // Mặc định là quyền 'edit'
        );

        res.status(200).json({ message: 'Gia nhập cây thành công!' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi khi gia nhập cây.' });
    }
};
-- Xóa các bảng cũ để đảm bảo sự sạch sẽ
DROP TABLE IF EXISTS user_permissions;
DROP TABLE IF EXISTS persons;
DROP TABLE IF EXISTS family_trees;
DROP TABLE IF EXISTS users;

-- Bảng 1: users - Đơn giản hóa, chỉ cần Email và Password
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(100), -- Tên hiển thị, lấy từ social media hoặc cập nhật sau
    password_hash VARCHAR(255), -- Cho phép NULL vì người dùng social login không có password

    -- Cột để lưu thông tin đăng nhập qua mạng xã hội
    provider VARCHAR(50),       -- vd: 'google', 'facebook'
    provider_id VARCHAR(255),   -- ID từ nhà cung cấp

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, provider_id) -- Đảm bảo mỗi tài khoản social chỉ liên kết 1 lần
);

-- Bảng 2: family_trees - Thêm cột ID chia sẻ
CREATE TABLE family_trees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,

    -- ID ngẫu nhiên, dễ đọc để chia sẻ cho người khác
    shareable_id VARCHAR(10) NOT NULL UNIQUE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tạo index để tăng tốc độ tìm kiếm
CREATE INDEX idx_family_trees_shareable_id ON family_trees(shareable_id);

-- Bảng 3: persons - Giữ nguyên cấu trúc, nhưng không còn liên quan trực tiếp đến đăng ký
CREATE TABLE persons (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    gender VARCHAR(10),
    birth_date DATE,
    death_date DATE,
    father_id INTEGER REFERENCES persons(id) ON DELETE SET NULL,
    mother_id INTEGER REFERENCES persons(id) ON DELETE SET NULL,
    family_tree_id INTEGER NOT NULL REFERENCES family_trees(id) ON DELETE CASCADE,
    -- Cột này vẫn hữu ích để biết người này có tài khoản nào quản lý
    user_account_id INTEGER REFERENCES users(id) ON DELETE SET NULL UNIQUE
);

-- Bảng 4: user_permissions - Giữ nguyên, rất quan trọng cho việc phân quyền
CREATE TABLE user_permissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    family_tree_id INTEGER NOT NULL REFERENCES family_trees(id) ON DELETE CASCADE,
    can_add BOOLEAN DEFAULT FALSE,
    can_edit BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, family_tree_id)
);

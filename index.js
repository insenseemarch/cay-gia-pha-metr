require('dotenv').config(); // Phải ở dòng đầu tiên
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');

// Import cấu hình passport (để nó tự chạy)
require('./config/passport'); 

// Import các routes
const authRoutes = require('./routes/authRoutes');
const treeRoutes = require('./routes/treeRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Passport Middleware
app.use(passport.initialize());

// Định nghĩa các route
app.use('/api/auth', authRoutes);
app.use('/api/trees', treeRoutes);

// Khởi chạy server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
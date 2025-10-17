const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');
require('dotenv').config();

// Đăng nhập/Đăng ký bằng email/password
router.post('/register', authController.register);
router.post('/login', authController.login);

// --- CÁC ROUTE ĐĂNG NHẬP SOCIAL GIỮ NGUYÊN ---
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), authController.socialLogin);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), authController.socialLogin);

module.exports = router;
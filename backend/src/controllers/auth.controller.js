const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');

// ── Register ──
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required.',
                code: 'MISSING_FIELDS',
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered.',
                code: 'EMAIL_EXISTS',
            });
        }

        // Pass raw password as passwordHash — the pre-save hook will hash it
        const user = await User.create({
            name,
            email,
            passwordHash: password,
            role,
        });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken,
        });
    } catch (error) {
        next(error);
    }
};

// ── Login ──
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required.',
                code: 'MISSING_FIELDS',
            });
        }

        const user = await User.findOne({ email });
        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials.',
                code: 'INVALID_CREDENTIALS',
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials.',
                code: 'INVALID_CREDENTIALS',
            });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken,
        });
    } catch (error) {
        next(error);
    }
};

// ── Refresh Token ──
exports.refresh = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No refresh token.',
                code: 'NO_REFRESH_TOKEN',
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || user.refreshToken !== token || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token.',
                code: 'INVALID_REFRESH_TOKEN',
            });
        }

        const accessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        user.refreshToken = newRefreshToken;
        await user.save();

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ success: true, accessToken });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid refresh token.',
            code: 'INVALID_REFRESH_TOKEN',
        });
    }
};

// ── Logout ──
exports.logout = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);
        if (user) {
            user.refreshToken = null;
            await user.save();
        }

        res.clearCookie('refreshToken');
        res.json({ success: true, message: 'Logged out successfully.' });
    } catch (error) {
        next(error);
    }
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jwt_utils_1 = require("../utils/jwt.utils");
const user_model_1 = require("../models/user.model");
const protect = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }
    try {
        const decoded = (0, jwt_utils_1.verifyToken)(token);
        const user = await user_model_1.UserModel.findById(decoded.userId).select('-password');
        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }
        req.user = user; // Attach to req object
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
};
exports.protect = protect;

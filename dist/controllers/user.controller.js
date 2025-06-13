"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logoutUser = exports.getPaymentSources = exports.removeBankAccount = exports.renameBankAccount = exports.addBankAccount = exports.loginUser = exports.registerUser = void 0;
const user_model_1 = require("../models/user.model");
const hash_utils_1 = require("../utils/hash.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
const wallet_model_1 = require("../models/wallet.model");
const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const existingUser = await user_model_1.UserModel.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'Email already exists' });
            return;
        }
        const hashed = await (0, hash_utils_1.hashPassword)(password);
        const user = await user_model_1.UserModel.create({ name, email, phone, password: hashed });
        const wallet = await wallet_model_1.WalletModel.create({
            user_id: user._id,
            balance: 0,
            income: 0,
            expense: 0,
            savings: 0,
        });
        const token = (0, jwt_utils_1.generateToken)(user._id.toString());
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'development',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(201).json({ user: { name: user.name, email: user.email, phone: user.phone }, "message": " Registration successful" });
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to register user', error });
        return;
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.UserModel.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const isMatch = await (0, hash_utils_1.comparePassword)(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        console.log(user?._id);
        const token = (0, jwt_utils_1.generateToken)(user._id.toString());
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'development',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ user: { name: user.name, email: user.email, phone: user.phone }, message: 'LoggedIn successfully' });
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to login user', error });
        return;
    }
};
exports.loginUser = loginUser;
const addBankAccount = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user?._id;
        const updated = await user_model_1.UserModel.findByIdAndUpdate(userId, { $addToSet: { bankAccounts: name.trim() } }, { new: true });
        res.status(200).json({ message: 'Bank account added', bankAccounts: updated?.bankAccounts });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to add bank account', error });
    }
};
exports.addBankAccount = addBankAccount;
const renameBankAccount = async (req, res) => {
    try {
        const { oldName, newName } = req.body;
        const userId = req.user?._id;
        const user = await user_model_1.UserModel.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        if (oldName === newName) {
            res.status(400).json({ message: 'OldName and newName are both same' });
            return;
        }
        const index = user.bankAccounts.indexOf(oldName);
        if (index === -1) {
            res.status(404).json({ message: 'Old bank account not found' });
            return;
        }
        if (user.bankAccounts.indexOf(newName) !== -1) {
            res.status(400).json({ message: 'bank account with that name is already available. Enter last 4 digits to differentiate.' });
            return;
        }
        user.bankAccounts[index] = newName;
        await user.save();
        res.status(200).json({ message: 'Bank account renamed', bankAccounts: user.bankAccounts });
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to rename bank account', error });
        return;
    }
};
exports.renameBankAccount = renameBankAccount;
// export const renameCreditCard = async (req: Request, res: Response) => {
//   try {
//     const { oldName, newName } = req.body;
//     const userId = req.user?._id;
//     const user = await UserModel.findById(userId);
//     if (!user) {
//       res.status(404).json({ message: 'User not found' });
//       return;
//     }
//     if (oldName === newName) {
//       res.status(400).json({ message: 'OldName and newName are both same' });
//       return;
//     }
//     const index = user.creditCards.indexOf(oldName);
//     if (index === -1) {
//       res.status(404).json({ message: 'Old credit card not found' });
//       return;
//     }
//     if (user.creditCards.indexOf(newName) !== -1) {
//       res.status(400).json({ message: 'credit card with that name is already available. Enter last 4 digits to differentiate.' });
//       return;
//     }
//     user.creditCards[index] = newName;
//     await user.save();
//     res.status(200).json({ message: 'Credit card renamed', creditCards: user.creditCards });
//     return;
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to rename credit card', error });
//     return;
//   }
// };
const removeBankAccount = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user?._id;
        const updated = await user_model_1.UserModel.findByIdAndUpdate(userId, { $pull: { bankAccounts: name.trim() } }, { new: true });
        res.status(200).json({ message: `Bank account-${name} removed`, bankAccounts: updated?.bankAccounts });
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to remove bank account', error });
        return;
    }
};
exports.removeBankAccount = removeBankAccount;
// export const addCreditCard = async (req: Request, res: Response) => {
//   try {
//     const { name } = req.body;
//     const userId = req.user?._id;
//     const updated = await UserModel.findByIdAndUpdate(
//       userId,
//       { $addToSet: { creditCards: name.trim() } },
//       { new: true }
//     );
//     res.status(200).json({ message: 'Credit card added', creditCards: updated?.creditCards });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to add credit card', error });
//   }
// };
// export const removeCreditCard = async (req: Request, res: Response) => {
//   try {
//     const { name } = req.body;
//     const userId = req.user?._id;
//     const updated = await UserModel.findByIdAndUpdate(
//       userId,
//       { $pull: { creditCards: name.trim() } },
//       { new: true }
//     );
//     res.status(200).json({ message: 'Credit card removed', creditCards: updated?.creditCards });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to remove credit card', error });
//   }
// };
const getPaymentSources = async (req, res) => {
    try {
        const user = await user_model_1.UserModel.findById(req.user?._id).select('bankAccounts creditCards');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({
            bankAccounts: user.bankAccounts || [],
        });
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to retrieve payment sources', error });
        return;
    }
};
exports.getPaymentSources = getPaymentSources;
const logoutUser = (req, res) => {
    try {
        res.clearCookie('token').json({ message: 'Logged out successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to logout', error });
        return;
    }
};
exports.logoutUser = logoutUser;
const getMe = async (req, res) => {
    try {
        res.json({ user: req.user });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get the user details', error });
        return;
    }
};
exports.getMe = getMe;

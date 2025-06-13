"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransaction = exports.getTransactions = exports.createTransaction = void 0;
const transaction_model_1 = require("../models/transaction.model");
const user_model_1 = require("../models/user.model");
const createTransaction = async (req, res) => {
    try {
        const userId = req?.user?._id;
        const { source, source_detail } = req.body;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if ("Bank Account" === source) {
            const user = await user_model_1.UserModel.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            const allowedList = user.bankAccounts;
            if (!source_detail || !allowedList.includes(source_detail)) {
                res.status(400).json({
                    message: `Invalid bank account selected`,
                });
                return;
            }
        }
        const transaction = await transaction_model_1.TransactionModel.create({
            ...req.body,
            user: userId,
        });
        res.status(201).json(transaction);
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create transaction', error });
        return;
    }
};
exports.createTransaction = createTransaction;
const getTransactions = async (req, res) => {
    try {
        const transactions = await transaction_model_1.TransactionModel.find({ user: req?.user?._id }).sort({ transaction_date: -1 });
        res.status(200).json(transactions);
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch transactions', error });
        return;
    }
};
exports.getTransactions = getTransactions;
const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await transaction_model_1.TransactionModel.findOne({
            _id: id,
            user: req?.user?._id
        });
        if (!existing) {
            res.status(404).json({ message: 'Transaction not found' });
            return;
        }
        const forbiddenFields = [
            'amount',
            'category_id',
            'source',
            'source_detail',
            'transaction_date'
        ];
        for (const field of forbiddenFields) {
            if (!(field in req.body))
                continue;
            const reqValue = req.body[field];
            const existingValue = existing[field];
            let areEqual = false;
            if (field === 'transaction_date') {
                const reqDate = new Date(reqValue).toISOString().split('T')[0];
                const existingDate = new Date(existingValue).toISOString().split('T')[0];
                areEqual = reqDate === existingDate;
            }
            else {
                areEqual = String(reqValue) === String(existingValue);
            }
            if (!areEqual) {
                res.status(400).json({
                    message: `Modification of '${field}' is not allowed.`,
                    help: `For example, if a ₹${existing.amount} ${existing.category_type} was wrongly added, you'd create a reversal.`
                });
                return;
            }
        }
        const updatableFields = [
            'description',
            'payment_app',
            'status'
        ];
        const updateData = {};
        for (const field of updatableFields) {
            if (field in req.body) {
                updateData[field] = req.body[field];
            }
        }
        const updated = await transaction_model_1.TransactionModel.findOneAndUpdate({ _id: id, user: req?.user?._id }, updateData, { new: true });
        res.status(200).json(updated);
        return;
    }
    catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({
            message: 'Failed to update transaction',
            error
        });
        return;
    }
};
exports.updateTransaction = updateTransaction;
// export const deleteTransaction = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const deleted = await TransactionModel.findOneAndDelete({ _id: id, user: req?.user?._id });
//     if (!deleted) {
//       res.status(404).json({ message: 'Transaction not found' });
//       return;
//     }
//     res.status(200).json({ message: 'Transaction deleted successfully' });
//     return;
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to delete transaction', error });
//     return;
//   }
// };

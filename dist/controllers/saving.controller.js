"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSaving = exports.updateSaving = exports.getSavings = exports.createSaving = void 0;
const saving_model_1 = require("../models/saving.model");
const saving_schema_1 = require("../zod/saving.schema");
const createSaving = async (req, res) => {
    try {
        const parsed = saving_schema_1.savingSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
            return;
        }
        const data = parsed.data;
        if (data.current_amount > data.amount) {
            res.status(400).json({
                message: 'Current amount cannot exceed target amount.',
                help: 'Add a larger target or reduce initial saving.'
            });
            return;
        }
        const newSaving = {
            ...data,
            user: req?.user?._id,
            is_completed: data.current_amount === data.amount
        };
        const created = await saving_model_1.SavingModel.create(newSaving);
        res.status(201).json(created);
        return;
    }
    catch (error) {
        console.error('Error creating saving:', error);
        res.status(500).json({ message: 'Failed to create saving', error });
        return;
    }
};
exports.createSaving = createSaving;
const getSavings = async (req, res) => {
    try {
        const savings = await saving_model_1.SavingModel.find({ user: req?.user?._id }).sort({ transaction_date: -1 }).sort({ expected_at: 1 });
        res.status(200).json(savings);
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch savings', error });
        return;
    }
};
exports.getSavings = getSavings;
const updateSaving = async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await saving_model_1.SavingModel.findOne({
            _id: id,
            user: req.user._id
        });
        if (!existing) {
            res.status(404).json({ message: 'Saving goal not found.' });
            return;
        }
        const forbiddenFields = [
            'amount',
            'transaction_date',
            'expected_at',
            'source',
            'source_detail',
            'payment_app'
        ];
        for (const field of forbiddenFields) {
            if (!(field in req.body))
                continue;
            const reqValue = req.body[field];
            const existingValue = existing[field];
            let areEqual = false;
            if (field === 'transaction_date' || field === 'expected_at') {
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
                    help: `Create a new saving goal if major details need to be changed.`
                });
                return;
            }
        }
        const updatableFields = ['purpose', 'pic', 'current_amount'];
        const updateData = {};
        for (const field of updatableFields) {
            if (!(field in req.body))
                continue;
            if (field === 'current_amount') {
                const newAmount = Number(req.body[field]);
                if (isNaN(newAmount) || newAmount < 0) {
                    res.status(400).json({ message: 'Invalid current amount.' });
                    return;
                }
                if (newAmount > existing.amount) {
                    res.status(400).json({
                        message: 'Cannot exceed the target saving amount.',
                        help: `Target: ₹${existing.amount}, Attempted: ₹${newAmount}`
                    });
                    return;
                }
                updateData.current_amount = newAmount;
                updateData.is_completed = newAmount === existing.amount;
            }
            else {
                updateData[field] = req.body[field];
            }
        }
        const updated = await saving_model_1.SavingModel.findOneAndUpdate({ _id: id, user: req.user._id }, updateData, { new: true });
        res.status(200).json(updated);
    }
    catch (error) {
        console.error('❌ Error updating saving:', error);
        res.status(500).json({ message: 'Failed to update saving', error });
    }
};
exports.updateSaving = updateSaving;
const deleteSaving = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await saving_model_1.SavingModel.findOneAndDelete({ _id: id, user: req?.user?._id });
        if (!deleted) {
            res.status(404).json({ message: 'Saving not found' });
            return;
        }
        res.status(200).json({ message: 'Saving deleted successfully' });
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete saving', error });
        return;
    }
};
exports.deleteSaving = deleteSaving;

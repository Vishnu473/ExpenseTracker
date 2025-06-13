"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavingModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const wallet_utils_1 = require("../utils/wallet.utils");
const savingSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    source: { type: String, enum: ['Cash', 'Bank Account', 'Other'], required: true },
    source_detail: { type: String, trim: true },
    payment_app: {
        type: String,
        enum: ['GPay', 'PhonePe', 'Paytm', 'AmazonPay', 'RazorPay', 'Other'],
    },
    purpose: { type: String, required: true },
    is_completed: { type: Boolean, default: false },
    current_amount: { type: Number, required: true },
    expected_at: { type: Date, required: true },
    amount: { type: Number, required: true },
    transaction_date: { type: Date, required: true },
    pic: { type: String }, // optional, for V2
}, { timestamps: true });
// 1. On save (create)
savingSchema.post('save', async function (doc) {
    await (0, wallet_utils_1.updateWallet)(doc.user.toString());
});
// 2. On update
savingSchema.post('findOneAndUpdate', async function () {
    const updated = await this.model.findOne(this.getQuery());
    if (updated) {
        await (0, wallet_utils_1.updateWallet)(updated.user.toString());
    }
});
// 3. On findOneAndDelete
savingSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await (0, wallet_utils_1.updateWallet)(doc.user.toString());
    }
});
// 4. On deleteOne (optional, only if you use deleteOne())
savingSchema.post('deleteOne', { document: false, query: true }, async function () {
    const doc = await this.model.findOne(this.getQuery());
    if (doc) {
        await (0, wallet_utils_1.updateWallet)(doc.user.toString());
    }
});
exports.SavingModel = mongoose_1.default.model('Saving', savingSchema);

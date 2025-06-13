"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savingSchema = void 0;
const zod_1 = require("zod");
exports.savingSchema = zod_1.z.object({
    source: zod_1.z.enum(['Cash', 'Bank Account', 'Other']),
    source_detail: zod_1.z.string().max(50).optional(),
    payment_app: zod_1.z.enum(['GPay', 'PhonePe', 'Paytm', 'AmazonPay', 'RazorPay', 'Other']).optional(),
    purpose: zod_1.z.string().min(1, { message: 'Purpose is required' }),
    is_completed: zod_1.z.boolean().default(false),
    current_amount: zod_1.z.number({ required_error: 'Amount is required' }).positive('Amount must be positive').default(0),
    expected_at: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'expected_at must be a valid date string',
    }),
    transaction_date: zod_1.z
        .string({ required_error: 'Transaction date is required' })
        .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid transaction date format',
    }),
    amount: zod_1.z.number({ required_error: 'Amount is required' }).positive('Amount must be positive').default(0),
}).refine((data) => {
    if (['Bank Account', 'Credit Card'].includes(data.source)) {
        return data.source_detail && data.source_detail.trim().length > 0;
    }
    return true;
}, {
    message: 'source_detail is required for Bank Account or Credit Card',
    path: ['source_detail'],
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionSchema = void 0;
const zod_1 = require("zod");
exports.transactionSchema = zod_1.z
    .object({
    amount: zod_1.z.number({ required_error: 'Amount is required' }).positive('Amount must be positive'),
    source: zod_1.z.enum(['Cash', 'Bank Account', 'Other'], {
        required_error: 'Source is required',
    }),
    source_detail: zod_1.z.string().max(100, 'Source detail too long').optional(),
    payment_app: zod_1.z.enum(['PhonePe', 'GPay', 'AmazonPay', 'Paytm', 'RazorPay', 'Other']).optional(),
    description: zod_1.z.string().min(1, 'Description is required'),
    category_id: zod_1.z.string({ required_error: 'Category ID is required' }),
    category_type: zod_1.z.enum(['income', 'expense'], {
        required_error: 'Category type is required',
    }),
    category_name: zod_1.z.string({ required_error: 'Category name is required' }),
    status: zod_1.z.enum(['Pending', 'Success', 'Failed']).default('Pending'),
    transaction_date: zod_1.z
        .string({ required_error: 'Transaction date is required' })
        .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid transaction date format',
    }),
})
    .refine((data) => {
    if (data.source === "Bank Account") {
        return !!data.source_detail?.trim();
    }
    return true;
}, {
    message: 'source_detail is required when source is Bank Account',
    path: ['source_detail'],
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categorySchema = void 0;
const zod_1 = require("zod");
exports.categorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: 'Category name is required' }),
    type: zod_1.z.enum(['income', 'expense'], { message: 'Type must be income or expense' }),
});

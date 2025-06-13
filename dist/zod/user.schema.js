"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountNameSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, { message: "Name is required" }),
    email: zod_1.z
        .string()
        .email({ message: "Please enter a valid email address" }),
    phone: zod_1.z
        .string()
        .min(10, { message: "Phone number must be at least 10 digits" })
        .max(15, { message: "Phone number must not exceed 15 digits" }),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" }),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email({ message: "Please enter a valid email address" }),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" }),
});
exports.accountNameSchema = zod_1.z.object({
    name: zod_1.z
        .string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
    })
        .min(1, 'Name must not be empty')
        .max(50, 'Name must be less than 50 characters'),
});

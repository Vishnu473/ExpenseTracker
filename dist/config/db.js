"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = async (uri) => {
    try {
        await mongoose_1.default.connect(uri);
        console.log("✅ Mongo Database connected successfully");
    }
    catch (error) {
        console.log("❌Error connecting mongo database", error);
    }
};
exports.connectDB = connectDB;

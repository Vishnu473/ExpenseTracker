"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wallet_controller_1 = require("../controllers/wallet.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/me', auth_middleware_1.protect, wallet_controller_1.getWalletByUserId);
router.post('/create', auth_middleware_1.protect, wallet_controller_1.createWallet);
router.get('/source-analytics', auth_middleware_1.protect, wallet_controller_1.getSourceAnalytics);
exports.default = router;

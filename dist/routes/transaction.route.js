"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transaction_controller_1 = require("../controllers/transaction.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const requestValidate_1 = require("../middleware/requestValidate");
const transaction_schema_1 = require("../zod/transaction.schema");
const router = express_1.default.Router();
router.get('/getAll', auth_middleware_1.protect, transaction_controller_1.getTransactions);
router.post('/create', auth_middleware_1.protect, (0, requestValidate_1.validate)(transaction_schema_1.transactionSchema), transaction_controller_1.createTransaction);
router.put('/:id', auth_middleware_1.protect, (0, requestValidate_1.validate)(transaction_schema_1.transactionSchema), transaction_controller_1.updateTransaction);
// router.delete('/:id', protect, deleteTransaction);
exports.default = router;

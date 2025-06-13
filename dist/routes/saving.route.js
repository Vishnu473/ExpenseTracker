"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const saving_controller_1 = require("../controllers/saving.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const requestValidate_1 = require("../middleware/requestValidate");
const saving_schema_1 = require("../zod/saving.schema");
const router = express_1.default.Router();
router.get('/getAll', auth_middleware_1.protect, saving_controller_1.getSavings);
router.post('/create', auth_middleware_1.protect, (0, requestValidate_1.validate)(saving_schema_1.savingSchema), saving_controller_1.createSaving);
router.put('/:id', auth_middleware_1.protect, (0, requestValidate_1.validate)(saving_schema_1.savingSchema), saving_controller_1.updateSaving);
router.delete('/:id', auth_middleware_1.protect, saving_controller_1.deleteSaving);
exports.default = router;

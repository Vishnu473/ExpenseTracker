"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const requestValidate_1 = require("../middleware/requestValidate");
const category_schema_1 = require("../zod/category.schema");
const router = express_1.default.Router();
router.get('/getAll', auth_middleware_1.protect, category_controller_1.getCategories);
router.post('/create', auth_middleware_1.protect, (0, requestValidate_1.validate)(category_schema_1.categorySchema), category_controller_1.createCategory);
router.put('/:id', auth_middleware_1.protect, (0, requestValidate_1.validate)(category_schema_1.categorySchema), category_controller_1.updateCategory);
router.delete('/:id', auth_middleware_1.protect, category_controller_1.deleteCategory);
exports.default = router;

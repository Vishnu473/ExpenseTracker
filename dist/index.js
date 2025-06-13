"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const db_1 = require("./config/db");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const category_route_1 = __importDefault(require("./routes/category.route"));
const transaction_route_1 = __importDefault(require("./routes/transaction.route"));
const saving_route_1 = __importDefault(require("./routes/saving.route"));
const wallet_route_1 = __importDefault(require("./routes/wallet.route"));
dotenv_1.default.config();
const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
};
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(corsOptions));
app.use('/api/v1/user', user_route_1.default);
app.use('/api/v1/category', category_route_1.default);
app.use('/api/v1/transaction', transaction_route_1.default);
app.use('/api/v1/saving', saving_route_1.default);
app.use('/api/v1/wallet', wallet_route_1.default);
app.get('/api/v1/check', async (req, res) => {
    res.json("✅ Server is running and is healthy");
});
app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    (0, db_1.connectDB)(process.env.MONGO_URI);
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWallet = void 0;
const transaction_model_1 = require("../models/transaction.model");
const saving_model_1 = require("../models/saving.model");
const wallet_model_1 = require("../models/wallet.model");
const updateWallet = async (userId) => {
    try {
        // Step 1: Fetch all successful transactions
        const transactions = await transaction_model_1.TransactionModel.find({ user: userId, status: "Success" });
        let income = 0;
        let expense = 0;
        for (const tx of transactions) {
            if (tx.category_type === "income")
                income += tx.amount;
            else if (tx.category_type === "expense")
                expense += tx.amount;
        }
        // Step 2: Fetch all savings
        const savings = await saving_model_1.SavingModel.find({ user: userId });
        // Total savings made from Cash or Bank Account (counted as income spent)
        const validSavingAmount = savings
            .reduce((acc, item) => acc + item.current_amount, 0);
        // Step 3: Wallet Balance = Income - Expenses - Valid Savings
        const balance = income - expense - validSavingAmount;
        // Step 4: Create or update Wallet
        const wallet = await wallet_model_1.WalletModel.findOne({ user_id: userId });
        if (wallet) {
            wallet.income = income;
            wallet.expense = expense;
            wallet.savings = validSavingAmount;
            wallet.balance = balance;
            wallet.updatedAt = new Date();
            await wallet.save();
        }
        else {
            await wallet_model_1.WalletModel.create({
                user_id: userId,
                income,
                expense,
                savings: validSavingAmount,
                balance,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
        console.log(`💰 Wallet Updated: Income=${income}, Expense=${expense}, Savings=${validSavingAmount}, Balance=${balance}`);
    }
    catch (err) {
        console.error("❌ Error in updateWallet():", err);
    }
};
exports.updateWallet = updateWallet;

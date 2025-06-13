"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategories = exports.createCategory = void 0;
const category_model_1 = require("../models/category.model");
const createCategory = async (req, res) => {
    try {
        const { name, type } = req.body;
        if (!req.user || !req.user._id) {
            res.status(401).json({ message: 'Unauthorized: user not found' });
            return;
        }
        const newCategory = {
            name,
            type,
            user: req?.user?._id,
            isUserDefined: true,
        };
        const category = await category_model_1.CategoryModel.create(newCategory);
        res.status(201).json(category);
        return;
    }
    catch (error) {
        console.error('Error creating categories ', error);
        res.status(500).json({ message: 'Failed to create a category' });
        return;
    }
};
exports.createCategory = createCategory;
const getCategories = async (req, res) => {
    try {
        const predefined = await category_model_1.CategoryModel.find({ isUserDefined: false });
        const userDefined = await category_model_1.CategoryModel.find({ user: req?.user?._id, isUserDefined: true });
        res.status(200).json([...userDefined, ...predefined,]);
    }
    catch (error) {
        console.error('Error retrieving category items ', error);
        res.status(500).json({ message: 'Failed to retrieve categories ' });
        return;
    }
};
exports.getCategories = getCategories;
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await category_model_1.CategoryModel.findOneAndUpdate({ _id: id, user: req?.user?._id, isUserDefined: true }, req.body, { new: true });
        if (!category) {
            res.status(404).json({ message: 'Category is invalid or not editable' });
            return;
        }
        res.status(200).json(category);
        return;
    }
    catch (error) {
        console.error('Error updating a category ', error);
        res.status(500).json({ message: 'Failed to update a category ' });
        return;
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await category_model_1.CategoryModel.findOneAndDelete({
            _id: id,
            user: req?.user?._id,
            isUserDefined: true,
        });
        if (!category) {
            res.status(404).json({ message: 'Category is invalid or not deletable' });
            return;
        }
        res.status(200).json({ message: `Category-${category.name} deleted` });
        return;
    }
    catch (error) {
        console.error('Error deleting category ', error);
        res.status(500).json({ message: 'Failed to delete a category ' });
        return;
    }
};
exports.deleteCategory = deleteCategory;

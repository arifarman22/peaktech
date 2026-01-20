import { Request, Response } from 'express';
import Category from '../models/Category';
import { successResponse, errorResponse } from '../utils/api-response';
import { categorySchema } from '../utils/validations';

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find().populate('parent', 'name slug').lean();
        return res.json(successResponse(categories));
    } catch (error) {
        console.error('Get categories error:', error);
        return res.status(500).json(errorResponse('Failed to fetch categories'));
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const validated = categorySchema.safeParse(req.body);
        if (!validated.success) {
            return res.status(400).json(errorResponse(validated.error.issues[0].message));
        }

        const category = await Category.create(validated.data);
        return res.status(201).json(successResponse(category, 'Category created successfully'));
    } catch (error: any) {
        console.error('Create category error:', error);
        if (error.code === 11000) {
            return res.status(400).json(errorResponse('Category with this slug already exists'));
        }
        return res.status(500).json(errorResponse('Failed to create category'));
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const validated = categorySchema.partial().safeParse(req.body);
        if (!validated.success) {
            return res.status(400).json(errorResponse(validated.error.issues[0].message));
        }

        const category = await Category.findByIdAndUpdate(id, validated.data, { new: true });
        if (!category) return res.status(404).json(errorResponse('Category not found'));

        return res.json(successResponse(category, 'Category updated successfully'));
    } catch (error) {
        console.error('Update category error:', error);
        return res.status(500).json(errorResponse('Failed to update category'));
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);
        if (!category) return res.status(404).json(errorResponse('Category not found'));

        return res.json(successResponse(null, 'Category deleted successfully'));
    } catch (error) {
        console.error('Delete category error:', error);
        return res.status(500).json(errorResponse('Failed to delete category'));
    }
};

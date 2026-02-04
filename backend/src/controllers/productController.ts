import { Request, Response } from 'express';
import Product from '../models/Product';
import { successResponse, errorResponse } from '../utils/api-response';
import { productSchema } from '../utils/validations';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            category,
            minPrice,
            maxPrice,
            featured,
            topSeller,
            trending,
            sort = '-createdAt'
        } = req.query;

        const query: any = { status: 'active' };

        // Search filter
        if (search) {
            query.$text = { $search: search as string };
        }

        // Category filter
        if (category) {
            query.category = category;
        }

        // Price filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Featured filter
        if (featured === 'true') {
            query.featured = true;
        }

        // Top Seller filter
        if (topSeller === 'true') {
            query.topSeller = true;
        }

        // Trending filter
        if (trending === 'true') {
            query.trending = true;
        }

        const skip = (Number(page) - 1) * Number(limit);

        console.log('Product query:', JSON.stringify(query));

        const products = await Product.find(query)
            .populate('category', 'name slug')
            .sort(sort as string)
            .skip(skip)
            .limit(Number(limit))
            .lean();

        console.log('Found products:', products.length);

        const total = await Product.countDocuments(query);

        return res.json(successResponse({
            products,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit)),
            }
        }));
    } catch (error) {
        console.error('Get products error:', error);
        return res.status(500).json(errorResponse('Failed to fetch products', error instanceof Error ? error.message : undefined));
    }
};

export const getProductBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const product = await Product.findOne({ slug, status: 'active' })
            .populate('category', 'name slug')
            .lean();

        if (!product) {
            return res.status(404).json(errorResponse('Product not found'));
        }

        return res.json(successResponse(product));
    } catch (error) {
        console.error('Get product by slug error:', error);
        return res.status(500).json(errorResponse('Failed to fetch product'));
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('category', 'name slug').lean();

        if (!product) {
            return res.status(404).json(errorResponse('Product not found'));
        }

        return res.json(successResponse(product));
    } catch (error) {
        console.error('Get product by id error:', error);
        return res.status(500).json(errorResponse('Failed to fetch product'));
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const validated = productSchema.safeParse(req.body);
        if (!validated.success) {
            return res.status(400).json(errorResponse(validated.error.issues[0].message));
        }

        const product = await Product.create(validated.data);

        return res.status(201).json(successResponse(product, 'Product created successfully'));
    } catch (error: any) {
        console.error('Create product error:', error);
        if (error.code === 11000) {
            return res.status(400).json(errorResponse('Product with this slug already exists'));
        }
        return res.status(500).json(errorResponse('Failed to create product'));
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const validated = productSchema.partial().safeParse(req.body);
        if (!validated.success) {
            return res.status(400).json(errorResponse(validated.error.issues[0].message));
        }

        const product = await Product.findByIdAndUpdate(id, validated.data, { new: true });
        if (!product) return res.status(404).json(errorResponse('Product not found'));

        return res.json(successResponse(product, 'Product updated successfully'));
    } catch (error) {
        console.error('Update product error:', error);
        return res.status(500).json(errorResponse('Failed to update product'));
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) return res.status(404).json(errorResponse('Product not found'));

        return res.json(successResponse(null, 'Product deleted successfully'));
    } catch (error) {
        console.error('Delete product error:', error);
        return res.status(500).json(errorResponse('Failed to delete product'));
    }
};

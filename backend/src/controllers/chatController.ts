import { Request, Response } from 'express';
import Groq from 'groq-sdk';
import Product from '../models/Product';
import Category from '../models/Category';
import { successResponse, errorResponse } from '../utils/api-response';

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

const SYSTEM_PROMPT = `You are a friendly and knowledgeable shopkeeper assistant for PeakTech, an e-commerce store specializing in electronics, machinery, and industrial parts.

Your role:
- Help customers find products
- Answer questions about products, pricing, and availability
- Provide recommendations based on customer needs
- Explain product features and specifications
- Assist with order-related queries
- Be friendly, professional, and helpful

Guidelines:
- Keep responses concise and helpful
- Use emojis occasionally to be friendly
- If you don't have specific information, be honest
- Encourage customers to browse the shop
- Mention product prices in BDT (৳)
- Always be polite and customer-focused`;

export const chatWithAI = async (req: Request, res: Response) => {
    try {
        console.log('Chat request received');
        console.log('Groq initialized:', !!groq);
        console.log('API Key exists:', !!process.env.GROQ_API_KEY);

        if (!groq) {
            console.error('Groq not initialized - API key missing');
            return res.status(503).json(errorResponse('AI service is currently unavailable'));
        }

        const { message, conversationHistory = [] } = req.body;

        if (!message) {
            return res.status(400).json(errorResponse('Message is required'));
        }

        console.log('User message:', message);

        // Get product context for better responses
        const products = await Product.find().limit(20).populate('category');
        const categories = await Category.find();

        const contextInfo = `
Available Categories: ${categories.map(c => c.name).join(', ')}
Sample Products: ${products.slice(0, 10).map(p => `${p.name} (৳${p.price})`).join(', ')}
`;

        const messages: any[] = [
            { role: 'system', content: SYSTEM_PROMPT + '\n\n' + contextInfo },
            ...conversationHistory.slice(-6),
            { role: 'user', content: message }
        ];

        console.log('Calling Groq API...');
        const completion = await groq.chat.completions.create({
            messages,
            model: 'llama-3.1-8b-instant',
            temperature: 0.7,
            max_tokens: 500,
        });

        const aiResponse = completion.choices[0]?.message?.content || 'Sorry, I could not process that.';
        console.log('AI Response received:', aiResponse.substring(0, 50));

        return res.json(successResponse({
            response: aiResponse,
            conversationHistory: [
                ...conversationHistory.slice(-6),
                { role: 'user', content: message },
                { role: 'assistant', content: aiResponse }
            ]
        }));
    } catch (error: any) {
        console.error('AI Chat error details:', {
            message: error.message,
            status: error.status,
            code: error.code,
            type: error.type
        });
        return res.status(500).json(errorResponse(error.message || 'Failed to process chat'));
    }
};

export const searchProducts = async (req: Request, res: Response) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json(errorResponse('Query is required'));
        }

        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        }).limit(10).populate('category');

        return res.json(successResponse({ products }));
    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json(errorResponse('Search failed'));
    }
};

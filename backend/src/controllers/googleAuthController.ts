import { Request, Response } from 'express';
import User from '../models/User';
import { generateAccessToken, generateRefreshToken } from '../utils/auth';
import { successResponse, errorResponse } from '../utils/api-response';

export const googleAuth = async (req: Request, res: Response) => {
    try {
        const { name, email, image, googleId } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                image,
                provider: 'google',
                emailVerified: true, // Google emails are pre-verified
            });
        } else if (user.provider !== 'google') {
            // Link existing account or return error? Typically link
            user.provider = 'google';
            if (image && !user.image) user.image = image;
            await user.save();
        }

        const tokenPayload = { userId: user._id.toString(), email: user.email, role: user.role };
        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        return res.json(successResponse({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image
            },
            accessToken,
            refreshToken
        }, 'Google login successful'));
    } catch (error) {
        console.error('Google Auth error:', error);
        return res.status(500).json(errorResponse('Google authentication failed'));
    }
};

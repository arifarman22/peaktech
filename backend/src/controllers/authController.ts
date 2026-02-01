import { Request, Response } from 'express';
import User from '../models/User';
import {
    hashPassword,
    generateOTP,
    generateOTPExpiry,
    generateAccessToken,
    generateRefreshToken,
    comparePassword
} from '../utils/auth';
import { sendOTPEmail, sendWelcomeEmail } from '../utils/email';
import { successResponse, errorResponse } from '../utils/api-response';
import { registerSchema, loginSchema, verifyOTPSchema } from '../utils/validations';

export const register = async (req: Request, res: Response) => {
    try {
        const validated = registerSchema.safeParse(req.body);
        if (!validated.success) {
            return res.status(400).json(errorResponse(validated.error.issues[0].message));
        }

        const { name, email, password } = validated.data;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json(errorResponse('User already exists'));
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            emailVerified: true,
        });

        const tokenPayload = { userId: user._id.toString(), email: user.email, role: user.role };
        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        return res.status(201).json(successResponse({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken
        }, 'User registered successfully'));
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json(errorResponse('Internal server error'));
    }
};

export const verifyOTP = async (req: Request, res: Response) => {
    try {
        const validated = verifyOTPSchema.safeParse(req.body);
        if (!validated.success) {
            return res.status(400).json(errorResponse(validated.error.issues[0].message));
        }

        const { email, otp } = validated.data;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json(errorResponse('User not found'));

        if (user.otp !== otp || (user.otpExpiry && user.otpExpiry < new Date())) {
            return res.status(400).json(errorResponse('Invalid or expired OTP'));
        }

        user.emailVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        await sendWelcomeEmail(email, user.name || 'User');

        const tokenPayload = { userId: user._id.toString(), email: user.email, role: user.role };
        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        return res.json(successResponse({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken
        }, 'Email verified successfully'));
    } catch (error) {
        console.error('Verify OTP error:', error);
        return res.status(500).json(errorResponse('Internal server error'));
    }
};

export const updateProfile = async (req: any, res: Response) => {
    try {
        const { name } = req.body;
        const user = await User.findByIdAndUpdate(req.user._id, { name }, { new: true }).select('-password');
        if (!user) return res.status(404).json(errorResponse('User not found'));
        return res.json(successResponse({ user }, 'Profile updated successfully'));
    } catch (error) {
        return res.status(500).json(errorResponse('Failed to update profile'));
    }
};

export const getMe = async (req: any, res: Response) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json(errorResponse('User not found'));
        return res.json(successResponse({ user }));
    } catch (error) {
        return res.status(500).json(errorResponse('Failed to fetch user'));
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const validated = loginSchema.safeParse(req.body);
        if (!validated.success) {
            return res.status(400).json(errorResponse(validated.error.issues[0].message));
        }

        const { email, password } = validated.data;

        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(401).json(errorResponse('Invalid credentials'));

        if (!user.password) return res.status(401).json(errorResponse('Invalid credentials'));

        const isMatch = await comparePassword(password, user.password as string);
        if (!isMatch) return res.status(401).json(errorResponse('Invalid credentials'));

        const tokenPayload = { userId: user._id.toString(), email: user.email, role: user.role };
        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        return res.json(successResponse({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken
        }, 'Login successful'));
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json(errorResponse('Internal server error'));
    }
};

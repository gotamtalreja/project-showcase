import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
            return;
        }

        // Verify token
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            res.status(500).json({
                success: false,
                message: 'Server configuration error.'
            });
            return;
        }
        const decoded = jwt.verify(token, jwtSecret) as { id: string; role: string };

        // Attach user to request
        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token.'
        });
    }
};

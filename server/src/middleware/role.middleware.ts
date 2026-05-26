import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export const roleMiddleware = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized. Please log in.'
            });
            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: 'Forbidden. You do not have permission to access this resource.'
            });
            return;
        }

        next();
    };
};

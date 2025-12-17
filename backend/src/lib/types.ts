import { JwtPayload } from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { Request } from 'express';

export interface TokenPayload extends JwtPayload {
    id: number;
    name: string;
    email: string;
    role: Role,
}

export interface AuthenticatedRequest extends Request {
    user?: TokenPayload;
    session?: {
        id: number;
        token: string;
    };
}
import { Request } from 'express';
import { JwtPayload } from 'src/shared/types/jwt-payload.interface';

export interface AuthenticatedRequest extends Request {
	user: JwtPayload;
}

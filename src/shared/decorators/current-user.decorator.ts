import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from 'src/auth/auth-request.interface';

export const CurrentUser = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

		return request.user;
	},
);

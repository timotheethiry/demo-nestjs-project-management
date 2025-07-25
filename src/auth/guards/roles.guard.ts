import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PermissionsService } from 'src/permissions/permissions.service';
import { ROLES_KEY } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private permissionsService: PermissionsService,
	) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (!requiredRoles) return true;

		const { user } = context.switchToHttp().getRequest();

		// Uncomment during Roadpmap Step 5 (Permissions)
		return this.permissionsService.hasSomeRole(user, requiredRoles);
		return true;
	}
}

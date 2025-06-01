import { Module } from '@nestjs/common';
import { Role } from './role.enum';

const RoleProvider = { provide: 'Role', useValue: Role };

@Module({
	exports: [RoleProvider],
	providers: [RoleProvider],
})
export class SharedModule {}

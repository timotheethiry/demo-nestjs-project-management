import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from 'src/department/entities/department.entity';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PermissionsModule } from 'src/permissions/permissions.module';

@Module({
	imports: [TypeOrmModule.forFeature([User, Department]), PermissionsModule],
	exports: [UserService],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {}

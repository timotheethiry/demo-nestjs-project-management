import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { UserModule } from 'src/user/user.module';
import { DepartmentModule } from 'src/department/department.module';
import { PermissionsModule } from 'src/permissions/permissions.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Project]),
		UserModule,
		DepartmentModule,
		PermissionsModule,
	],
	controllers: [ProjectController],
	providers: [ProjectService],
})
export class ProjectModule {}

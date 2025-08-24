import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { UserModule } from 'src/user/user.module';
import { DepartmentModule } from 'src/department/department.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { PhaseService } from './phase.service';
import { PhaseController } from './phase.controller';
import { Phase } from './entities/phase.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Project, Phase]),
		UserModule,
		DepartmentModule,
		PermissionsModule,
	],
	controllers: [ProjectController, PhaseController],
	providers: [ProjectService, PhaseService],
})
export class ProjectModule {}

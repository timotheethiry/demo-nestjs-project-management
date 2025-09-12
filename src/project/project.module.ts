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
import { Task } from './entities/task.entity';
import { Step } from './entities/step.entity';
import { StepService } from './step.service';
import { StepController } from './step.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([Project, Phase, Step, Task]),
		UserModule,
		DepartmentModule,
		PermissionsModule,
	],
	controllers: [ProjectController, PhaseController, StepController],
	providers: [ProjectService, PhaseService, StepService],
})
export class ProjectModule {}

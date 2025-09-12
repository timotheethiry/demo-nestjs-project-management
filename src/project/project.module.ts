import { Module } from '@nestjs/common';
import { ProjectService } from './project/project.service';
import { ProjectController } from './project/project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project/project.entity';
import { UserModule } from 'src/user/user.module';
import { DepartmentModule } from 'src/department/department.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { PhaseService } from './phase/phase.service';
import { PhaseController } from './phase/phase.controller';
import { Phase } from './phase/phase.entity';
import { Task } from './entities/task.entity';
import { Step } from './step/step.entity';
import { StepService } from './step/step.service';
import { StepController } from './step/step.controller';

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

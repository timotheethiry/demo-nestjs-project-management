import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { UserModule } from 'src/user/user.module';
import { DepartmentModule } from 'src/department/department.module';

@Module({
	imports: [TypeOrmModule.forFeature([Project]), UserModule, DepartmentModule],
	controllers: [ProjectController],
	providers: [ProjectService],
})
export class ProjectModule {}

import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Put,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { JwtPayload } from 'src/shared/types/jwt-payload.interface';
import { UpdateProjectContentDto } from './dto/update-content.dto';
import { UpdateProjectDatesDto } from './dto/update-dates.dto';
import { UpdateProjectStatusDto } from './dto/update-status.dto';
import { UpdateProjectDepartmentDto } from './dto/update-department.dto';
import { UpdateProjectOverseerDto } from './dto/update-overseer.dto';
import { UpdateProjectMembersDto } from './dto/update-members.dto';

@Controller('projects')
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	@Post()
	create(
		@Body() createProjectDto: CreateProjectDto,
		@CurrentUser() currentUser: JwtPayload,
	) {
		return this.projectService.create(createProjectDto, currentUser);
	}

	@Get()
	findAll() {
		return this.projectService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.projectService.findOne(id);
	}

	@Put(':id/content')
	updateContent(
		@Param('id') id: string,
		@Body() dto: UpdateProjectContentDto,
		@CurrentUser() currentUser: JwtPayload,
	) {
		return this.projectService.updateContent(id, dto, currentUser);
	}

	@Put(':id/dates')
	updateDates(@Param('id') id: string, @Body() dto: UpdateProjectDatesDto) {
		return this.projectService.updateDates(id, dto);
	}

	@Put(':id/status')
	updateStatus(
		@Param('id') id: string,
		@Body() dto: UpdateProjectStatusDto,
		@CurrentUser() currentUser: JwtPayload,
	) {
		return this.projectService.updateStatus(id, dto, currentUser);
	}

	@Put(':id/department')
	assignDepartment(
		@Param('id') id: string,
		@Body() dto: UpdateProjectDepartmentDto,
	) {
		return this.projectService.assignDepartment(id, dto);
	}
	@Put(':id/overseer')
	assignOverseer(
		@Param('id') id: string,
		@Body() dto: UpdateProjectOverseerDto,
	) {
		return this.projectService.assignOverseer(id, dto);
	}
	@Put(':id/members')
	assignMembers(@Param('id') id: string, @Body() dto: UpdateProjectMembersDto) {
		return this.projectService.assignMembers(id, dto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.projectService.remove(id);
	}
}

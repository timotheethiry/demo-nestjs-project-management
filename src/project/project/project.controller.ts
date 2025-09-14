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
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/role.enum';

@Controller('projects')
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	@Post()
	@Roles(Role.Admin)
	create(
		@Body() createProjectDto: CreateProjectDto,
		@CurrentUser() currentUser: JwtPayload,
	) {
		return this.projectService.create(createProjectDto, currentUser);
	}

	@Get()
	findAll(@CurrentUser() currentUser: JwtPayload) {
		return this.projectService.findAll(currentUser);
	}

	@Get(':id')
	findOne(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
		return this.projectService.findOne(id, currentUser);
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
	updateDates(
		@Param('id') id: string,
		@Body() dto: UpdateProjectDatesDto,
		@CurrentUser() currentUser: JwtPayload,
	) {
		return this.projectService.updateDates(id, dto, currentUser);
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
	@Roles(Role.Admin)
	assignDepartment(
		@Param('id') id: string,
		@Body() dto: UpdateProjectDepartmentDto,
		@CurrentUser() currentUser: JwtPayload,
	) {
		return this.projectService.assignDepartment(id, dto, currentUser);
	}

	@Put(':id/overseer')
	@Roles(Role.Admin)
	assignOverseer(
		@Param('id') id: string,
		@Body() dto: UpdateProjectOverseerDto,
		@CurrentUser() currentUser: JwtPayload,
	) {
		return this.projectService.assignOverseer(id, dto, currentUser);
	}

	@Put(':id/members')
	assignMembers(
		@Param('id') id: string,
		@Body() dto: UpdateProjectMembersDto,
		@CurrentUser() currentUser: JwtPayload,
	) {
		return this.projectService.assignMembers(id, dto, currentUser);
	}

	@Delete(':id')
	@Roles(Role.Admin)
	remove(@Param('id') id: string) {
		return this.projectService.remove(id);
	}
}

import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentService } from 'src/department/department.service';
import { Department } from 'src/department/entities/department.entity';
import { PermissionsService } from 'src/permissions/permissions.service';
import { JwtPayload } from 'src/shared/types/jwt-payload.interface';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { DataSource, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectContentDto } from './dto/update-content.dto';
import { UpdateProjectDatesDto } from './dto/update-dates.dto';
import { UpdateProjectDepartmentDto } from './dto/update-department.dto';
import { UpdateProjectMembersDto } from './dto/update-members.dto';
import { UpdateProjectOverseerDto } from './dto/update-overseer.dto';
import { UpdateProjectStatusDto } from './dto/update-status.dto';
import { Project } from './entities/project.entity';
import { ProjectStatus } from './types/project-status.enum';
import { Phase } from './entities/phase.entity';
import { PhaseStatus } from './types/phase-status.enum';

@Injectable()
export class ProjectService {
	constructor(
		@InjectRepository(Project) private projectRepo: Repository<Project>,
		private userService: UserService,
		private departmentService: DepartmentService,
		private permissionsService: PermissionsService,
		private dataSource: DataSource,
	) {}

	async create(createProjectDto: CreateProjectDto, currentUser: JwtPayload) {
		const cleanedDto = {
			...createProjectDto,
			context: createProjectDto.context?.trim() || null,
			objectives: createProjectDto.objectives?.trim() || null,
			expectedResults: createProjectDto.expectedResults?.trim() || null,
			startDate: createProjectDto?.startDate || null,
			endDate: createProjectDto?.endDate || null,
		};
		const newProject: Project = new Project();
		const projectCreator = await this.userService.findOne(currentUser.sub);

		newProject.name = cleanedDto.name;
		newProject.description = cleanedDto.description;
		newProject.context = cleanedDto.context;
		newProject.objectives = cleanedDto.objectives;
		newProject.expectedResults = cleanedDto.expectedResults;
		newProject.startDate = cleanedDto.startDate;
		newProject.endDate = cleanedDto.endDate;
		newProject.status = ProjectStatus.NOT_STARTED;
		newProject.createdBy = projectCreator;

		if (cleanedDto.departmentId)
			newProject.department = { id: cleanedDto.departmentId } as Department;

		if (cleanedDto.overseerId)
			newProject.overseer = { id: cleanedDto.overseerId } as User;

		if (cleanedDto.memberIds?.length)
			newProject.members = cleanedDto.memberIds.map((id) => ({ id }) as User);

		if (
			cleanedDto.startDate &&
			cleanedDto.endDate &&
			new Date(cleanedDto.startDate).getTime() >
				new Date(cleanedDto.endDate).getTime()
		) {
			throw new BadRequestException("Start date can't be later than end date");
		}

		return this.projectRepo.save(newProject);
	}

	findAll(): Promise<Project[]> {
		return this.projectRepo.find();
	}

	async findOne(id: string): Promise<Project> {
		const project = await this.projectRepo.findOne({
			where: { id },
			relations: ['department', 'overseer', 'members', 'phases', 'createdBy'],
		});
		if (!project) throw new NotFoundException(`Project #${id} not found`);
		return project;
	}

	async updateContent(
		id: string,
		{
			name,
			description,
			objectives,
			context,
			expectedResults,
		}: UpdateProjectContentDto,
		currentUser: JwtPayload,
	): Promise<Project> {
		const project = await this.findOne(id);

		if (!project) {
			throw new NotFoundException(`Project with ID ${id} not found.`);
		}

		if (
			!this.permissionsService.isAdmin(currentUser) &&
			!this.permissionsService.isProjectOverseer(currentUser, project)
		) {
			throw new UnauthorizedException('Not allowed to update this project');
		}

		const current = {
			name: project.name,
			description: project.description,
			objectives: project.objectives,
			context: project.context,
			expectedResults: project.expectedResults,
		};

		const status = project.status;

		switch (status) {
			case ProjectStatus.NOT_STARTED.toString():
				if (!description?.trim()) {
					throw new BadRequestException(`Description is required.`);
				}

				if (!name?.trim()) {
					throw new BadRequestException(`Name is required.`);
				}
				break;

			case ProjectStatus.IN_PROGRESS.toString():
				if (!description?.trim()) {
					throw new BadRequestException(`Description is required.`);
				}
				if (!context?.trim()) {
					throw new BadRequestException(`Context is required.`);
				}
				if (name && name !== current.name) {
					throw new ForbiddenException(
						`Project name cannot be changed once started.`,
					);
				}
				if (objectives || expectedResults) {
					throw new ForbiddenException(
						`Objectives and expected results cannot be modified once project is started.`,
					);
				}
				break;

			case ProjectStatus.ON_HOLD.toString():
				if (!description?.trim()) {
					throw new BadRequestException(`Description is required.`);
				}
				if (!context?.trim()) {
					throw new BadRequestException(`Context is required.`);
				}
				if (!objectives?.trim()) {
					throw new BadRequestException(`Objectives are required.`);
				}
				if (!expectedResults?.trim()) {
					throw new BadRequestException(`Expected results are required.`);
				}
				if (name && name !== current.name) {
					throw new ForbiddenException(
						`Project name cannot be changed while on hold.`,
					);
				}
				break;

			case ProjectStatus.CANCELED.toString():
			case ProjectStatus.CLOSED.toString():
			case ProjectStatus.PROPOSED_CLOSED.toString():
				throw new ForbiddenException(
					`Cannot update a project with status: ${status}`,
				);
		}

		if (name && name !== current.name) {
			if (!this.permissionsService.isAdmin(currentUser)) {
				throw new ForbiddenException(
					`Only admins can modify the project name.`,
				);
			}

			const existing = await this.projectRepo.findOne({ where: { name } });
			if (existing && existing.id !== id) {
				throw new ConflictException(
					`A project with the name "${name}" already exists.`,
				);
			}
			project.name = name;
		}

		if (description && description !== current.description) {
			project.description = description;
		}

		if (
			objectives &&
			objectives !== current.objectives &&
			[
				ProjectStatus.NOT_STARTED.toString(),
				ProjectStatus.ON_HOLD.toString(),
			].includes(status)
		) {
			project.objectives = objectives;
		}

		if (
			context &&
			context !== current.context &&
			[
				ProjectStatus.NOT_STARTED.toString(),
				ProjectStatus.IN_PROGRESS.toString(),
				ProjectStatus.ON_HOLD.toString(),
			].includes(status)
		) {
			project.context = context;
		}

		if (
			expectedResults &&
			expectedResults !== current.expectedResults &&
			[
				ProjectStatus.NOT_STARTED.toString(),
				ProjectStatus.ON_HOLD.toString(),
			].includes(status)
		) {
			project.expectedResults = expectedResults;
		}

		const updated = {
			name: project.name,
			description: project.description,
			objectives: project.objectives,
			context: project.context,
			expectedResults: project.expectedResults,
		};

		const hasChanges = Object.entries(current).some(
			([key, value]) => value !== updated[key as keyof typeof updated],
		);

		if (!hasChanges) {
			return project;
		}

		return this.projectRepo.save(project);
	}

	// TODO: search for logic to extract
	// maybe baseline is being project overseer or admin, and restrict to admin needed
	async updateStatus(
		id: string,
		updateProjectDto: UpdateProjectStatusDto,
		currentUser: JwtPayload,
	) {
		const project = await this.findOne(id);

		if (!updateProjectDto.status) return project;

		switch (updateProjectDto.status) {
			case ProjectStatus.IN_PROGRESS:
				if (project.status === ProjectStatus.IN_PROGRESS.toString())
					return project;

				if (project.status === ProjectStatus.CLOSED.toString())
					throw new ForbiddenException("Can't reopen a closed project");

				if (
					[
						ProjectStatus.CANCELED.toString(),
						ProjectStatus.ON_HOLD.toString(),
					].includes(project.status)
				) {
					if (!this.permissionsService.isAdmin(currentUser)) {
						throw new ForbiddenException(
							'Only an admin may reopen a canceled or held project',
						);
					}
					project.status = updateProjectDto.status;
				}

				if (!this.isEligibleForInProgress(project)) {
					throw new ForbiddenException(
						`A project must be entirely filled to be marked as in progress`,
					);
				}
				project.status = updateProjectDto.status;
				break;

			case ProjectStatus.PROPOSED_CLOSED:
				// Forbid overseer if closed or canceled but allow admin in any case
				if (
					!project.overseer &&
					!this.permissionsService.isProjectOverseer(currentUser, project)
				) {
					throw new ForbiddenException(
						"Only the project's overseer may propose to close a project",
					);
				}
				project.status = updateProjectDto.status;
				break;

			case ProjectStatus.ON_HOLD:
			case ProjectStatus.CANCELED:
			case ProjectStatus.CLOSED:
				if (!this.permissionsService.isAdmin(currentUser)) {
					throw new ForbiddenException(
						'Only an admin may close, cancel or hold a project',
					);
				}
				project.status = updateProjectDto.status;
				break;

			case ProjectStatus.NOT_STARTED:
				if (project.status !== ProjectStatus.NOT_STARTED.toString()) {
					throw new ForbiddenException('Project has already started');
				}
				return project;
		}

		return this.projectRepo.save(project);
	}

	// TODO: search for logic to extract
	async updateDates(
		projectId: string,
		{ startDate, endDate }: UpdateProjectDatesDto,
		currentUser: JwtPayload,
	): Promise<Project> {
		const project = await this.findOne(projectId);

		if (!project) {
			throw new NotFoundException(`Project with ID ${projectId} not found.`);
		}

		if (
			!this.permissionsService.isAdmin(currentUser) &&
			!this.permissionsService.isProjectOverseer(currentUser, project)
		) {
			throw new UnauthorizedException('Not allowed to update this project');
		}

		if (!startDate || !endDate) {
			throw new BadRequestException('Both startDate and endDate are required.');
		}

		const start = new Date(startDate);
		const end = new Date(endDate);
		const now = new Date();

		if (isNaN(start.getTime()) || isNaN(end.getTime())) {
			throw new BadRequestException('Invalid date format.');
		}

		if (start > end) {
			throw new BadRequestException('Start date cannot be after end date.');
		}

		const currentStart = project.startDate ? new Date(project.startDate) : null;
		const currentEnd = project.endDate ? new Date(project.endDate) : null;

		const isSameStart = currentStart
			? currentStart.getTime() === start.getTime()
			: false;
		const isSameEnd = currentEnd
			? currentEnd.getTime() === end.getTime()
			: false;

		if (isSameStart && isSameEnd) {
			return project;
		}

		switch (project.status) {
			case ProjectStatus.NOT_STARTED.toString():
				if (start < now || end < now) {
					throw new ForbiddenException(
						'Start and end dates must be in the future for a not-started project.',
					);
				}
				project.startDate = start;
				project.endDate = end;
				break;

			case ProjectStatus.IN_PROGRESS.toString():
			case ProjectStatus.ON_HOLD.toString():
				if (!isSameStart) {
					throw new ForbiddenException(
						'Start date cannot be modified once the project has started.',
					);
				}
				if (end < now) {
					throw new ForbiddenException(
						'End date must be today or in the future for in-progress or on-hold projects.',
					);
				}
				project.endDate = end;
				break;

			case ProjectStatus.CANCELED.toString():
			case ProjectStatus.CLOSED.toString():
			case ProjectStatus.PROPOSED_CLOSED.toString():
				throw new ForbiddenException(
					`Dates cannot be modified when project is ${project.status}.`,
				);

			default:
				throw new BadRequestException(
					`Unsupported project status: ${project.status as string}`,
				);
		}

		return this.projectRepo.save(project);
	}

	// TODO: search for logic to extract
	async assignDepartment(
		id: string,
		{ departmentId }: UpdateProjectDepartmentDto,
	): Promise<Project> {
		const project = await this.findOne(id);

		if (!project) {
			throw new NotFoundException(`Project with ID ${id} not found.`);
		}

		if (!departmentId) {
			throw new ForbiddenException(
				'A project cannot be decommissioned or demobilized after creation. Department ID is required.',
			);
		}

		const departmentExists = await this.departmentService.findOne(departmentId);

		if (!departmentExists) {
			throw new NotFoundException(
				`Department with ID ${departmentId} does not exist.`,
			);
		}

		const currentDepartmentId = project.department.id;

		if (currentDepartmentId) {
			if (currentDepartmentId === departmentId) {
				return project;
			}

			if (
				![
					ProjectStatus.ON_HOLD.toString(),
					ProjectStatus.NOT_STARTED.toString(),
				].includes(project.status)
			) {
				throw new ForbiddenException(
					`Project must be put on hold or not started before changing its department. Current status: ${project.status}`,
				);
			}

			project.department = { id: departmentId } as Department;
			return this.projectRepo.save(project);
		}

		project.department = { id: departmentId } as Department;
		return await this.projectRepo.save(project);
	}

	// TODO: search for logic to extract
	async assignOverseer(
		id: string,
		{ overseerId }: UpdateProjectOverseerDto,
	): Promise<Project> {
		const project = await this.findOne(id);

		if (!project) {
			throw new NotFoundException(`Project with ID ${id} not found.`);
		}

		if (!overseerId) {
			throw new ForbiddenException(
				'An overseer must be assigned. A project cannot exist without an overseer after creation.',
			);
		}

		const overseerExists = await this.userService.findOne(overseerId);

		if (!overseerExists) {
			throw new NotFoundException(
				`Overseer with ID ${overseerId} does not exist.`,
			);
		}

		const currentOverseerId = project.overseer?.id;

		if (currentOverseerId) {
			if (currentOverseerId === overseerId) {
				return project;
			}

			if (
				![
					ProjectStatus.NOT_STARTED.toString(),
					ProjectStatus.ON_HOLD.toString(),
				].includes(project.status)
			) {
				throw new ForbiddenException(
					`Project must be put on hold or not started before changing its overseer. Current status: ${project.status}`,
				);
			}

			project.overseer = { id: overseerId } as User;
			return this.projectRepo.save(project);
		}

		project.overseer = { id: overseerId } as User;
		return await this.projectRepo.save(project);
	}

	// TODO: search for logic to extract
	async assignMembers(
		id: string,
		{ memberIds }: UpdateProjectMembersDto,
		currentUser: JwtPayload,
	): Promise<Project> {
		const project = await this.findOne(id);

		if (!project) {
			throw new NotFoundException(`Project with ID ${id} not found.`);
		}

		if (
			!this.permissionsService.isAdmin(currentUser) &&
			!this.permissionsService.isProjectOverseer(currentUser, project)
		) {
			throw new UnauthorizedException('Not allowed to update this project');
		}

		if (!memberIds?.length) {
			throw new ForbiddenException(
				'At least one member must be assigned. A project cannot exist without any member after creation.',
			);
		}

		// Already validated by the DTOs
		const uniqueMemberIds = [...new Set(memberIds)];

		const existingMembers = await this.userService.findByIds(uniqueMemberIds);
		const foundIds = existingMembers.map((user) => user.id);

		const notFoundIds = uniqueMemberIds.filter((id) => !foundIds.includes(id));

		if (notFoundIds.length > 0) {
			throw new NotFoundException(
				`The following member IDs do not exist: ${notFoundIds.join(', ')}`,
			);
		}

		// is it not the same the previous if statement
		if (existingMembers.length === 0) {
			throw new ForbiddenException(`No valid members found for assignment.`);
		}

		if (
			![
				ProjectStatus.NOT_STARTED.toString(),
				ProjectStatus.IN_PROGRESS.toString(),
				ProjectStatus.ON_HOLD.toString(),
			].includes(project.status)
		) {
			throw new ForbiddenException(
				`Project must be not started, in progress or on hold to change its members. Current status: ${project.status}`,
			);
		}

		project.members = existingMembers;
		return await this.projectRepo.save(project);
	}

	async reorderPhases(
		projectId: string,
		phaseId: string,
		newPhaseOrder: number,
	): Promise<Phase[]> {
		return await this.dataSource.transaction(async (manager) => {
			// 1. Charger toutes les phases du projet, ordonnées par `order`
			const phases = await manager.getRepository(Phase).find({
				where: { project: { id: projectId } },
				order: { order: 'ASC' },
			});

			const totalLength = phases.length;

			if (phases.length === 0) {
				throw new NotFoundException(`No phases found for project ${projectId}`);
			}

			if (newPhaseOrder < 1 || newPhaseOrder > phases.length) {
				throw new BadRequestException(
					`Invalid target position: ${newPhaseOrder}, number of phases: ${phases.length}`,
				);
			}

			// 2. Retrouver la phase à déplacer
			const indexToMove = phases.findIndex((p) => p.id === phaseId);
			if (indexToMove === -1) {
				throw new NotFoundException(
					`Phase ${phaseId} not found in project ${projectId}`,
				);
			}

			const phaseToMove = phases[indexToMove];

			// 3. Retirer la phase de la liste
			phases.splice(indexToMove, 1);

			// 4. Insérer à la nouvelle position (1-indexé → ajuster pour tableau)
			const targetIndex = newPhaseOrder - 1;

			phases.splice(targetIndex, 0, phaseToMove);

			// 5. Validation métier : phases terminées doivent rester en tête groupées
			phases.splice(
				0,
				phases.length,
				...this.enforceCompletedPhasesAreGrouped(phases),
			);

			// 6. Réassigner les ordres
			for (let i = 0; i < totalLength; i++) {
				phases[i].order = i + 1;
			}

			// 7. Sauvegarde (transactionnelle)
			await manager.getRepository(Phase).save(phases);

			return phases;
		});
	}

	async remove(id: string): Promise<void> {
		const result = await this.projectRepo.delete(id);
		if (result.affected === 0)
			throw new NotFoundException(`Project #${id} not found`);
	}

	// ⚠️ Business rule: a project must have dates, 1 overseer, and 1+ member to be marked as IN_PROGRESS
	private isEligibleForInProgress({
		name,
		description,
		objectives,
		context,
		expectedResults,
		members,
		department,
		overseer,
		startDate,
		endDate,
	}: Project): boolean {
		return (
			!!name?.trim() &&
			!!description?.trim() &&
			!!objectives?.trim() &&
			!!context?.trim() &&
			!!expectedResults?.trim() &&
			!!members?.length &&
			!!department &&
			!!overseer &&
			!!startDate &&
			!!endDate
		);
	}

	// ⚠️ Business rule: project phases must be sorted with completed ones first
	private enforceCompletedPhasesAreGrouped(phases: Phase[]): Phase[] {
		const completed = phases.filter((p) => p.status === PhaseStatus.COMPLETED);
		const others = phases.filter((p) => p.status !== PhaseStatus.COMPLETED);

		return [...completed, ...others];
	}
}

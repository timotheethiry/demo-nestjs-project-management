import { PermissionsService } from 'src/permissions/permissions.service';
import { DataSource, Repository } from 'typeorm';
import { CreatePhaseDto } from './dto/create-phase.dto';
import { UpdatePhaseNameDto } from './dto/update-phase-name.dto';
import { UpdatePhaseStatusDto } from './dto/update-phase-status.dto';
import { Phase } from './entities/phase.entity';
import {
	Injectable,
	NotFoundException,
	BadRequestException,
	ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectStatus } from './types/project-status.enum';
import { PhaseStatus } from './types/phase-status.enum';
import { UpdatePhaseOrderDto } from './dto/update-phase-order.dto';
import { ProjectService } from './project.service';
import { JwtPayload } from 'src/shared/types/jwt-payload.interface';
import { Step } from './entities/step.entity';

@Injectable()
export class PhaseService {
	constructor(
		@InjectRepository(Phase) private phaseRepo: Repository<Phase>,
		// @InjectRepository(Project)
		// private readonly projectRepo: Repository<Project>,
		private permissionsService: PermissionsService,
		private projectService: ProjectService,
		// private stepService: StepService,
		private dataSource: DataSource,
	) {}

	async create(dto: CreatePhaseDto, currentUser: JwtPayload): Promise<Phase> {
		const project = await this.projectService.findOne(dto.projectId);

		if (!project) throw new NotFoundException('Project not found');

		if (!this.permissionsService.canCreatePhase(currentUser, project))
			throw new ForbiddenException(
				'Only admin or project overseer may create a phase',
			);

		if (
			[
				ProjectStatus.CANCELED.toString(),
				ProjectStatus.PROPOSED_CLOSED.toString(),
				ProjectStatus.CLOSED.toString(),
			].includes(project.status)
		) {
			throw new BadRequestException(
				`Cannot add phase to a project with this status: ${project.status}`,
			);
		}

		if (project.phases.find((phase) => phase.name === dto.name)) {
			throw new BadRequestException(
				'A phase with this name already exists in this project',
			);
		}

		const phase = this.phaseRepo.create({
			name: dto.name,
			project,
			status: PhaseStatus.NOT_STARTED,
			order: project.phases.length + 1,
		});

		return await this.phaseRepo.save(phase);
	}

	async findAllByProject(projectId: string): Promise<Phase[]> {
		const project = await this.projectService.findOne(projectId);

		if (!project) throw new NotFoundException('Project not found');

		return this.phaseRepo.find({
			where: { project: { id: projectId } },
			order: { order: 'ASC' },
			// relations: ['steps'],
		});
	}

	async findOne(id: string): Promise<Phase> {
		const phase = await this.phaseRepo.findOne({
			where: { id },
			relations: {
				project: {
					overseer: true,
					members: true,
				},
				steps: true,
			},
		});

		if (!phase) throw new NotFoundException('Phase not found');
		return phase;
	}

	async updateName(
		id: string,
		dto: UpdatePhaseNameDto,
		currentUser: JwtPayload,
	): Promise<Phase> {
		const phase = await this.phaseRepo.findOne({
			where: { id },
			relations: {
				project: {
					overseer: true,
				},
			},
		});

		if (!phase) throw new NotFoundException('Phase not found');

		const { project } = phase;

		if (!this.permissionsService.canEditPhase(currentUser, project))
			throw new ForbiddenException(
				'Only admin or project overseer may update a phase name',
			);

		if (phase.status === PhaseStatus.COMPLETED) {
			throw new BadRequestException(
				'Cannot update phase name for a completed phase',
			);
		}

		if (
			[
				ProjectStatus.CANCELED.toString(),
				ProjectStatus.PROPOSED_CLOSED.toString(),
				ProjectStatus.CLOSED.toString(),
			].includes(project.status)
		) {
			throw new BadRequestException(
				`Cannot update phase name for a project with this status: ${phase.project.status}`,
			);
		}

		if (project.phases.find((phase) => phase.name === dto.name)) {
			throw new BadRequestException(
				'A phase with this name already exists in this project',
			);
		}

		if (phase.name === dto.name) {
			return phase;
		}

		phase.name = dto.name;
		return await this.phaseRepo.save(phase);
	}

	async updateStatus(
		id: string,
		dto: UpdatePhaseStatusDto,
		currentUser: JwtPayload,
	): Promise<Phase> {
		const phase = await this.phaseRepo.findOne({
			where: { id },
			relations: {
				project: {
					overseer: true,
				},
				steps: true,
			},
		});

		if (!phase) throw new NotFoundException('Phase not found');

		const { project, steps } = phase;

		if (!this.permissionsService.canEditPhase(currentUser, project))
			throw new ForbiddenException(
				'Only admin or project overseer may update a phase status',
			);

		if (
			[
				ProjectStatus.NOT_STARTED.toString(),
				ProjectStatus.ON_HOLD.toString(),
				ProjectStatus.CANCELED.toString(),
				ProjectStatus.PROPOSED_CLOSED.toString(),
				ProjectStatus.CLOSED.toString(),
			].includes(project.status)
		) {
			throw new BadRequestException(
				`Cannot update phase status for a project with this status: ${phase.project.status}`,
			);
		}

		const newStatus = dto.status;

		const validTransitions: Record<PhaseStatus, PhaseStatus[]> = {
			[PhaseStatus.NOT_STARTED]: [PhaseStatus.IN_PROGRESS],
			[PhaseStatus.IN_PROGRESS]: [PhaseStatus.COMPLETED],
			[PhaseStatus.COMPLETED]: [],
		};

		if (!validTransitions[phase.status].includes(newStatus)) {
			throw new BadRequestException(
				`Invalid status transition from ${phase.status} to ${newStatus}`,
			);
		}

		// Vérifier cohérence avec les steps
		// const steps = await this.stepService.findAllByPhase(id);

		if (newStatus === PhaseStatus.IN_PROGRESS && steps.length === 0) {
			throw new BadRequestException('Cannot start a phase without steps');
		}

		if (newStatus === PhaseStatus.COMPLETED) {
			const allStepsCompleted = steps.every(
				(step) => step.status === 'COMPLETED',
			);
			if (!allStepsCompleted) {
				throw new BadRequestException(
					'Cannot complete a phase while steps are not all completed',
				);
			}
		}

		phase.status = newStatus;
		return await this.phaseRepo.save(phase);
	}

	async updateOrder(
		phaseId: string,
		dto: UpdatePhaseOrderDto,
		currentUser: JwtPayload,
	): Promise<void> {
		const phase = await this.phaseRepo.findOne({
			where: { id: phaseId },
			relations: {
				project: {
					overseer: true,
				},
			},
		});

		if (!phase) throw new NotFoundException('Phase not found');

		const { project } = phase;

		if (!this.permissionsService.canEditPhase(currentUser, project))
			throw new ForbiddenException(
				'Only admin or project overseer may reorder a phase',
			);

		if (phase.status === PhaseStatus.COMPLETED) {
			throw new BadRequestException('Cannot reorder a completed phase');
		}

		if (
			[
				ProjectStatus.CLOSED.toString(),
				ProjectStatus.CANCELED.toString(),
				ProjectStatus.PROPOSED_CLOSED.toString(),
			].includes(project.status)
		) {
			throw new BadRequestException(
				`Cannot reorder phases in this project status: ${project.status}`,
			);
		}

		if (dto.newOrder === phase.order) {
			return;
		}

		await this.projectService.reorderPhases(
			phase.project.id,
			phase.id,
			dto.newOrder,
		);
	}

	async remove(id: string, currentUser: JwtPayload): Promise<void> {
		const phase = await this.phaseRepo.findOne({
			where: { id },
			relations: {
				project: {
					overseer: true,
				},
			},
		});
		if (!phase) throw new NotFoundException('Phase not found');

		const { project } = phase;

		if (!this.permissionsService.canDeletePhase(currentUser, project))
			throw new ForbiddenException(
				'Only admin or project overseer may delete a phase',
			);

		if (
			[
				ProjectStatus.CLOSED.toString(),
				ProjectStatus.CANCELED.toString(),
				ProjectStatus.PROPOSED_CLOSED.toString(),
			].includes(project.status)
		) {
			throw new BadRequestException(
				`Cannot delete phase in this project status: ${project.status}`,
			);
		}

		if (
			[
				ProjectStatus.IN_PROGRESS.toString(),
				ProjectStatus.ON_HOLD.toString(),
			].includes(project.status) &&
			phase.status !== PhaseStatus.NOT_STARTED
		) {
			throw new ForbiddenException(
				`Cannot delete phase in this status: ${phase.status}`,
			);
		}

		await this.phaseRepo.remove(phase);
	}

	async reorderSteps(
		phaseId: string,
		stepId: string,
		newStepOrder: number,
	): Promise<Step[]> {
		return await this.dataSource.transaction(async (manager) => {
			// 1. Charger toutes les étapes du projet, ordonnées par `order`
			const steps = await manager.getRepository(Step).find({
				where: { phase: { id: phaseId } },
				order: { order: 'ASC' },
			});

			const totalLength = steps.length;

			if (steps.length === 0) {
				throw new NotFoundException(`No step found for phase ${phaseId}`);
			}

			if (newStepOrder < 1 || newStepOrder > steps.length) {
				throw new BadRequestException(
					`Invalid target position: ${newStepOrder}, number of steps: ${steps.length}`,
				);
			}

			// 2. Retrouver l'étape à déplacer
			const indexToMove = steps.findIndex((p) => p.id === stepId);
			if (indexToMove === -1) {
				throw new NotFoundException(
					`Step ${stepId} not found in phase ${phaseId}`,
				);
			}

			const stepToMove = steps[indexToMove];

			// 3. Retirer l'étape de la liste
			steps.splice(indexToMove, 1);

			// 4. Insérer à la nouvelle position (1-indexé → ajuster pour tableau)
			const targetIndex = newStepOrder - 1;

			steps.splice(targetIndex, 0, stepToMove);

			// 5. Réassigner les ordres
			for (let i = 0; i < totalLength; i++) {
				steps[i].order = i + 1;
			}

			// 7. Sauvegarde (transactionnelle)
			await manager.getRepository(Step).save(steps);

			return steps;
		});
	}
}

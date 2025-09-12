import { PermissionsService } from 'src/permissions/permissions.service';
import { Repository } from 'typeorm';
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
import { JwtPayload } from 'src/shared/types/jwt-payload.interface';
import { Step } from './entities/step.entity';
import { CreateStepDto } from './dto/create-step.dto';
import { PhaseService } from './phase.service';
import { UpdateStepNameDto } from './dto/update-step-name.dto';
import { StepStatus } from './types/step-status.enum';
import { UpdateStepStatusDto } from './dto/update-step-status.dto';
import { UpdateStepOrderDto } from './dto/update-step-order.dto';

@Injectable()
export class StepService {
	constructor(
		@InjectRepository(Phase) private phaseRepo: Repository<Phase>,
		@InjectRepository(Step)
		private readonly stepRepo: Repository<Step>,
		private permissionsService: PermissionsService,
		private phaseService: PhaseService,
	) {}

	async create(dto: CreateStepDto, currentUser: JwtPayload): Promise<Step> {
		const phase = await this.phaseService.findOne(dto.phaseId);

		if (!phase) throw new NotFoundException('Phase not found');

		if (!this.permissionsService.canCreateStep(currentUser, phase.project))
			throw new ForbiddenException(
				'Only admin, project overseer or project member may create a step',
			);

		if (phase.status === PhaseStatus.COMPLETED) {
			throw new BadRequestException(
				'Cannot create a step in a completed phase',
			);
		}

		if (
			[
				ProjectStatus.CANCELED.toString(),
				ProjectStatus.PROPOSED_CLOSED.toString(),
				ProjectStatus.CLOSED.toString(),
			].includes(phase.project.status)
		) {
			throw new BadRequestException(
				`Cannot add step to a project with this status: ${phase.project.status}`,
			);
		}

		if (phase.steps.find((step) => step.name === dto.name)) {
			throw new BadRequestException(
				'A step with this name already exists in this phase',
			);
		}

		const step = this.stepRepo.create({
			name: dto.name,
			status: PhaseStatus.NOT_STARTED,
			order: phase.steps.length + 1,
			phase,
		});

		return await this.stepRepo.save(step);
	}

	async findAllByPhase(id: string, currentUser: JwtPayload): Promise<Step[]> {
		const phase = await this.phaseService.findOne(id);

		if (!phase) throw new NotFoundException('Phase not found');

		if (!this.permissionsService.canReadStep(currentUser, phase.project))
			throw new ForbiddenException(
				'Only admin, project overseer or project member may read a step',
			);

		return this.stepRepo.find({
			where: { phase: { id } },
			order: { order: 'ASC' },
		});
	}

	async findOne(id: string, currentUser: JwtPayload): Promise<Step> {
		const step = await this.stepRepo.findOne({
			where: { id },
			relations: { phase: { project: { overseer: true, members: true } } },
		});

		if (!step) throw new NotFoundException('Step not found');

		const { phase } = step;

		if (!this.permissionsService.canReadStep(currentUser, phase.project))
			throw new ForbiddenException(
				'Only admin, project overseer or project member may read a step',
			);
		return step;
	}

	async updateName(
		id: string,
		dto: UpdateStepNameDto,
		currentUser: JwtPayload,
	): Promise<Step> {
		const step = await this.stepRepo.findOne({
			where: { id },
			relations: {
				phase: {
					project: {
						overseer: true,
						members: true,
					},
					steps: true,
				},
			},
		});

		if (!step) throw new NotFoundException('Step not found');

		const { phase } = step;
		const { project } = phase;

		if (!this.permissionsService.canEditStep(currentUser, project))
			throw new ForbiddenException(
				'Only an admin, a project overseer or a project member may update a step name',
			);

		if (step.status === StepStatus.COMPLETED) {
			throw new BadRequestException('Cannot update a completed step name');
		}

		// Redondant ? if phase is completed, step is also completed, but this business rule may change
		if (phase.status === PhaseStatus.COMPLETED) {
			throw new BadRequestException(
				'Cannot update a step name in a completed phase',
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
				`Cannot update a step name in a project with this status: ${project.status}`,
			);
		}

		if (step.name === dto.name) {
			return step;
		}

		step.name = dto.name;
		return await this.stepRepo.save(step);
	}

	async updateStatus(
		id: string,
		dto: UpdateStepStatusDto,
		currentUser: JwtPayload,
	): Promise<Step> {
		const step = await this.stepRepo.findOne({
			where: { id },
			relations: {
				phase: {
					project: {
						overseer: true,
						members: true,
					},
				},
			},
		});

		if (!step) throw new NotFoundException('Step not found');

		const { phase } = step;
		const { project } = phase;

		if (!this.permissionsService.canEditStep(currentUser, project)) {
			throw new ForbiddenException(
				'Only an admin, a project overseer or a project member may update a step status',
			);
		}

		if (
			phase.status === PhaseStatus.COMPLETED ||
			phase.status === PhaseStatus.NOT_STARTED
		) {
			throw new BadRequestException(
				`Cannot update a step status in a phase with this status: ${phase.status}`,
			);
		}

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
				`Cannot update a step status in a project with this status: ${project.status}`,
			);
		}

		const newStatus = dto.status;

		const validTransitions: Record<StepStatus, StepStatus[]> = {
			[StepStatus.NOT_STARTED]: [StepStatus.IN_PROGRESS],
			[StepStatus.IN_PROGRESS]: [StepStatus.COMPLETED],
			[StepStatus.COMPLETED]: [],
		};

		if (!validTransitions[step.status].includes(newStatus)) {
			throw new BadRequestException(
				`Invalid status transition from ${step.status} to ${newStatus}`,
			);
		}

		// Vérifier cohérence avec les tasks
		// const taks = await this.taskRepo.find({ where: { step: { id: step.id } } });

		// if (newStatus === StepStatus.COMPLETED && tasks.length > 0) {
		//   const allTasksCompleted = tasks.every((taks) => task.status === 'COMPLETED');
		//   if (!allStepsCompleted) {
		//     throw new BadRequestException('Cannot complete phase while steps are not all completed');
		//   }
		// }

		step.status = newStatus;
		return await this.stepRepo.save(step);
	}

	async updateOrder(
		id: string,
		dto: UpdateStepOrderDto,
		currentUser: JwtPayload,
	): Promise<void> {
		const step = await this.stepRepo.findOne({
			where: { id },
			relations: {
				phase: {
					project: {
						overseer: true,
						members: true,
					},
				},
			},
		});

		if (!step) throw new NotFoundException('Step not found');

		const { phase } = step;
		const { project } = phase;

		if (!this.permissionsService.canEditStep(currentUser, project))
			throw new ForbiddenException(
				'Only an admin, a project overseer or a project member may update a step order',
			);

		if (step.status === StepStatus.COMPLETED) {
			throw new BadRequestException('Cannot reorder a completed step');
		}

		// Redondant ? if phase is completed, step is also completed, but this business rule may change
		if (phase.status === PhaseStatus.COMPLETED) {
			throw new BadRequestException(
				'Cannot reorder a step in a completed phase',
			);
		}

		if (
			[
				ProjectStatus.CLOSED.toString(),
				ProjectStatus.CANCELED.toString(),
				ProjectStatus.PROPOSED_CLOSED.toString(),
			].includes(project.status)
		) {
			throw new BadRequestException(
				`Cannot reorder steps in a project with this status: ${project.status}`,
			);
		}

		if (dto.newOrder === step.order) {
			return;
		}

		await this.phaseService.reorderSteps(phase.id, step.id, dto.newOrder);
	}

	async remove(id: string, currentUser: JwtPayload): Promise<void> {
		const step = await this.stepRepo.findOne({
			where: { id },
			relations: {
				phase: {
					project: {
						overseer: true,
						members: true,
					},
				},
			},
		});

		if (!step) throw new NotFoundException('Step not found');

		const { phase } = step;
		const { project } = phase;

		if (!this.permissionsService.canDeleteStep(currentUser, project)) {
			throw new ForbiddenException(
				'Only admin, project overseer or project member may delete a step',
			);
		}

		if (phase.status === PhaseStatus.COMPLETED) {
			throw new BadRequestException(
				'Cannot delete a step in a completed phase',
			);
		}

		// Do I really need to chck if phase is started ? if not started then step is necessarilly not started, and whatever phase status a started step musn't be deleted
		if (
			[PhaseStatus.IN_PROGRESS.toString()].includes(phase.status) &&
			step.status !== StepStatus.NOT_STARTED
		) {
			throw new ForbiddenException(
				`Cannot delete a step in this status: ${step.status}`,
			);
		}

		if (
			[
				ProjectStatus.CLOSED.toString(),
				ProjectStatus.CANCELED.toString(),
				ProjectStatus.PROPOSED_CLOSED.toString(),
			].includes(project.status)
		) {
			throw new BadRequestException(
				`Cannot delete a step in a project with this status: ${project.status}`,
			);
		}

		await this.stepRepo.remove(step);
	}
}

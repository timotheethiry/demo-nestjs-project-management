import {
	Controller,
	Post,
	Get,
	Put,
	Delete,
	Body,
	Param,
	ParseUUIDPipe,
} from '@nestjs/common';
import { PhaseService } from './phase.service';
import { CreatePhaseDto } from './dto/create-phase.dto';
import { UpdatePhaseNameDto } from './dto/update-phase-name.dto';
// import { UpdatePhaseStepsDto } from './dto/update-phase-steps.dto';
import { Phase } from './entities/phase.entity';
import { UpdatePhaseStatusDto } from './dto/update-phase-status.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { JwtPayload } from 'src/shared/types/jwt-payload.interface';
import { UpdatePhaseOrderDto } from './dto/update-phase-order.dto';

@Controller('phases')
export class PhaseController {
	constructor(private readonly phaseService: PhaseService) {}

	//   Admin or overseer
	@Post()
	create(
		@Body() createPhaseDto: CreatePhaseDto,
		@CurrentUser() currentUser: JwtPayload,
	): Promise<Phase> {
		return this.phaseService.create(createPhaseDto, currentUser);
	}

	@Get('findAllByProject/:projectId')
	findAllByProject(
		@Param('projectId', new ParseUUIDPipe()) projectId: string,
	): Promise<Phase[]> {
		return this.phaseService.findAllByProject(projectId);
	}

	@Get(':id')
	findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Phase> {
		return this.phaseService.findOne(id);
	}

	//   Admin or overseer
	@Put(':id/name')
	updateName(
		@Param('id', new ParseUUIDPipe()) id: string,
		@Body() dto: UpdatePhaseNameDto,
		@CurrentUser() currentUser: JwtPayload,
	): Promise<Phase> {
		return this.phaseService.updateName(id, dto, currentUser);
	}

	//   Admin or overseer
	@Put(':id/status')
	updateStatus(
		@Param('id', new ParseUUIDPipe()) id: string,
		@Body() dto: UpdatePhaseStatusDto,
		@CurrentUser() currentUser: JwtPayload,
	): Promise<Phase> {
		return this.phaseService.updateStatus(id, dto, currentUser);
	}

	@Put(':id/order')
	updateOrder(
		@Param('id', new ParseUUIDPipe()) id: string,
		@Body() dto: UpdatePhaseOrderDto,
		@CurrentUser() currentUser: JwtPayload,
	): Promise<void> {
		return this.phaseService.updateOrder(id, dto, currentUser);
	}

	//   Admin or overseer
	@Delete(':id')
	remove(
		@Param('id', new ParseUUIDPipe()) id: string,
		@CurrentUser() currentUser: JwtPayload,
	): Promise<void> {
		return this.phaseService.remove(id, currentUser);
	}
}

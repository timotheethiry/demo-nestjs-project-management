import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseUUIDPipe,
	Post,
	Put,
} from '@nestjs/common';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { JwtPayload } from 'src/shared/types/jwt-payload.interface';
import { CreatePhaseDto } from './dto/create-phase.dto';
import { UpdatePhaseNameDto } from './dto/update-phase-name.dto';
import { UpdatePhaseOrderDto } from './dto/update-phase-order.dto';
import { UpdatePhaseStatusDto } from './dto/update-phase-status.dto';
import { PhaseService } from './phase.service';
import { Phase } from './phase.entity';

@Controller('phases')
export class PhaseController {
	constructor(private readonly phaseService: PhaseService) {}

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
		@CurrentUser() currentUser: JwtPayload,
	): Promise<Phase[]> {
		return this.phaseService.findAllByProject(projectId, currentUser);
	}

	@Get(':id')
	findOne(
		@Param('id', new ParseUUIDPipe()) id: string,
		@CurrentUser() currentUser: JwtPayload,
	): Promise<Phase> {
		return this.phaseService.findOne(id, currentUser);
	}

	@Put(':id/name')
	updateName(
		@Param('id', new ParseUUIDPipe()) id: string,
		@Body() dto: UpdatePhaseNameDto,
		@CurrentUser() currentUser: JwtPayload,
	): Promise<Phase> {
		return this.phaseService.updateName(id, dto, currentUser);
	}

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

	@Delete(':id')
	remove(
		@Param('id', new ParseUUIDPipe()) id: string,
		@CurrentUser() currentUser: JwtPayload,
	): Promise<void> {
		return this.phaseService.remove(id, currentUser);
	}
}

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
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepNameDto } from './dto/update-step-name.dto';
import { UpdateStepOrderDto } from './dto/update-step-order.dto';
import { UpdateStepStatusDto } from './dto/update-step-status.dto';
import { Step } from './step.entity';
import { StepService } from './step.service';

@Controller('steps')
export class StepController {
	constructor(private readonly stepService: StepService) {}

	@Post()
	create(
		@Body() createStepDto: CreateStepDto,
		@CurrentUser() currentUser: JwtPayload,
	): Promise<Step> {
		return this.stepService.create(createStepDto, currentUser);
	}

	@Get('findAllByPhase/:phaseId')
	findAllByProject(
		@Param('phaseId', new ParseUUIDPipe()) phaseId: string,
		@CurrentUser() currentUser: JwtPayload,
	): Promise<Step[]> {
		return this.stepService.findAllByPhase(phaseId, currentUser);
	}

	@Get(':id')
	findOne(
		@Param('id', new ParseUUIDPipe()) id: string,
		@CurrentUser() currentUser: JwtPayload,
	): Promise<Step> {
		return this.stepService.findOne(id, currentUser);
	}

	@Put(':id/name')
	updateName(
		@Param('id', new ParseUUIDPipe()) id: string,
		@Body() dto: UpdateStepNameDto,
		@CurrentUser() currentUser: JwtPayload,
	): Promise<Step> {
		return this.stepService.updateName(id, dto, currentUser);
	}

	@Put(':id/status')
	updateStatus(
		@Param('id', new ParseUUIDPipe()) id: string,
		@Body() dto: UpdateStepStatusDto,
		@CurrentUser() currentUser: JwtPayload,
	): Promise<Step> {
		return this.stepService.updateStatus(id, dto, currentUser);
	}

	@Put(':id/order')
	updateOrder(
		@Param('id', new ParseUUIDPipe()) id: string,
		@Body() dto: UpdateStepOrderDto,
		@CurrentUser() currentUser: JwtPayload,
	): Promise<void> {
		return this.stepService.updateOrder(id, dto, currentUser);
	}

	@Delete(':id')
	remove(
		@Param('id', new ParseUUIDPipe()) id: string,
		@CurrentUser() currentUser: JwtPayload,
	): Promise<void> {
		return this.stepService.remove(id, currentUser);
	}
}

import { IsEnum } from 'class-validator';
import { PhaseStatus } from 'src/project/types/phase-status.enum';

export class UpdatePhaseStatusDto {
	@IsEnum(PhaseStatus)
	status: PhaseStatus;
}

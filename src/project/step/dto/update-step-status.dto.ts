import { IsEnum } from 'class-validator';
import { StepStatus } from 'src/project/types/step-status.enum';

export class UpdateStepStatusDto {
	@IsEnum(StepStatus)
	status: StepStatus;
}

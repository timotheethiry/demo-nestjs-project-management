import { IsEnum } from 'class-validator';
import { ProjectStatus } from '../types/status.enum';

export class UpdateProjectStatusDto {
	@IsEnum(ProjectStatus)
	status: ProjectStatus;
}

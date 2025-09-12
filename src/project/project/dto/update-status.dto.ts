import { IsEnum } from 'class-validator';
import { ProjectStatus } from 'src/project/types/project-status.enum';

export class UpdateProjectStatusDto {
	@IsEnum(ProjectStatus)
	status: ProjectStatus;
	s;
}

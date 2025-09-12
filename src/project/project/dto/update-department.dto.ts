import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateProjectDepartmentDto {
	@IsNotEmpty()
	@IsUUID()
	departmentId: string;
}

import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateProjectOverseerDto {
	@IsNotEmpty()
	@IsUUID()
	overseerId: string;
}

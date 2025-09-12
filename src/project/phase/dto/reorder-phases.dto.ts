import { IsArray, IsUUID, ArrayNotEmpty } from 'class-validator';

export class ReorderPhasesDto {
	@IsArray()
	@ArrayNotEmpty()
	@IsUUID('4', { each: true })
	phaseIds: string[];
}

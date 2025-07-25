import {
	IsArray,
	ArrayNotEmpty,
	IsUUID,
	ArrayMaxSize,
	ArrayUnique,
} from 'class-validator';

export class UpdateProjectMembersDto {
	@IsArray()
	@ArrayNotEmpty()
	@ArrayMaxSize(100)
	@ArrayUnique()
	@IsUUID('all', { each: true })
	memberIds: string[];
}

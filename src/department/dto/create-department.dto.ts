import {
	ArrayMaxSize,
	ArrayUnique,
	IsArray,
	IsOptional,
	IsString,
	IsUUID,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';

export class CreateDepartmentDto {
	@IsString()
	@MinLength(3)
	@MaxLength(50)
	@Matches(/^[a-zA-Z0-9À-ÿ _\\/\-.,!?()'"%€$+*#]*$/, {
		message: 'Forbidden symbols or characters in username',
	})
	name: string;

	@IsOptional()
	@IsArray()
	@ArrayMaxSize(100)
	@ArrayUnique()
	@IsUUID('all', { each: true })
	memberIds?: string[];
}

import {
	IsNotEmpty,
	IsString,
	IsUUID,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';

export class CreatePhaseDto {
	@IsNotEmpty()
	@IsString()
	@MinLength(3)
	@MaxLength(50)
	@Matches(/^[a-zA-Z0-9À-ÿ _\\/\-.,;!?()'"%€$+*#]*$/, {
		message: 'Forbidden symbols or characters in name',
	})
	name: string;

	@IsUUID()
	@MaxLength(36)
	@Matches(/^[a-zA-Z0-9À-ÿ _\\/\-.,;!?()'"%€$+*#]*$/, {
		message: 'Forbidden symbols or characters in overseerId',
	})
	projectId: string;
}

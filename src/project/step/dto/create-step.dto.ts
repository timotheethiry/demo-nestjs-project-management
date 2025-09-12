import {
	IsNotEmpty,
	IsString,
	Matches,
	MaxLength,
	MinLength,
	IsUUID,
} from 'class-validator';

export class CreateStepDto {
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
		message: 'Forbidden symbols or characters in phaseId',
	})
	phaseId: string;
}

import {
	IsNotEmpty,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';

export class UpdatePhaseNameDto {
	@IsNotEmpty()
	@IsString()
	@MinLength(3)
	@MaxLength(50)
	@Matches(/^[a-zA-Z0-9À-ÿ _\\/\-.,;!?()'"%€$+*#]*$/, {
		message: 'Forbidden symbols or characters in name',
	})
	name: string;
}

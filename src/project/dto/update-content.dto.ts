import {
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';

export class UpdateProjectContentDto {
	@IsOptional()
	@IsString()
	@MinLength(3)
	@MaxLength(50)
	@Matches(/^[a-zA-Z0-9À-ÿ _\\/\-.,;!?()'"%€$+*#]*$/, {
		message: 'Forbidden symbols or characters in name',
	})
	name?: string;

	@IsOptional()
	@IsString()
	@MaxLength(3000)
	@Matches(/^[a-zA-Z0-9À-ÿ _\\/\-.,;!?()'"%€$+*#]*$/, {
		message: 'Forbidden symbols or characters in description',
	})
	description?: string;

	@IsOptional()
	@IsString()
	@MaxLength(3000)
	@Matches(/^[a-zA-Z0-9À-ÿ _\\/\-.,;!?()'"%€$+*#]*$/, {
		message: 'Forbidden symbols or characters in objectives',
	})
	objectives?: string;

	@IsOptional()
	@IsString()
	@MaxLength(3000)
	@Matches(/^[a-zA-Z0-9À-ÿ _\\/\-.,;!?()'"%€$+*#]*$/, {
		message: 'Forbidden symbols or characters in context',
	})
	context?: string;

	@IsOptional()
	@IsString()
	@MaxLength(3000)
	@Matches(/^[a-zA-Z0-9À-ÿ _\\/\-.,;!?()'"%€$+*#]*$/, {
		message: 'Forbidden symbols or characters in expectedResults',
	})
	expectedResults?: string;
}

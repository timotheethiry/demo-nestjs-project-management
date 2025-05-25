import {
	ArrayMaxSize,
	ArrayUnique,
	IsArray,
	IsDateString,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';

export class CreateProjectDto {
	@IsNotEmpty()
	@IsString()
	@MinLength(3)
	@MaxLength(50)
	@Matches(/^[a-zA-Z0-9À-ÿ _\\/\-.,!?()'"%€$+*#]*$/, {
		message: 'Forbidden symbols or characters in username',
	})
	name: string;

	@IsNotEmpty()
	@IsString()
	@MaxLength(3000)
	@Matches(/^[a-zA-Z0-9À-ÿ _\\/\-.,!?()'"%€$+*#]*$/, {
		message: 'Forbidden symbols or characters in username',
	})
	description: string;

	@IsEnum([
		'NOT_STARTED',
		'IN_PROGRESS',
		'ON_HOLD',
		'CANCELED',
		'PROPOSED_CLOSED',
		'CLOSED',
	])
	status: string;

	@IsOptional()
	@IsString()
	@MaxLength(3000)
	@Matches(/^[a-zA-Z0-9À-ÿ _\\/\-.,!?()'"%€$+*#]*$/, {
		message: 'Forbidden symbols or characters in username',
	})
	objectives?: string;

	@IsOptional()
	@IsString()
	@MaxLength(3000)
	@Matches(/^[a-zA-Z0-9À-ÿ _\\/\-.,!?()'"%€$+*#]*$/, {
		message: 'Forbidden symbols or characters in username',
	})
	context?: string;

	@IsOptional()
	@IsString()
	@MaxLength(3000)
	@Matches(/^[a-zA-Z0-9À-ÿ _\\/\-.,!?()'"%€$+*#]*$/, {
		message: 'Forbidden symbols or characters in username',
	})
	expectedResults?: string;

	@IsOptional()
	@IsDateString()
	startDate?: Date;

	@IsOptional()
	@IsDateString()
	endDate?: Date;

	@IsUUID()
	@MaxLength(36)
	@Matches(/^[a-zA-Z0-9À-ÿ _\\/\-.,!?()'"%€$+*#]*$/, {
		message: 'Forbidden symbols or characters in username',
	})
	departmentId?: string;

	@IsUUID()
	@MaxLength(36)
	@Matches(/^[a-zA-Z0-9À-ÿ _\\/\-.,!?()'"%€$+*#]*$/, {
		message: 'Forbidden symbols or characters in username',
	})
	overseerId?: string;

	@IsOptional()
	@IsArray()
	@ArrayMaxSize(100)
	@ArrayUnique()
	@IsUUID('all', { each: true })
	memberIds?: string[];
}

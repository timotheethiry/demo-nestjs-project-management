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
	@Matches(/^[a-zA-Z0-9À-ÿ _\\/\-.,;!?()'"%€$+*#]*$/, {
		message: 'Forbidden symbols or characters in name',
	})
	name: string;

	@IsNotEmpty()
	@IsString()
	@MaxLength(3000)
	@Matches(/^[a-zA-Z0-9À-ÿ _\\/\-.,;!?()'"%€$+*#]*$/, {
		message: 'Forbidden symbols or characters in description',
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
	status:
		| 'NOT_STARTED'
		| 'IN_PROGRESS'
		| 'ON_HOLD'
		| 'CANCELED'
		| 'PROPOSED_CLOSED'
		| 'CLOSED';

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

	@IsOptional()
	@IsDateString()
	startDate?: Date;

	@IsOptional()
	@IsDateString()
	endDate?: Date;

	// Decide if removing this field from updateDto to protect updateProject method and define a distinct assignDepartmentDto
	@IsOptional()
	@IsUUID()
	@MaxLength(36)
	@Matches(/^[a-zA-Z0-9À-ÿ _\\/\-.,;!?()'"%€$+*#]*$/, {
		message: 'Forbidden symbols or characters in departmentId',
	})
	departmentId?: string;

	@IsOptional()
	@IsUUID()
	@MaxLength(36)
	@Matches(/^[a-zA-Z0-9À-ÿ _\\/\-.,;!?()'"%€$+*#]*$/, {
		message: 'Forbidden symbols or characters in overseerId',
	})
	overseerId?: string;

	@IsOptional()
	@IsArray()
	@ArrayMaxSize(100)
	@ArrayUnique()
	@IsUUID('all', { each: true })
	memberIds?: string[];
}

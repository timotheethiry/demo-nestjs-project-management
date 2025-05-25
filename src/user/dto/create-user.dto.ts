import {
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsString,
	IsStrongPassword,
	Matches,
	MaxLength,
} from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	@MaxLength(50)
	@Matches(/^[a-zA-Z0-9À-ÿ _\\/\-.,!?()'"%€$+*#]*$/, {
		message: 'Forbidden symbols or characters in username',
	})
	firstName: string;

	@IsNotEmpty()
	@IsString()
	@MaxLength(50)
	@Matches(/^[a-zA-Z0-9À-ÿ _\\/\-.,!?()'"%€$+*#]*$/, {
		message: 'Forbidden symbols or characters in username',
	})
	lastName: string;

	@IsEmail()
	@MaxLength(255)
	email: string;

	@IsString()
	@MaxLength(50)
	@Matches(/^[a-zA-Z0-9À-ÿ _\\/\-.,!?()'"%€$+*#]*$/, {
		message: 'Forbidden symbols or characters in username',
	})
	@IsStrongPassword(
		{
			minLength: 8,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
		},
		{
			message: `Password is not strong enough. 
		Acceptable format is minLength: 8, 
		minLowercase: 1, minUppercase: 1, 
		minNumbers: 1, minSymbols: 1`,
		},
	)
	password: string;

	@IsEnum(['admin', 'user'])
	role: 'admin' | 'user';
}

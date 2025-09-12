import { IsDateString, IsNotEmpty } from 'class-validator';

export class UpdateProjectDatesDto {
	@IsNotEmpty()
	@IsDateString()
	startDate: string;

	@IsNotEmpty()
	@IsDateString()
	endDate: string;
}

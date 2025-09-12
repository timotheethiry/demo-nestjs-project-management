import { IsInt, Min } from 'class-validator';

export class UpdateStepOrderDto {
	@IsInt()
	@Min(1)
	newOrder: number;
}

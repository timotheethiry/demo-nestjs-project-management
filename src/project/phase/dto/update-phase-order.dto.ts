import { IsInt, Min } from 'class-validator';

export class UpdatePhaseOrderDto {
	@IsInt()
	@Min(1)
	newOrder: number;
}

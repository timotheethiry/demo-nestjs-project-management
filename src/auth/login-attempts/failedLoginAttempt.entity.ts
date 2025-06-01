import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class FailedLoginAttempt {
	@PrimaryColumn()
	ip: string;

	@Column()
	count: number;

	@Column()
	lastAttempt: number;

	@Column()
	blockedUntil: number;
}

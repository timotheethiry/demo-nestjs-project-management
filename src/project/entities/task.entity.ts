import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Step } from '../step/step.entity';

@Entity()
export class Task {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column()
	status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@ManyToOne(() => Step, (step) => step.tasks, { onDelete: 'CASCADE' })
	step: Step;
}

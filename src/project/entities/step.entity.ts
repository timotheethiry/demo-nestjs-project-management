import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
} from 'typeorm';
import { Phase } from './phase.entity';
import { Task } from './task.entity';

@Entity()
export class Step {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column()
	status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

	@Column()
	order: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@ManyToOne(() => Phase, (phase) => phase.steps, { onDelete: 'CASCADE' })
	phase: Phase;

	@OneToMany(() => Task, (task) => task.step, { cascade: true })
	tasks: Task[];
}

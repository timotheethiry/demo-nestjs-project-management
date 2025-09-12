import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	OneToMany,
	Index,
} from 'typeorm';
import { Project } from './project.entity';
import { Step } from './step.entity';

@Entity()
export class Phase {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Index()
	@Column()
	status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

	@Column()
	order: number;

	@ManyToOne(() => Project, (project) => project.phases, {
		onDelete: 'CASCADE',
	})
	project: Project;

	@OneToMany(() => Step, (step) => step.phase, { cascade: true })
	steps: Step[];
}

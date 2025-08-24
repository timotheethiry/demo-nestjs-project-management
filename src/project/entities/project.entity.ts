import { Department } from 'src/department/entities/department.entity';
import { User } from 'src/user/entities/user.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Phase } from './phase.entity';

@Entity()
export class Project {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	name: string;

	@Column({ nullable: true })
	description: string;

	@Index()
	@Column()
	status:
		| 'NOT_STARTED'
		| 'IN_PROGRESS'
		| 'ON_HOLD'
		| 'CANCELED'
		| 'PROPOSED_CLOSED'
		| 'CLOSED';

	@Column({ type: 'varchar', nullable: true })
	objectives: string | null;

	@Column({ type: 'varchar', nullable: true })
	context: string | null;

	@Column({ type: 'varchar', nullable: true })
	expectedResults: string | null;

	@Column({ type: 'varchar', nullable: true })
	startDate: Date | null;

	@Column({ type: 'varchar', nullable: true })
	endDate: Date | null;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@ManyToOne(() => User)
	createdBy: User;

	@Index()
	@ManyToOne(() => Department)
	department: Department;

	@Index()
	@ManyToOne(() => User)
	overseer: User;

	@ManyToMany(() => User, (user) => user.memberProjects)
	@JoinTable()
	members: User[];

	@OneToMany(() => Phase, (phase) => phase.project, {
		cascade: true,
		eager: true,
	})
	phases: Phase[];
}

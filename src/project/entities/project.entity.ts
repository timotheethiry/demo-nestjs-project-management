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
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

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

	@Column({ nullable: true })
	objectives: string;

	@Column({ nullable: true })
	context: string;

	@Column({ nullable: true })
	expectedResults: string;

	@Column({ nullable: true })
	startDate: Date;

	@Column({ nullable: true })
	endDate: Date;

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

	// To be uncommented at roadmap step 6 (Phase implementation)
	// @OneToMany(() => Phase, (phase) => phase.project, {
	// 	cascade: true,
	// 	eager: true,
	// })
	// phases: Phase[];
}

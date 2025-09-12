import { Department } from 'src/department/entities/department.entity';
import { Project } from 'src/project/project/project.entity';
import {
	Column,
	Entity,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column({ unique: true })
	email: string;

	@Column()
	passwordHash: string;

	@Column()
	role: 'admin' | 'user';

	@ManyToOne(() => Department, (department) => department.members, {
		nullable: true,
		eager: true,
	})
	department: Department;

	@OneToMany(() => Project, (project) => project.createdBy)
	createdProjects: Project[];

	@OneToMany(() => Project, (project) => project.overseer)
	overseeingProjects: Project[];

	@ManyToMany(() => Project, (project) => project.members)
	memberProjects: Project[];
}

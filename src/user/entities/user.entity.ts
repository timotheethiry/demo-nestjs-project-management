import { Project } from 'src/project/entities/project.entity';
import {
	Column,
	Entity,
	ManyToMany,
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

	@Column({ type: 'enum', enum: ['admin', 'user'] })
	role: 'admin' | 'user';

	@OneToMany(() => Project, (project) => project.createdBy)
	createdProjects: Project[];

	@OneToMany(() => Project, (project) => project.overseer)
	overseeingProjects: Project[];

	@ManyToMany(() => Project, (project) => project.members)
	memberProjects: Project[];
}

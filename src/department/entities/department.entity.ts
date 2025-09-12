import { Project } from 'src/project/project/project.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Department {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	name: string;

	@OneToMany(() => User, (user) => user.department)
	members: User[];

	@OneToMany(() => Project, (project) => project.department)
	projects: Project[];
}

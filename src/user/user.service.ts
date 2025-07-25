import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Department } from 'src/department/entities/department.entity';
import { JwtPayload } from 'src/shared/types/jwt-payload.interface';
import { PermissionsService } from 'src/permissions/permissions.service';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private userRepo: Repository<User>,
		@InjectRepository(Department)
		private departmentRepo: Repository<Department>,
		private permissionsService: PermissionsService,
	) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const role = createUserDto.role ?? { role: 'user' };
		const passwordHash = await bcrypt.hash(createUserDto.password, 10);
		const user = this.userRepo.create({
			...createUserDto,
			passwordHash: passwordHash,
			role,
		});
		return this.userRepo.save(user);
	}

	findAll(): Promise<User[]> {
		return this.userRepo.find();
	}

	async findOne(id: string): Promise<User> {
		const user = await this.userRepo.findOneBy({ id });
		if (!user) throw new NotFoundException(`User #${id} not found`);
		return user;
	}

	async findByDepartment(updateUserDto: UpdateUserDto): Promise<User[]> {
		const users = await this.userRepo.find({
			where: { department: { id: updateUserDto.departmentId } },
		});

		return users;
	}

	async findByIds(ids: string[]): Promise<User[]> {
		return this.userRepo.findBy({ id: In(ids) });
	}

	async update(
		id: string,
		updateUserDto: UpdateUserDto,
		currentUser: JwtPayload,
	): Promise<User> {
		const user = await this.findOne(id);

		if (
			!this.permissionsService.isOwner(currentUser, user) &&
			!this.permissionsService.isAdmin(currentUser)
		) {
			throw new UnauthorizedException('Not allowed to update this user.');
		}

		const { email, firstName, lastName, password } = updateUserDto;

		if (firstName) user.firstName = firstName;
		if (lastName) user.lastName = lastName;
		if (email) user.email = email;

		if (password) {
			const passwordHash = await bcrypt.hash(password, 10);
			user.passwordHash = passwordHash;
		}

		return this.userRepo.save(user);
	}

	async assignDepartmentToUser(id: string, departmentId: string) {
		const user = await this.findOne(id);
		const department = await this.departmentRepo.findOneBy({
			id: departmentId,
		});
		if (!department) {
			throw new NotFoundException(`Department #${departmentId} not found`);
		}
		user.department = { id: departmentId } as Department;

		return this.userRepo.save(user);
	}

	async assignRole(id: string, updateUserDto: UpdateUserDto): Promise<User> {
		const user = await this.findOne(id);
		const { role } = updateUserDto;
		if (role && user.role !== role) user.role = role;

		return this.userRepo.save(user);
	}

	async remove(id: string): Promise<void> {
		const result = await this.userRepo.delete(id);
		if (result.affected === 0)
			throw new NotFoundException(`User #${id} not found`);
	}
}

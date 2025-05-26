import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

	// Add bcrypt during roadmap step 3 (Authentication)
	create(createUserDto: CreateUserDto): Promise<User> {
		const role = createUserDto.role ?? { role: 'user' };
		const user = this.userRepo.create({
			...createUserDto,
			passwordHash: createUserDto.password,
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

	// Add findByService during a future update

	async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
		const user = await this.findOne(id);

		const { email, firstName, lastName, password } = updateUserDto;

		if (firstName) user.firstName = firstName;
		if (lastName) user.lastName = lastName;
		if (email) user.email = email;

		// Add bcrypt during roadmap step 3 (Authentication)
		if (password) {
			const hashedPassword = password;
			user.passwordHash = hashedPassword;
		}

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

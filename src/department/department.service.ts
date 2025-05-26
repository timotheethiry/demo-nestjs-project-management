import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DepartmentService {
	constructor(
		@InjectRepository(Department)
		private departmentRepo: Repository<Department>,
	) {}

	create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
		const department = this.departmentRepo.create(createDepartmentDto);
		return this.departmentRepo.save(department);
	}

	findAll(): Promise<Department[]> {
		return this.departmentRepo.find();
	}

	async findOne(id: string): Promise<Department> {
		const department = await this.departmentRepo.findOneBy({ id });
		if (!department) throw new NotFoundException(`Department #${id} not found`);
		return department;
	}

	async update(
		id: string,
		updateDepartmentDto: UpdateDepartmentDto,
	): Promise<Department> {
		const department = await this.findOne(id);
		Object.assign(department, updateDepartmentDto);
		return this.departmentRepo.save(department);
	}

	async remove(id: string): Promise<void> {
		const result = await this.departmentRepo.delete(id);
		if (result.affected === 0)
			throw new NotFoundException(`Department #${id} not found`);
	}
}

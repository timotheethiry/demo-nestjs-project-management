import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Put,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/role.enum';

@Controller('departments')
export class DepartmentController {
	constructor(private readonly departmentService: DepartmentService) {}

	@Post()
	@Roles(Role.Admin)
	create(@Body() createDepartmentDto: CreateDepartmentDto) {
		return this.departmentService.create(createDepartmentDto);
	}

	@Get()
	findAll() {
		return this.departmentService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.departmentService.findOne(id);
	}

	@Put(':id')
	@Roles(Role.Admin)
	update(
		@Param('id') id: string,
		@Body() updateDepartmentDto: UpdateDepartmentDto,
	) {
		return this.departmentService.update(id, updateDepartmentDto);
	}

	@Delete(':id')
	@Roles(Role.Admin)
	remove(@Param('id') id: string) {
		return this.departmentService.remove(id);
	}
}

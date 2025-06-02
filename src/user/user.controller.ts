import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Put,
	BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/shared/decorators/public.decorator';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	@Public()
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}

	@Get()
	findAll() {
		return this.userService.findAll();
	}

	@Get('department')
	findByDepartment(@Body() updateUserDto: UpdateUserDto) {
		return this.userService.findByDepartment(updateUserDto);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.userService.findOne(id);
	}

	@Put(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(id, updateUserDto);
	}

	// Add guard @IsAdmin()
	@Put(':id/role')
	assignRole(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.assignRole(id, updateUserDto);
	}

	// Add permission @IsAdmin()
	@Put(':id/assignment')
	assignDepartmentToUser(
		@Param('id') id: string,
		@Body() updateUserDto: UpdateUserDto,
	) {
		if (!updateUserDto.departmentId)
			throw new BadRequestException('departmentId is required');
		return this.userService.assignDepartmentToUser(
			id,
			updateUserDto.departmentId,
		);
	}

	// Add permission @IsAdmin()
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userService.remove(id);
	}
}

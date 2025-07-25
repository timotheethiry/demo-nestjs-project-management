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
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/role.enum';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { JwtPayload } from 'src/shared/types/jwt-payload.interface';

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
	update(
		@Param('id') id: string,
		@Body() updateUserDto: UpdateUserDto,
		@CurrentUser() currentUser: JwtPayload,
	) {
		return this.userService.update(id, updateUserDto, currentUser);
	}

	@Put(':id/role')
	@Roles(Role.Admin)
	assignRole(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.assignRole(id, updateUserDto);
	}

	@Put(':id/assignment')
	@Roles(Role.Admin)
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

	@Delete(':id')
	@Roles(Role.Admin)
	remove(@Param('id') id: string) {
		return this.userService.remove(id);
	}
}

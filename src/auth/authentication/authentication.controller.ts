import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Ip,
	Post,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { Public } from 'src/shared/decorators/public.decorator';

@Controller('auth')
export class AuthenticationController {
	constructor(private authService: AuthenticationService) {}

	@HttpCode(HttpStatus.OK)
	@Post('login')
	@Public()
	signIn(@Body() signInDto: Record<string, string>, @Ip() ip: string) {
		return this.authService.signIn(signInDto.email, signInDto.password, ip);
	}
}

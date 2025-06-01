import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { jwtConstant } from './authentication/constants';
import { AuthGuard } from './guards/auth.guard';
import { FailedLoginAttempt } from './login-attempts/failedLoginAttempt.entity';
import { LoginAttempts } from './login-attempts/login-attempts';

const loginAttemptsProvider = {
	provide: 'LOGIN',
	useFactory: (repo: Repository<FailedLoginAttempt>) =>
		new LoginAttempts(20, 3, 60, repo),
	inject: [getRepositoryToken(FailedLoginAttempt)],
};

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		TypeOrmModule.forFeature([FailedLoginAttempt]),
		JwtModule.register({
			global: true,
			secret: jwtConstant.secret,
			signOptions: { expiresIn: '1h' },
		}),
	],
	controllers: [AuthenticationController],
	providers: [
		AuthenticationService,
		loginAttemptsProvider,
		{ provide: APP_GUARD, useClass: AuthGuard },
	],
})
export class AuthModule {}

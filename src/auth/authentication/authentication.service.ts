import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginAttempts } from '../login-attempts/login-attempts';

@Injectable()
export class AuthenticationService {
	constructor(
		@InjectRepository(User) private userRepo: Repository<User>,
		private jwtServive: JwtService,
		@Inject('LOGIN') private loginAttempts: LoginAttempts,
	) {}

	async signIn(
		email: string,
		passwordSent: string,
		ip: string,
	): Promise<{ access_token: string }> {
		const { blocked, blockDurationMessage } =
			await this.loginAttempts.checkIfAddressIsAlreadyBlocked(ip);

		if (blocked) throw new UnauthorizedException(blockDurationMessage);

		const user = await this.userRepo.findOneBy({ email });

		if (!user) {
			const { blocked, messages } =
				await this.loginAttempts.handleLoginFailure(ip);

			if (blocked)
				throw new UnauthorizedException(messages.blockDurationMessage);
			throw new UnauthorizedException(messages.remainingAttemptsMessage);
		}

		const passwordIsLegit = await bcrypt.compare(
			passwordSent,
			user.passwordHash,
		);

		if (!passwordIsLegit) {
			const { blocked, messages } =
				await this.loginAttempts.handleLoginFailure(ip);

			if (blocked)
				throw new UnauthorizedException(messages.blockDurationMessage);
			throw new UnauthorizedException(messages.remainingAttemptsMessage);
		}

		const payloadToken = {
			sub: user.id,
			username: `${user.firstName} ${user.lastName}`,
			role: user.role,
		};

		await this.loginAttempts.resetAfterSuccessfulLogin(ip);

		return { access_token: await this.jwtServive.signAsync(payloadToken) };
	}
}

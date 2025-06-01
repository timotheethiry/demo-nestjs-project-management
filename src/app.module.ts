import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { DepartmentModule } from './department/department.module';
import { PermissionsModule } from './permissions/permissions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { SharedModule } from './shared/shared.module';

@Module({
	imports: [
		AuthModule,
		UserModule,
		ProjectModule,
		DepartmentModule,
		PermissionsModule,
		TypeOrmModule.forRoot({
			type: 'sqlite',
			database: 'db.sql',
			autoLoadEntities: true,
			synchronize: true,
		}),
		ThrottlerModule.forRoot({
			throttlers: [{ ttl: 60000, limit: 10 }],
		}),
		SharedModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}

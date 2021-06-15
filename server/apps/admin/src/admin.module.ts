import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthModule } from './auth/auth.module';
import { ApiModule } from './api/api.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [AuthModule, ApiModule, ConfigModule.forRoot(
		{isGlobal:true}
	)],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

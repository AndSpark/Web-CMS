import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { JwtStrategy } from '../auth/jwt.strategy';
import { MulterModule } from "@nestjs/platform-express";
import { MulterConfigService } from "./multerConfig.service";

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: 36000 },
		}),
		MulterModule.registerAsync({
			useClass:MulterConfigService
		})
	],
  controllers: [ApiController],
  providers: [ApiService,JwtStrategy]
})
export class ApiModule {}

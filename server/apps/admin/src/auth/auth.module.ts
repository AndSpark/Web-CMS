import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { jwtConstants } from './constants';

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: 36000 },
    })
	],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy]
})
export class AuthModule {}

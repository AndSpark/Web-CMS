import { Body, Controller, Get, Headers, Post,  Put,  UseGuards } from '@nestjs/common';
import { Site } from '../decorator/site.decorator';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
@Controller('auth')
export class AuthController {

	constructor(private authService: AuthService){}

	@Post('/login')
	async login(@Body() credentials: LoginDTO,@Site() site) {
		const res = await this.authService.validateUser(credentials,site.sitetplpath)
		return res
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('/user')
	async index(@Headers('Authorization') jwt, @Site() site) {
		const user = await this.authService.getUser(jwt, site.sitetplpath,site.origin)
		return user
	}

	@Put('/user')
	async update(@Body() updateForm: any, @Site() site) {
		return await this.authService.updateUser(updateForm,site.sitetplpath)
	}
}

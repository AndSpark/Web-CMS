import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { dbs } from '../../../../libs/db/dbs'
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {

	constructor(
		private readonly jwtService: JwtService
	){}

	async validateUser(credentials:LoginDTO,sitetplpath:string) {
		const {username,password} = credentials
		const db = await dbs.createDb(sitetplpath)
		const user = await db.getUser(username)
		if (!user) {
			throw new UnauthorizedException()
		}
		const isValid = await user.comparePassword(password)
		if (!isValid) {
			throw new UnauthorizedException()
		}
		const payload = { username: user.username,site:sitetplpath };
		const token = 'bearer ' + this.jwtService.sign(payload)
		return {token}
	}

	async getUser(jwt:string,sitetplpath:string,url:string) {
		const {username,site} = this.jwtService.decode(jwt.replace('bearer ', '')) as any
		const db = await dbs.createDb(sitetplpath)
		const user = await db.getUser(username)
		if (!user || site !== sitetplpath) {
			throw new UnauthorizedException()
		}
		console.log(sitetplpath,site,url);
		if (url.includes('admin.le-so.cn') && !sitetplpath.includes('admin')) {
			throw new UnauthorizedException()
		}
		
		return user.toObj()
	}

	async updateUser(updateForm: {
		username: string
		originPassword: string
		password: string
		confirmPassword: string
	},sitetplpath:string) {
		const {username,password,originPassword} = updateForm
		const db = await dbs.createDb(sitetplpath)
		const user = await db.getUser(username)
		if (!user) {
			throw new UnauthorizedException('用户名或原密码错误')
		}
		const isValid = await user.comparePassword(originPassword)
		if (!isValid) {
			throw new UnauthorizedException('用户名或原密码错误')
		}
		user.password = await bcrypt.hash(password,10)
		await db.userRep.save(user)
		return 'success'
	}
}

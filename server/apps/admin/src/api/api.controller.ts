import { Body, Controller, Delete, Get, Headers, Post, Put, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiService } from './api.service'
import { Site } from '../decorator/site.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Rep } from 'libs/db/db';
import { FileInterceptor } from '@nestjs/platform-express';
import { JsonToObjPipe } from './json-obj.pipe';

@Controller('api')
@UseGuards(AuthGuard('jwt'))
export class ApiController {

	constructor(
		private readonly ApiService: ApiService
	){}


	@Get([
		'/model',
		'/site',
		'/com',
		'/area',
		'/sort',
		'/label',
		'/con',
		'/slide',
		'/ext',
		'/conExt',
		'/msg'
	])
	async getData(@Site() site,@Query() query) {
		return await this.ApiService.getDatas(site.rep,site.sitetplpath,query)
	}

	@Post([
		'/model',
		'/sort',
		'/label',
		'/area',
		'/slide',
		'/ext'
	])
	async addData(@Site() site ,@Body() data:Object) {
		return await this.ApiService.addDatas(site.rep,data,site.sitetplpath)
	}


	@Put([
		'/model',
		'/site',
		'/com',
		'/sort',
		'/label',
		'/slide'
	])
	async updateData(@Site() site, @Body() data: Object) {
		return await this.ApiService.updateData(site.rep,data,site.sitetplpath)
	}

	@Delete('/area')
	async deleteArea(@Site() site, @Body() data:any) {
		const acode = data.acode
		return await this.ApiService.deleteArea(site.sitetplpath,acode)
	}

	@Delete([
		'/model',
		'/sort',
		'/label',
		'/con',
		'/slide',
		'/ext',
		'/msg'
	])
	async deleteData(@Site() site, @Body() data:{name:string}) {
		return await this.ApiService.deleteData(site.rep,data,site.sitetplpath)
	}

	@Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
	async upload(@UploadedFile() file) {
		return {file,success:true}
	}

	@Post('/upload/batch')
  @UseInterceptors(FileInterceptor('file'))
	async uploadBatch(@Site() site, @UploadedFile() file, @Body('info',new JsonToObjPipe()) info) {
		return  await this.ApiService.uploadBatch(site.sitetplpath,file,{...info,site:site.site})
	}

	@Post('/con')
	async getContent(@Site() site, @Body() findOption) {
		return await this.ApiService.getContent(findOption,site.sitetplpath)
	}

	@Put('/con')
	async putContent(@Site() site, @Body() data:Object) {
			return await this.ApiService.putContent(data,site.sitetplpath)
	}

	@Get('/stats')
	async getStats(@Site() site, @Res() res) {
		res.redirect(site.statsPath)
	}

	@Post('/site/add')
	async addSite(@Site() site) {
		return 'ok'
	}

	@Delete('/site/delete')
	async deleteSite(@Site() site) {
		return 'ok'
	}

	@Put('/site/update')
	async updateSite(@Site() site) {
		return 'ok'
	}

	@Put('/site/status')
	async updateStatus(@Site() site) {
		return 'ok'
	}

	@Put('/site/upload')
	async uploadSite(@Body('site') site) {
		return await this.ApiService.uploadSite(site)
	}

	@Delete('/cache')
	async clearCache(@Site() site) {
		return 'ok'
	}

	@Post('/trans/db')
	async translateDb(@Site() site, @Body() params) {
		return await this.ApiService.translateDb(site.sitetplpath,params)
	}
}

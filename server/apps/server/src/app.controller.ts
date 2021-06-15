import { Body, Controller, Get,   Post,   Query,  Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { Site } from './decorator/site.decorator'
import { PagesGuard } from './guard/pages.guard';
import {pathName} from './pathName'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
	async index(@Site() site) {
		const {sitetplpath,url,host} = site
		const html = await this.appService.getHtml(sitetplpath, url, host)
		return html
	}

	@Get([
		'/Search/index.html',
		'/Search/index.html/page/:page'
	])
	async search(@Site() site) {
		const {sitetplpath,url,host} = site
		const html = await this.appService.getHtml(sitetplpath, url,host)
		return html
		}

	@Get([
		...pathName,
		'/content/:id',
		'/about/:scode',
		'/list/:scode',
		'/list/:scode/page/:page',
	])
	async about(@Site() site) {
		const {sitetplpath,url,host} = site
		const html = await this.appService.getHtml(sitetplpath, url,host)
		return html
	}

	@Get('/Do/area.html')
	async area(@Query('lg') lg:string, @Res() res: Response) {
		res.cookie('lg', lg, { maxAge: 100000000000 })
		res.redirect('/')
	}

	@Post('/Message/add.html')
	async addMsg(@Site() site,@Body() data:Object) {
		await this.appService.addMessage(site.sitetplpath, data)
		return `
		<script>
		alert('提交成功！')
		setTimeout(() => {
			history.go(-1)
		}, 1000);
		</script>
		`
	}

	
}

import {   Injectable } from '@nestjs/common';
import {minify} from 'html-minifier'
import {Parser} from './render/parser'
import {join} from 'path'
import * as fs from 'fs'
import {Db} from '../../../libs/db/db'
import {dbs} from '../../../libs/db/dbs'
@Injectable()
export class AppService {

	dbList:Db[] = []

	async getHtml(sitetplpath: string, url: string, host: string) {
		let html = '';

		if (process.env.IS_DEV === '1') {
			html = await this.render(sitetplpath,url,host)
		} else {
			const site = sitetplpath.match(/Sites\/([\w]+)/)[1]
			const lg = sitetplpath.match(/template\/([\w]+)/)[1]
			
			const cacheSitePath = join(__dirname, '../../../', 'cache', site)
			const cachePath =   join(cacheSitePath, lg + url.replace(/\//g, '_'))
			if (fs.existsSync(cachePath)) {
				const html = fs.readFileSync(cachePath, 'utf-8')
			
				return html
			}
			html = await this.createCache(cacheSitePath, cachePath, sitetplpath, url,host)
		}
	

		

		return html
	}

	async createCache(sitePath: string, cachePath: string, sitetplpath: string, url: string,host:string) {
		let html = await this.render(sitetplpath, url, host)
		
		if (!fs.existsSync(sitePath)) fs.mkdirSync(sitePath)
		try {
			html = minify(html,{removeComments: true,collapseWhitespace: true,minifyJS:true, minifyCSS:true})
		} catch (error) {
			return html
		}
		fs.writeFileSync(cachePath, html)
		return html
	}

	async render(sitetplpath: string, url: string,host:string): Promise<string> {
		const db = await dbs.createDb(sitetplpath)
		const parser = new Parser()
		console.log(url);
		const html = await parser.parse(sitetplpath, url, db,host)
    return html
	}
	
	async addMessage(sitetplpath: string,data:any) {
		const db = await dbs.createDb(sitetplpath)
		return await db.addMessage(data)
	}
}

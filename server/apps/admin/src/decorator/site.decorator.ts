import { createParamDecorator, HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs'
import * as path from 'path'
import * as dayjs from 'dayjs'
import * as fse from 'fs-extra'
type site = {
	site:string
	name: string
	create_time: string
	hosts: string[]
	status: number,
	visit:0
}

const addSite = (request,sites,sitesPath) => {
	const form = request.body
	const siteForm:site = {
			site: form.site,
			name: form.name,
			hosts: form.hosts.split(','),
			status: 1,
			create_time: dayjs().format('YYYY-MM-DD'),
			visit:0
	}
	const tplPath = path.join(__dirname,'../../../Sites/site-tpl')
	const sitePath = path.join(__dirname, `../../../Sites/${siteForm.site}`)

	if (sites.find(v => v.site === form.site) && form.isRemote) {
		return;
	}

	if (fs.existsSync(sitePath)) {
		throw new HttpException('网站已存在',403)
	}

		sites.push(siteForm)
		fs.writeFileSync(sitesPath, JSON.stringify(sites))
		fs.mkdirSync(sitePath)
		fse.copySync(tplPath,sitePath)
}

const deleteSite = (request,sites,sitesPath) => {
	const body = request.body
	let findSite = sites.findIndex(v => v.site === body.site)
	if (findSite === -1) {
		throw new HttpException('网站不存在',403)
	}
	sites.splice(findSite, 1)
	fs.writeFileSync(sitesPath, JSON.stringify(sites))
	const sitePath = path.join(__dirname, `../../../Sites/${body.site}`)
	if (!fs.existsSync(sitePath)) {
		throw new HttpException('网站不存在',403)
	}
	fse.removeSync(sitePath)
}

const updateSite = (request,sites,sitesPath) => {
	const form = request.body
	const site = sites.find(v => v.site === form.site)
	site.name = form.name
	site.hosts = form.hosts.split(',')
	fs.writeFileSync(sitesPath, JSON.stringify(sites))
}

const updateStatus = (request,sites,sitesPath) => {
	const form = request.body
	const site = sites.find(v => v.site === form.site)
	site.status = (site.status ? 0 : 1)
	fs.writeFileSync(sitesPath, JSON.stringify(sites))
}


export const Site = createParamDecorator((data, req) => {
	const sitesPath = path.join(__dirname, '../../../Sites/sites.json')
	const sitesJson = fs.readFileSync(sitesPath, 'utf-8')
	const sites: site[] = JSON.parse(sitesJson)
	const request = req.args[0]
	const headers = request.headers
	const url = request.url
	const origin = headers.origin.replace(/https*:\/\//,'')
	const rep = request._parsedUrl.pathname.replace('/api/', '') + 'Rep';
	const site = sites.find(v => v.hosts.find(x => x === origin))
	// console.log(headers,request.url,request.body,site);
	if (!site) {
		throw new HttpException('没有找到对应的网址',HttpStatus.NOT_FOUND)
	}
	
	let lg = headers.cookie?.match(/lg=([\w]+);?/)[1]
	lg = lg ? lg : 'null'
	const sitetplpath = `/Sites/${site.site}/template/${lg}`
	const statsPath = `/Sites/${site.site}/data/stats.json`
	if (request.url.includes('/site/add')) {
		addSite(request,sites,sitesPath)
	}
	else if (request.url.includes('/site/delete')) {
		deleteSite(request,sites,sitesPath)
	}
	else if (request.url.includes('/site/update')) {
		updateSite(request,sites,sitesPath)
	}
	else if (request.url.includes('/site/status')) {
		updateStatus(request,sites,sitesPath)
	}
	else if (request.method.toUpperCase() !== 'GET') {
		let p1 = path.join(__dirname, `../../../cache/${site.site}`)
		if (fs.existsSync(p1)) {
		fse.removeSync(p1)
		}
	}
	return {sitetplpath,url,rep,statsPath,origin,site:site.site};
});


import { createParamDecorator, HttpException } from '@nestjs/common';
import * as fs from 'fs'
import * as path from 'path'
import * as dayjs from 'dayjs'
import * as ipdb from '../../../../libs/ipdb'
import {pathMap} from '../pathName'

type site = {
	site:string
	name: string
	create_time: string
	hosts: string[]
	status: number
	visit:number
}

type Stats =
	{
		history:{
			date: string
			area:	{[propName: string] : number | string}
		}[]
		total: number
		
	}

const ipdbPath = path.join(__dirname,'../../../libs/ipdb/ipipfree.ipdb')
const City = new ipdb.City(ipdbPath);


const statsSite = (statsPath: string, req) => {
	if (!fs.existsSync(statsPath)) {
		fs.writeFileSync(statsPath,'{"history":[],"total":0}')
	}
	const statsJSON = fs.readFileSync(statsPath, 'utf-8')
	const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
	var m = City.findMap(ip, "CN");
	let country = m.country_name
	let city = m.city_name
	if (country && country !== '中国' && country !== '本机地址') {
		city = country
	}
	if (!city) {
		city = '其他'
	}

	const stats: Stats = JSON.parse(statsJSON)
	const today = dayjs().format('YYYY-MM-DD')
	let statsToday = stats.history.find(v => v.date === today)
	if (statsToday) {
		if (statsToday.area[city]) {
			statsToday.area[city] = statsToday.area[city] as number + 1
		} else {
			statsToday.area[city] = 1
		}
	} else {
		statsToday = {
			date: today,
			area: {
				[city]:1
			}
		}
		stats.history.push(statsToday)
	}
	stats.total++
	fs.writeFileSync(statsPath,JSON.stringify(stats))
}

export const Site = createParamDecorator((data, req) => {
	const sitesPath = path.join(__dirname, '../../../Sites/sites.json')
	const sitesJson = fs.readFileSync(sitesPath, 'utf-8')
	const sites: site[] = JSON.parse(sitesJson)
	const headers = req.args[0].headers
	let url = req.args[0].url
	Object.keys(pathMap).forEach((type:'list'|'content'|'about') => {
		pathMap[type].forEach((v) => {
			if (v.test(url)) {
				url = url.replace(v, (str, match) => {
					return str.replace(match,type)
				})
			}
		})
	})

	const host = headers.host
	const site = sites.find(v => v.hosts.find(x => x === host) && v.status)
	
	if (!site) {
		throw new HttpException('没有找到对应的网址',404)
	}
	site.visit++
	fs.writeFileSync(sitesPath, JSON.stringify(sites))
	let lg;
	if (headers.cookie && headers.cookie?.match(/lg=([\w]+);?/)) {
		lg = headers.cookie?.match(/lg=([\w]+);?/)[1]
	}
	lg = lg ? lg : 'null'
	const sitetplpath = `/Sites/${site.site}/template/${lg}`
	const statsPath = path.join(__dirname, `../../../Sites/${site.site}/data/stats.json`)
	statsSite(statsPath, req.args[0])
	
	return {sitetplpath,url,host,statsPath};
});

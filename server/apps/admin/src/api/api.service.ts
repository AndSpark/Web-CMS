import { HttpException, Injectable } from '@nestjs/common';
import { Db, Rep } from 'libs/db/db';
import { dbs } from 'libs/db/dbs';
import * as path from 'path';
import * as fs from 'fs';
import * as FtpDeploy from 'ftp-deploy';
import * as WebSocket from 'ws'
import * as fse from 'fs-extra'
import Translate from 'libs/translate';
import * as AdmZip from 'adm-zip-iconv'
import * as dayjs from 'dayjs';

interface ProductFile {
  productName: string;
  fileName: string;
}
interface ProductDir {
  name: string;
  dirs?: ProductDir[];
  files?: ProductFile[];
  scode: number;
  pcode: number;
}

@Injectable()
export class ApiService {
  async getDatas(rep: Rep, sitetplpath: string, query?: any) {
    const db = await dbs.createDb(sitetplpath);
    if (query) {
      return await db.getRepAllData(rep, query);
    }
    return await db.getRepAllData(rep);
  }

  // todo：添加标签时判断是否已存在
  async addDatas(rep: Rep, data: any, sitetplpath: string) {
    const db = await dbs.createDb(sitetplpath);
    const entity = await db.addRepData(rep, data);
    return entity;
	}
	

  async updateData(rep: Rep, data: any, sitetplpath: string) {
    const db = await dbs.createDb(sitetplpath);
    if (Array.isArray(data)) {
      return await Promise.all(
        data.map(async (v) => {
          return await db.updataRepData(rep, v.findOption, v.data);
        }),
      );
    }
    const entity = await db.updataRepData(rep, data.findOption, data.data);
    return entity;
  }

  async deleteData(rep: Rep, data: any, sitetplpath: string) {
    const db = await dbs.createDb(sitetplpath);
    if (Array.isArray(data)) {
      return await Promise.all(
        data.map(async (v) => {
          return await db.deleteRepData(rep, v);
        }),
      );
    }
    return await db.deleteRepData(rep, data);
	}
	
	async deleteArea(sitetplpath: string,acode:string) {
		const db = await dbs.createDb(sitetplpath);
		await db.deleteRepData( 'areaRep', {acode});
		await db.deleteRepData( 'conRep', {acode});
		await db.deleteRepData( 'sortRep', {acode});
		await db.deleteRepData( 'siteRep', {acode});
		await db.deleteRepData( 'comRep', {acode});
	}

  async getContent(
    findOption: {
      where: {
        mcode: string;
        title?: string;
        scode?: string;
        acode: string;
      };
      skip: number;
      take: number;
    },
    sitetplpath: string,
  ) {
    const db = await dbs.createDb(sitetplpath);
    return await db.getContentData(findOption);
  }

  async putContent(data: any, sitetplpath: string) {
    const db = await dbs.createDb(sitetplpath);
    return await db.putContentData(data);
  }

  async getStats(statsPath: string) {
    const JSON = fs.readFileSync(statsPath, 'utf-8');
    return JSON;
  }

  async uploadSite(site: string) {
    const ftpDeploy = new FtpDeploy();
    const config = {
      user: 'ftpuser',
      password: '23880678',
      host: '43.129.251.166',
      port: 21,
      localRoot: path.join(__dirname, '../../../Sites', site),
      remoteRoot: '/server/Sites/' + site,
      include: ['*'],
      exclude: ['config/**'],
      deleteRemote: false,
      forcePasv: true,
		};

	
		const wss = new WebSocket.Server({ port: parseInt(process.env.UPLOAD_WS_PORT) || 8084 })
		
		wss.on('connection', ws => {

			ftpDeploy
      .deploy(config)
			.then((res) => {
				ws.send('{"status":"success"}')
				wss.close()
			})
				.catch((err) => { ws.send("{status:'error',filename:err.message}");console.log(err);;wss.close()});
			
			ftpDeploy.on('uploading', function (data) {
				const res = {
					status: 'uploading',
					...data
				}
				const resJSON = JSON.stringify(res)
				ws.send(resJSON)
			});
			ftpDeploy.on('uploaded', function (data) {
				const res = {
					status: 'uploaded',
					...data
				}
				const resJSON = JSON.stringify(res)
				ws.send(resJSON)
			});
			ftpDeploy.on('upload-error', function (data) {
				const res = {
					status: 'error',
					...data
				}
				const resJSON = JSON.stringify(res)
				ws.send(resJSON)
				console.log(data);
				wss.close()
			});

		})
    
		
		return 'ok'
	}
	
	async translateDb(sitetplpath: string, params: {
		fromAcode:string,
		toAcode:string,
		fromLang:string,
		toLang:string,
	}) {
    const db = await dbs.createDb(sitetplpath);
		const translate = new Translate({
      from: params.fromLang,
      to: params.toLang,
		});

		let wss = new WebSocket.Server({port:Number(process.env.TRANS_WS_PORT) || 8085})
		wss.on('connection', async function connection(ws) {
			try {
				await db.transDb(params, translate, ws)
				wss.close()
			} catch (error) {
				wss.close()
			}
    })
		return '开始翻译'
	}

	async uploadBatch(sitetplpath: string, file: any, info: {
		site: string
		acode: string
		pcode: string
	}) {
		const db = await dbs.createDb(sitetplpath);
		const zipPath = path.join(__dirname, '../../..', file.path)
		const outPath = zipPath.replace(file.filename,'')
		var zip = new AdmZip(zipPath, "GBK");
		zip.extractAllTo(outPath, true)
		const proDir = path.join(outPath, 'product')
		await this.addProds(db, proDir, info.pcode, info.acode, info.site)
		fse.removeSync(proDir)
		return 'done'
	}

	async addProds(db: Db, dirPath: string, pcode: string, acode: string, site: string) {
		let a = Math.random()
		let proDir = fs.readdirSync(dirPath)
		let outPath = path.join(__dirname, '../../../', `/Sites/${site}/static/upload/image/`)
		await	proDir.reduce(async (p:Promise<void>,fileName, i) => {
				await p
				let fileDir = path.join(dirPath, fileName)
				let stats = fs.statSync(fileDir)
				const isFile = stats.isFile()
				if (isFile) {
					const {ext,name} = path.parse(fileName)
					const formatName = dayjs().format('YYYYMMDDHHmmss') + ((Math.random() * Math.pow(36, 6)) | 0).toString(36) + ext
					const imgBuffer = fs.readFileSync(fileDir)
					const imgPath = path.join(outPath, formatName)
					fs.writeFileSync(imgPath, imgBuffer)
					const con = db.conRep.create({
						title: name,
						acode: acode,
						scode: pcode,
						ico: `/Sites/${site}/static/upload/image/${formatName}`,
						pics: `/Sites/${site}/static/upload/image/${formatName}`,
					})
					await db.conRep.save(con)
				} else {
					const {name} = path.parse(fileName)
					const scode = (Number(await db.getLastSortScode()) + 1).toString()
					const sort = db.sortRep.create({
						name,
						scode,
						acode,
						pcode,
					})
					await db.sortRep.save(sort)
					await this.addProds(db,fileDir,scode,acode,site)
				}
			},undefined)
		
		
	}
	
}

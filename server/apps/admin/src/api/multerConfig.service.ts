import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MulterOptionsFactory, MulterModuleOptions } from '@nestjs/platform-express';
import { Request } from 'express';
import { diskStorage } from 'multer';
import * as fs from 'fs'
import * as path from 'path'
import * as dayjs from 'dayjs'
/**
 * 上传的文件配置服务
 */
@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      fileFilter(req: Request, file: any, cb: (error: Error, acceptFile: boolean) => void): void {
        // 需要调用回调函数 `cb`，
                // 并在第二个参数中传入一个布尔值，用于指示文件是否可接受
                // 如果要拒绝文件，上传则传入 `false`。如:
                // cb(null, false);
                // 如果接受上传文件，则传入 `true`。如:
                cb(null, true);
                // 出错后，可以在第一个参数中传入一个错误：
                // cb(new Error('I don\'t have a clue!'));
                // console.log(file.filename);
                // cb(null, false);
      },
      storage: diskStorage({
				destination: (req, file, cb) => {
					const sitesJson = fs.readFileSync(path.join(__dirname, '../../../Sites/sites.json'), 'utf-8')
					const sites = JSON.parse(sitesJson)
					const headers = req.headers
					const origin = headers.origin.replace(/https*:\/\//,'')
					const site = sites.find(v => v.hosts.find(x => x === origin))
					if (!site) {
						throw new HttpException('没有找到对应的站点',HttpStatus.NOT_FOUND)
					}
					const today = dayjs().format('YYYYMMDD')
					const { ext } = path.parse(file.originalname)
					let uploadPath;

					if (ext.match(/jpg|jpeg|png|gif/)) {
						uploadPath = `./Sites/${site.site}/static/upload/image/${today}`
					}  else {
						uploadPath = `./Sites/${site.site}/static/upload/file/${today}`
					}
					const dir = path.join(__dirname, '../../../', uploadPath)
					if (!fs.existsSync(dir)) {
						fs.mkdirSync(dir)
					}

          cb(null,uploadPath);
      },
				filename: (req, file, cb) => {

					const { ext } = path.parse(file.originalname)
					
					cb(null, dayjs().format('YYYYMMDDHHmmss') + ((Math.random() * Math.pow(36, 6)) | 0).toString(36) + ext);
					
      },
      })
    }
  }
}

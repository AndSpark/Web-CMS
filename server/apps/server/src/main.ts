import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import {join} from 'path'
import "reflect-metadata"
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
	app.use(cookieParser());
	app.useStaticAssets(join(__dirname, '../../../Sites'),{prefix:'/Sites/'})
	app.useStaticAssets(join(__dirname, '../../../static'),{prefix:'/static/'})
	app.useStaticAssets(join(__dirname, '../../../admin'),{prefix:'/admin/'})
	app.useStaticAssets(join(__dirname, '../../../adminleso'),{prefix:'/adminleso/'})
  await app.listen(process.env.SERVER_PORT || 8083,'0.0.0.0');
}

bootstrap();

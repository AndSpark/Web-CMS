import { NestFactory } from '@nestjs/core';
import { AdminModule } from './admin.module';
import {join} from 'path'
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AdminModule);
	app.enableCors();
	app.useStaticAssets(join(__dirname, '../../../Sites'),{prefix:'/Sites/'})
	app.useStaticAssets(join(__dirname, '../../../static'),{prefix:'/static/'})
	await app.listen(parseInt(process.env.ADMIN_PORT) || 8082, '0.0.0.0');
}
bootstrap();

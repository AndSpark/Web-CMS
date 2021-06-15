import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class PagesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const {url} = context.switchToHttp().getRequest();
		const reg = /\/(about|list|content)\/([0-9]+)(\.html|\/page\/([0-9]+)\.html)/
		const isPass = reg.test(url)
		if (isPass) {
			return true;			
		}
		throw new HttpException('没有找到对应的网址',HttpStatus.NOT_FOUND)
  }
}
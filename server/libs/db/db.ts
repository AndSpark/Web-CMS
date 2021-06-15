import {
  Connection,
  createConnection,
	DeepPartial,
  EntitySchema,
  FindOneOptions,
	FindOperator,
  getConnectionManager,
	In,
	Like,
	Repository,
	
} from 'typeorm';
import { join } from 'path';
import { Label } from './entities/label.entity';
import { ContentSortEntity } from './entities/content_sort.entity';
import { ContentEntity } from './entities/content.entity';
import { CompanyEntity } from './entities/company.entity';
import { SiteEntity } from './entities/site.entity';
import { SlideEntity } from './entities/slide.entity';
import { MessageEntity } from './entities/message.entity';
import { ExtfieldEntity } from './entities/extfield.entity';
import { AreaEntity } from './entities/area.entity';
import {UserEntity} from './entities/user.entity'
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';
import { htmlDecode } from '../common/tool';
import { HttpException } from '@nestjs/common';
import { ModelEntity } from './entities/model.entity';
import Translate from 'libs/translate';

interface ListOrder {
	istop?: 'DESC' | 'ASC' 
	isrecommend?: 'DESC' | 'ASC'
	isheadline?:'DESC' | 'ASC'
	sorting?:'DESC' | 'ASC'
	date?:'DESC' | 'ASC'
	id?:'DESC' | 'ASC'
}

export type Rep = 'areaRep' | 'conRep' | 'sortRep' | 'labelRep' | 'comRep' | 'siteRep' | 'slideRep' | 'msgRep' | 'extRep' | 'userRep' | 'conExtRep' | 'modelRep'

type TransParams = {
	fromAcode:string,
	toAcode:string,
	fromLang:string,
	toLang:string,
}

class Db {
	name:string;
  sitetplpath: string;
  connection: Connection;
  areaRep: Repository<AreaEntity>;
  conRep: Repository<ContentEntity>;
  sortRep: Repository<ContentSortEntity>;
  labelRep: Repository<Label>;
  comRep: Repository<CompanyEntity>;
  siteRep: Repository<SiteEntity>;
  slideRep: Repository<SlideEntity>;
  msgRep: Repository<MessageEntity>;
  extRep: Repository<ExtfieldEntity>;
	userRep:Repository<UserEntity>;
	modelRep:Repository<ModelEntity>
  conExtRep: Repository<any>;
	timeout: any;
	resetTime: number;

  constructor(sitetplpath: string) {
    this.sitetplpath = sitetplpath;
  }

   async linkDb(): Promise<void> {
    const sitePath = this.sitetplpath.match(/\/Sites\/.*?\//)[0];
    const name = sitePath.replace(/\/Sites\/|\//g, '');
    const dbPath = join(
      __dirname,
      '../../../',
      sitePath,
      'data/878490a6ab380cf5bb4e7c97387e6850.db',
    );
		this.name = name
    // 注意： 判断数据库断开连接不是根据getConnectionManager().has(name) ，而是根据 isConnected
    if (
      getConnectionManager().has(name) &&
      getConnectionManager().get(name).isConnected
    ) {
      this.connection = getConnectionManager().get(name);
		} else {
			this.connection = await createConnection({
				name,
				type: 'sqlite',
				database: dbPath,
				entities: [
					Label,
					ContentSortEntity,
					ContentEntity,
					CompanyEntity,
					SiteEntity,
					SlideEntity,
					MessageEntity,
					ExtfieldEntity,
					AreaEntity,
					UserEntity,
					ModelEntity
				],
				cache: {
					duration: 120000,
				},
			});
		}
		 await this.setContentExt(name, dbPath);
    this.areaRep = this.connection.getRepository(AreaEntity);
    this.conRep = this.connection.getRepository(ContentEntity);
    this.sortRep = this.connection.getRepository(ContentSortEntity);
    this.labelRep = this.connection.getRepository(Label);
    this.comRep = this.connection.getRepository(CompanyEntity);
    this.siteRep = this.connection.getRepository(SiteEntity);
    this.slideRep = this.connection.getRepository(SlideEntity);
		this.msgRep = this.connection.getRepository(MessageEntity);
		this.userRep = this.connection.getRepository(UserEntity);
		this.modelRep = this.connection.getRepository(ModelEntity)
	}
	
	async close() {
		await this.connection.close()
	}

  async getSite(acode: string) {
    const siteEntity = await this.siteRep.findOne({ where: {acode} });
    return siteEntity;
  }

  async getCompany(acode: string) {
    const companyEntity = await this.comRep.findOne({ where: {acode} });
    return companyEntity;
  }

  async getLabel(label: string) {
    const labelEntity = await this.labelRep.findOne({ where: { name: label } });
    return labelEntity;
	}
	
	async getLabels() {
		const labels = await this.labelRep.find()
		return labels
	}

	async addLabel(name: string,type: string,description: string) {
		const label = this.labelRep.create({
			name,
			type,
			description
		})
		
		return await this.labelRep.save(label)
	}

	async deleteLable(label: string) {
		return await this.labelRep.delete({name: label})
	}

	async updateLable(name: string,value: string) {
		const label = await this.labelRep.findOne({ name })
		label.value = value
		return await this.labelRep.save(label)
	}

  async getSort(scode: string) {
    const sortEntity = await this.sortRep.findOne({
      where: { scode, status: '1' },
    });
    return sortEntity;
  }

  async getSortList(scode: string) {
    const sortEntity = await this.getSort(scode);
    let pcode = sortEntity.pcode,
      sortList: ContentSortEntity[] = [sortEntity];
    while (pcode !== '0') {
      const pSort = await this.sortRep.findOne({
        where: { scode: pcode, status: '1' },
			});
			pcode = pSort.pcode
      sortList.unshift(pSort);
    }
    return sortList;
  }

  async getTopSort(scode: string) {
    const sortList = await this.getSortList(scode);
    return sortList[0];
  }

  async getParentSort(scode: string) {
		const sortList = await this.getSortList(scode);
		if(sortList.length === 1) return sortList[0]
    return sortList.reverse[1];
	}

	async getLastSortScode() {
		const sort = await this.sortRep.findOne({ order: { id: "DESC" } })
		return sort.scode
	}
	

  async getPosition(scode: string) {
    const sortList = await this.getSortList(scode);
    return sortList;
  }

  async getSubScodes(scode: string) {
    const subScodes = await this.sortRep.find({
			where: { pcode: scode, status: '1' },
			order:{sorting: 'ASC'}
    });
    return subScodes;
	}
	
	async findContentList(
		scode: string,
		keyword:string,
		order: ListOrder = {
			istop: 'DESC',
			isrecommend: 'DESC',
			isheadline:'DESC',
			sorting:'ASC',
			date:'DESC',
			id:'DESC' 
		},
  ) {
    let list = await this.conRep.find({
      order,
			where: {
				scode,
				status: '1',
				title:Like(`%${keyword}%`)
			},
		});

		const subSorts = await this.getSubScodes(scode)
		
		for (let i = 0; i < subSorts.length; i++){
			const subLists = await this.findContentList(subSorts[i].scode,keyword,order)
			list.push(...subLists)
		}

		return list
	}
	

  async getContentList(
    scode: string,
    num: number,
    start: number,
		order: ListOrder = {
			istop: 'DESC',
			isrecommend: 'DESC',
			isheadline:'DESC',
			sorting:'ASC',
			date:'DESC',
			id:'DESC' 
		},
		top:boolean,
    tags?: string[],
  ) {
    let where: FindOneOptions<ContentEntity>['where'] = [{ scode,status: '1' }];
    if (tags) {
      where = tags.map((v) => {
        return { tags: v, scode, status: '1' };
      });
    }
    let list = await this.conRep.find({
      order,
      where,
		});
		const subSorts = await this.getSubScodes(scode)
		if (subSorts && subSorts.length) {
			for (let i = 0; i < subSorts.length; i++){
				const subLists = await this.getContentList(subSorts[i].scode,num,0,order,false)
				list.push(...subLists)
			}
		}
		list.sort((a,b) => a.sorting - b.sorting)
		if (top) {
			list = list.slice(start, start + num)
		}
		return list
	}
	
	async getContentCount(
		scode: string,
    order: FindOneOptions<ContentEntity>['order'] | any,
    tags?: string[],
	) {
		let where: FindOneOptions<ContentEntity>['where'] = [{ scode }];
    if (tags) {
      where = tags.map((v) => {
        return { tags: v, scode, status: '1' };
      });
		}
		const list = await this.getContentList(scode,9999,0,order,true)
    const count = list.length
		return count
	}

  async getContent(id: number) {
    const content = await this.conRep.findOne({ where: { id, status: '1' } });
    return content;
  }
  // 单片详情
  async getAbout(scode: string) {
    const content = await this.conRep.findOne({
      where: { scode, status: '1' },
    });
    return content;
  }
  // 指定内容多图
  async getContentPics(id: number) {
    const content = await this.getContent(id);
    return content.pics;
  }

  async getContentPre(id: number) {
    const content = await this.getContent(id);
    const scode = content.scode;
    const pre = await this.getContent(id - 1);
    if (pre && pre.scode == scode) {
      return pre;
    }
    return null;
  }

  async getContentNext(id: number) {
    const content = await this.getContent(id);
    const scode = content.scode;
    const pre = await this.getContent(id + 1);
    if (pre && pre.scode == scode) {
      return pre;
    }
    return null;
	}
	
	async getSortContent(id: number, scode: string) {
		let sort = await this.conRep.findOne({ where: { id, scode } })
		if(!sort) sort= await this.conRep.findOne({ where: { id } })
		return sort
	}

  async getSlides(gid: number, number: number) {
    const slides = await this.slideRep.find({
      where: { gid },
      take: number,
    });
    return slides;
  }

  async getMessage(num: number, start: number, acode: string) {
    const messages = await this.msgRep.find({
      where: { acode },
      skip: start,
      take: num,
    });
    return messages;
  }

	async getConExp(contentid: number, name: string) {
		
		const conExp = await this.conExtRep.findOne({ where: { contentid } });
		const exp = await this.extRep.findOne({ where: { name } });
		let res: string;
		if (!conExp) {
			return ''
		}
    if (exp.type === '8') {
      res = htmlDecode(conExp[name]);
    } else {
      res = conExp[name];
		}
    return res;
  }

  async getDefaultArea() {
    const area = await this.areaRep.findOne({ where: { is_default: '1' } });
    return area;
  }

  async getAreaLanguage(acode: string) {
    const area = await this.areaRep.findOne({ where: { acode } });
    return area.name;
  }

	async setContentExt(name: string, dbPath: string) {
    this.extRep = this.connection.getRepository(ExtfieldEntity);
    const exts = await this.extRep.find();
    if (!exts) return;
    let SchemaOptions: EntitySchemaOptions<any> = {
      name: 'ay_content_ext',
      columns: {
        extid: {
          type: Number,
          primary: true,
          generated: true,
        },
        contentid: { type: Number },
      },
    };
    exts.map((v) => {
      SchemaOptions.columns[v.name] = { type: String };
    });
		const ContentExtSchema = new EntitySchema(SchemaOptions);
		try {
			await this.connection.close();
		} catch (error) {
			console.log('1--------------');
		}
		try {
			this.connection = await createConnection({
				name,
				type: 'sqlite',
				database: dbPath,
				entities: [
					ContentExtSchema,
					Label,
					ContentSortEntity,
					ContentEntity,
					CompanyEntity,
					SiteEntity,
					SlideEntity,
					MessageEntity,
					ExtfieldEntity,
					AreaEntity,
					UserEntity,
					ModelEntity
				],
				cache: {
					duration: 120000,
				},
			});
			this.conExtRep = this.connection.getRepository(ContentExtSchema);
			this.extRep = this.connection.getRepository(ExtfieldEntity);

		} catch (error) {
			try {
				await getConnectionManager().get(name).close()
			} catch (error) {
				console.log(error.message);
				console.log('-------------------');
			}
			this.connection = await createConnection({
				name,
				type: 'sqlite',
				database: dbPath,
				entities: [
					ContentExtSchema,
					Label,
					ContentSortEntity,
					ContentEntity,
					CompanyEntity,
					SiteEntity,
					SlideEntity,
					MessageEntity,
					ExtfieldEntity,
					AreaEntity,
					UserEntity,
					ModelEntity
				],
				cache: {
					duration: 120000,
				},
			});
			this.conExtRep = this.connection.getRepository(ContentExtSchema);
			this.extRep = this.connection.getRepository(ExtfieldEntity);
		}
    
  }

	async getTemplate(scode: string, id: number) {
		const sort = await this.getSort(scode)
		if (!sort) return null;
    const template = id
      ? sort.contenttpl
      : sort.listtpl;
    return template;
	}
	
	async getUser(username: string) {
		const user = await this.userRep.findOne({ where: { username } })
		return user
	}

	async getRepAllData(rep: Rep, query?: any) {
		//@ts-ignore
		return await this[rep].find({where:query})
	}

	async addRepData(rep: Rep, data:any) {
		const entity = this[rep].create(data)
		
		//@ts-ignore
		const afterInsert = await this[rep].save(entity)
		if (rep === 'sortRep' && data.mcode === '1') {
			const con = this.conRep.create({
				title: data.name,
				acode: data.acode,
				scode: data.scode,
			})
			await this.conRep.save(con)
		}
		//@ts-ignore

		return await this[rep].save(afterInsert)
	}

	async updataRepData(rep: Rep, findOption: Object, data: Object) {
		//@ts-ignore
		const entity = await this[rep].findOne(findOption)
		let mcode = entity.mcode
		Object.keys(data).forEach(key => {
			if (entity[key] === undefined) {
				return;
			}
			entity[key] = data[key]
			
		})
		if (rep === 'sortRep' && mcode !== '1' && entity.mcode === '1') {
			let con = this.conRep.create({
				title: entity.name,
				acode: entity.acode,
				scode: entity.scode,
			})
			await this.conRep.save(con)
		} else if (rep === 'sortRep' && mcode === '1' && entity.mcode !== '1') {
			let con = await this.conRep.findOne({ where: { scode: entity.scode } })
			if (con) {
				await this.conRep.delete(con.id)
			}
		}

		//@ts-ignore
		return await this[rep].save(entity)
	}

	async deleteRepData(rep: Rep, findOption: Object) {
		if (rep === 'sortRep') {
			let con = await this.sortRep.findOne(findOption)
			if (con.mcode === '1') {
				let content = await this.conRep.findOne({ where: { scode: con.scode } })
				if (content) {
					await this.conRep.delete(content.id)
				}
			}
		}
		//@ts-ignore
		return await this[rep].delete(findOption)
	}

	async getContentData(findOption:{
		where: {
			mcode: string;
			title?: string | FindOperator<string>;
			scode?: string | FindOperator<string>;
			acode:string
		}
		skip: number;
		take: number;
	}) {
		const start = findOption.skip
		const end = findOption.take
		delete findOption.skip
		delete findOption.take
		if (findOption.where.title) {
			findOption.where.title = Like(`%${findOption.where.title}%`)
		}
		if (findOption.where.scode) {
			delete findOption.where.mcode
			
			let [cons, count] = await this.conRep.findAndCount({ ...findOption, order: { sorting: 'ASC' } })

			let consList = cons.splice(start, end)
			return {
					list: consList,
					count
			}

		}

		const sorts = await this.sortRep.find({ where: { mcode: findOption.where.mcode }, order: { sorting: 'ASC' } })
		
		delete findOption.where.mcode
		
		const sortsScodes = sorts.map(v => v.scode)
		findOption.where.scode = In(sortsScodes)

		
		const [cts, count] = await this.conRep.findAndCount({ ...findOption, order: { sorting: 'ASC' } })

		let consList = cts.splice(start, end)

		return {
			list: consList,
			count
		}
	}
	
	async putContentData(data:DeepPartial<ContentEntity>) {
		let exts:any[] = Object.keys(data).filter(key => {
			if (key.includes('ext_')) {
				return true
			}
		})

		exts = exts.map(k => {
			const v = {
				key: k,
				value:data[k]
			}
			delete data[k]
			return v
		})

		const entity = this.conRep.create(data)
		const content = await this.conRep.save(entity)

		if (exts.length) {
			const conExt = await this.conExtRep.findOne({
				where: {
					contentid:content.id 
				}
			})
	
			exts.forEach(v => {
				conExt[v.key] = v.value
			})

			await this.conExtRep.save(conExt)
		}

		
	}

	async addMessage(data: any) {
		const entity = await this.msgRep.create(data)
		return await this.msgRep.save(entity)
	}

	

	async contentSortTrans( params: TransParams, translate: Translate) {
    let contentSortRep = this.sortRep
    let contentSort = await contentSortRep.find({
      where: { acode: params.fromAcode },
    });
		let { id: contentSortCount } = await contentSortRep.findOne({
      order: { id: 'DESC' },
    });
    contentSort = await Promise.all(
      contentSort.map(async (v) => {
        let name: string | Promise<string> = v.name;
        if (name) name = (await translate.trans(v.name))[0];
        v.name = name;
        v.id += contentSortCount;
        v.scode = (Number(v.scode) + contentSortCount).toString();
        if (v.pcode !== '0')
          v.pcode = (Number(v.pcode) + contentSortCount).toString();
        v.acode = params.toAcode;
        return v;
      }),
    );
    await contentSortRep.insert(contentSort);
    return contentSortCount
	}
	
	async contentTrans( params: TransParams, translate: Translate,contentSortCount:number) {
    let contentRep = this.conRep
    let content = await contentRep.find({
      where: { acode: params.fromAcode },
    });
		let { id: contentCount } = await contentRep.findOne({
      order: { id: 'DESC' },
		});
		
		let contentList = content.map(v => {
			return {
				oId: v.id,
				id:v.id + contentCount
			}
		})

    let content2 = await Promise.all(
			content.map(async (v) => {
        if (v.content) v.content = await translate.transDbHtml(v.content);
        if (v.title) v.title = (await translate.trans(v.title))[0];
        if (v.subtitle) v.subtitle = (await translate.trans(v.subtitle))[0];
				if (v.description) v.description = (await translate.trans(v.description))[0];
        v.id += contentCount;
        v.scode = (Number(v.scode) + contentSortCount).toString();
        v.acode = params.toAcode;
        return v;
      }),
		);
		
    await contentRep.insert(content2);
    return contentList
	}
	
	async companyTrans(params:TransParams,translate:Translate) {
    let companyRep = this.comRep
    let company = await companyRep.find({ where: { acode: params.fromAcode } })
    let { id: companyCount } = await companyRep.findOne({
      order: { id: 'DESC' },
    });
    company = await Promise.all(company.map(async v => {
      if (v.name) v.name = (await translate.trans(v.name))[0];
      if (v.address) v.address = (await translate.trans(v.address))[0];
      if (v.contact) v.contact = (await translate.trans(v.contact))[0];
      v.acode = params.toAcode
      v.id += companyCount
      return v
    }))
    await companyRep.insert(company)
	}
	
	async siteTrans(params:TransParams,translate:Translate) {
    let siteRep = this.siteRep
    let site = await siteRep.find({ where: { acode: params.fromAcode } })
    let siteCount  = await siteRep.count()
    site = await Promise.all(site.map(async v => {
      if (v.title) v.title = (await translate.trans(v.title))[0];
      if (v.subtitle) v.subtitle = (await translate.trans(v.subtitle))[0];
      if (v.keywords) v.keywords = (await translate.trans(v.keywords))[0];
      if (v.description) v.description = (await translate.trans(v.description))[0];
      v.acode = params.toAcode
      v.theme = params.toAcode
      v.id += siteCount
      return v
    }))
    await siteRep.insert(site)
	}
	
	async conExpTrans(translate: Translate,contentList:{oId:number,id:number}[]) {
		this.extRep = this.connection.getRepository(ExtfieldEntity);
		const exts = await this.extRep.find();
		if (!exts) return;
		let { extid: extsCount } = await this.conExtRep.findOne({
      order: { extid: 'DESC' },
    });
		let extList = await Promise.all(
			contentList.map(async (v) => {
				let ext = await this.conExtRep.findOne({ where: { contentid: v.oId } });
				if (ext) {
					await Promise.all(
						exts.map(async (x) => {
							if (!ext[x.name]) return;
							if (x.type === '8') {
								ext[x.name] = await translate.transDbHtml(ext[x.name]);
							} else {
								ext[x.name] = ext[x.name].replace(/<br>/g, '\n');
								ext[x.name] = (await translate.trans(ext[x.name])).join('<br>');
							}
						}),
					);
					ext.extid += extsCount;
					ext.contentid = v.id;
					return ext
				}
				return null
			})
		)
		extList = extList.filter(v => v!==null)
		await this.conExtRep.insert(extList);
	}

	async transDb(params: TransParams, translate: Translate, ws: any) {
		let stats = '正在翻译公司信息'
		let t = setInterval(() => {
			ws.send(`${stats} -- 有${translate.totalInstanceCount}个待翻译`)
		}, 1000)
		await this.companyTrans(params, translate)
		stats = '正在翻译站点信息'
		await this.siteTrans(params, translate)
		stats = '正在翻译分类信息'
		const contentSortCount = await this.contentSortTrans(params, translate)
		stats = '正在翻译文章内容'
		const contentList = await this.contentTrans(params, translate, contentSortCount)
		stats = '正在翻译额外字段'
		await this.conExpTrans(translate, contentList)
		clearInterval(t)
		ws.send('翻译完毕')
	}

	async addContent() {
		
	}
}

export { Db };

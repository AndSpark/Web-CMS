import { join } from 'path';
import * as fs from 'fs';
import { htmlDecode, replaceAsync } from '../../../../libs/common/tool';
import { Db } from '../../../../libs/db/db';
import { HttpException } from '@nestjs/common';
import { ContentSortEntity } from '../../../../libs/db/entities/content_sort.entity';
import * as dayjs from 'dayjs';

class Parser {
  db: Db;
  html: string;
  newHtml: string;
  acode: string;
  url: string;
  pageScode: string;
  pageId: number;
  currentPage: number;
  type: string;
  sitetplpath: string; // like /Sites/haina/template/en
  tplPath: string; // 目录路径
  pagerows: number; // 页面总数据条数
  pagecount: number; // 页面数
  searchKeyword: string;
  searchScode: string;
  search: string; //查询字符串
  host: string;

  async init(sitetplpath: string, url: string, db: Db, host: string) {
    this.sitetplpath = sitetplpath;
    this.url = url;
    this.db = db;
    this.host = host;
    this.currentPage = 1;
    let acode = this.sitetplpath.match(/template\/([\w]+)/)[1];
    // 初始化acode
    if (acode === 'null') {
      const area = await this.db.getDefaultArea();
      this.acode = area.acode;
      this.sitetplpath = this.sitetplpath.replace('null', area.acode);
    } else {
      this.acode = this.sitetplpath.match(/template\/([\w]+)/)[1];
    }
    this.tplPath = join(__dirname, '../../../', this.sitetplpath);

    // 对index页面
    if (this.url == '/') {
      this.type = 'index';
      const htmlPath = join(this.tplPath, 'index.html');
      this.html = fs.readFileSync(htmlPath, 'utf-8');
      return;
    }
    if (this.url.includes('/Search/index.html')) {
      this.type = 'search';
      this.search = this.url.match(/\?[\S]+/)[0];
      this.searchKeyword = this.url.match(/keyword=([^&]+)?&?/)[1];
      this.searchScode = this.url.match(/scode=([0-9]+)?&?/)[1];
      if (this.url.match(/page\/([0-9]+)\.html/))
        this.currentPage = Number(this.url.match(/page\/([0-9]+)\.html/)[1]);
      const htmlPath = join(this.tplPath, 'search.html');
      this.html = fs.readFileSync(htmlPath, 'utf-8');
      return;
    }

    const regUrl =
      /\/(content|about|list)\/([0-9]+)(\.html|\/page\/([0-9]+)\.html)/;
    const urlMatch = this.url.match(regUrl);
		this.type = urlMatch[1];
    try {
      switch (this.type) {
        case 'about':
          this.pageScode = urlMatch[2];
          this.pageId = (await this.db.getAbout(this.pageScode)).id;
          break;
        case 'list':
          this.pageScode = urlMatch[2];
          this.currentPage = urlMatch[4] ? parseInt(urlMatch[4]) : 1;
          break;
        case 'content':
          this.pageId = parseInt(urlMatch[2]);
          this.pageScode = (await this.db.getContent(this.pageId)).scode;
          break;
        default:
          break;
      }
      const template = await this.db.getTemplate(this.pageScode, this.pageId);
      const htmlPath = join(this.tplPath, template);
      this.html = fs.readFileSync(htmlPath, 'utf-8');
    } catch (error) {
      throw new HttpException('网址输入有误', 404);
    }
  }

  async parse(sitetplpath: string, url: string, db: Db, host: string) {
    await this.init(sitetplpath, url, db, host);
    this.parseInclude();
    await this.parseSite();
    await this.parseCompany();
    this.parseOther();
    await this.parseLabel();
    await this.parseSort();
    await this.parseContent();
    await this.parsePosition();
    await this.parseNav();
    await this.parseList();
    await this.parseSearch();
    await this.parseContentId();
    this.parsePage();
    await this.parsePics();
    await this.parseSlide();
    this.parseQrcode();
    this.parseLoop();
    this.parseIf();
    await this.changeUrl();
    return this.newHtml;
  }

  parseInclude() {
    const reg = /{include file=(inc\/[a-z]*\.html)}/g;
    this.newHtml = this.html.replace(reg, (match, file) => {
      const incPath = join(this.tplPath, file);
      let incFile = fs.readFileSync(incPath, 'utf-8');
      return incFile;
    });
  }

  async parseSite() {
    try {
      const reg = /\{lesocms:site([\w]+)(\s+[^}]+)?\}/g;
      this.newHtml = await replaceAsync(
        this.newHtml,
        reg,
        async (match: string, params: string) => {
          const site = await this.db.getSite(this.acode);
          let res = site[params];
          if (res) {
            return res;
          }
          switch (params) {
            case 'index':
              res = '/';
              break;
            case 'path':
              res = this.sitetplpath.replace(/\/template\/.+/, '');
              break;
            case 'language':
              res = await this.db.getAreaLanguage(this.acode);
              break;
            case 'tplpath':
              res = this.sitetplpath;
              break;
            default:
              return res;
          }
          return res;
        },
      );
    } catch (error) {
      throw new HttpException('parseSite Error:  ' + error.message, 500);
    }
  }

  async parseCompany() {
    try {
      const reg = /\{lesocms:company([\w]+)(\s+[^}]+)?\}/g;
      this.newHtml = await replaceAsync(
        this.newHtml,
        reg,
        async (match: string, params: string) => {
          const company = await this.db.getCompany(this.acode);
          return company[params];
        },
      );
    } catch (error) {
      throw new HttpException('parseCompany Error:  ' + error.message, 500);
    }
  }

  async parseLabel() {
    try {
      const reg = /{label:([\w]+)(\s+[^}]+)?}/g;
      this.newHtml = await replaceAsync(
        this.newHtml,
        reg,
        async (match: string, name: string) => {
          const labelEntity = await this.db.getLabel(name);
          if (labelEntity) {
            return labelEntity.value;
          }
          return match;
        },
      );
    } catch (error) {
      throw new HttpException('parseLabel Error:  ' + error.message, 500);
    }
  }

  async parseSort() {
    try {
      if (this.type.match(/index|search/)) {
        return (this.newHtml = this.newHtml.replace(
          /\{sort:(scode|tcode|scode)\}/g,
          '0',
        ));
      }
      if (!this.pageScode) return;

      const reg = /\{sort:([\w]+)(\s+[^}]+)?\}/g;
      const sortEntity = await this.db.getSort(this.pageScode);
      const pSort = await this.db.getParentSort(this.pageScode);
      const topSort = await this.db.getTopSort(this.pageScode);
      this.newHtml = await replaceAsync(
        this.newHtml,
        reg,
        async (match: string, params: string, params2: string) => {
          let res: string;
          let paramsFunc = {
            tcode() {
              res = topSort?.scode;
            },
            topname() {
              res = topSort?.name;
            },
            toplink() {
              res = topSort ? `/${this.type}/${topSort.scode}.html` : '/';
            },
            parentname() {
              res = pSort?.name;
            },
            parentlink() {
              res = pSort ? `/${this.type}/${pSort.scode}.html` : '/';
            },
            link() {
              res = sortEntity.outlink
                ? sortEntity.outlink
                : `/${this.type}/${sortEntity.scode}.html`;
            },
            type() {
              res = sortEntity.mcode === '1' ? '1' : '2';
            },
          };
          res = sortEntity[params];
          if (res !== undefined) {
            return res;
					}
					if (paramsFunc[params]) {
						paramsFunc[params]();
					}
					if (params2 && params2.match(/len=[0-9]+/)) {
						let len = params2.match(/len=[0-9]+/)[1]
						res = res.substr(0,Number(len))
					}
          return res;
        },
      );
    } catch (error) {
      throw new HttpException('parseSort Error:  ' + error.message, 500);
    }
  }

  async parseContent() {
    try {
      if (!this.pageId) return;
      const reg = /\{content:([\w]+)(\s+[^}]+)?\}/g;
      const conEntity = await this.db.getContent(this.pageId);
      const sort = await this.db.getSort(conEntity.scode);
      let subSort: ContentSortEntity;
      if (conEntity.subscode) {
        subSort = await this.db.getSort(conEntity.subscode);
      }
      this.newHtml = await replaceAsync(
        this.newHtml,
        reg,
        async (match: string, params: string, p2: string) => {
          let res: string;
          res = conEntity[params];
          p2 = p2 ? p2 : '';
          if (params === 'content') {
            res = htmlDecode(res);
          }
					if (params.includes('ext_')) {
						try {
							res = await this.db.getConExp(this.pageId, params);
							
						} catch (error) {
							res = match
						}
          }

          if (p2.includes('style=')) {
            let reg = /style=([Y-m-d]+)/;
            let style = p2.match(reg)[1];

            if (style === 'Y-m') {
              res = dayjs(res).format('YYYY-MM');
            } else if (style === 'Y-m-d') {
              res = dayjs(res).format('YYYY-MM-DD');
            }
          }
          if (res !== undefined) return res;
          const pre = await this.db.getContentPre(this.pageId);
          const next = await this.db.getContentNext(this.pageId);
          const parmasfunc = {
            sortname() {
              res = sort.name;
            },
            subsortname() {
              res = subSort.name;
            },
            sortlink() {
              return `/list/${sort.scode}.html`;
            },
            subsortlink() {
              return `/list/${subSort.scode}.html`;
            },
            precontent() {
              res = pre
                ? (res = `<a href="/content/${pre.id}.html">${pre.title}</a>`)
                : p2.includes('notext=')
                ? p2.match(/notext='([\S\s]+)?'/)[1]
                : '没有了';
            },
            prelink() {
              res = pre ? `/content/${pre.id}.html"` : 'javascript:;';
            },
            pretitle() {
              res = pre
                ? pre.title
                : p2.includes('notext=')
                ? p2.match(/notext='([\S\s]+)?'/)[1]
                : '没有了';
            },
            preico() {
              res = pre ? pre.ico : '';
            },
            nextcontent() {
              res = next
                ? `<a href="/content/${next.id}.html">${next.title}</a>`
                : p2.includes('notext=')
                ? p2.match(/notext='([\S\s]+)?'/)[1]
                : '没有了';
            },
            nextlink() {
              res = next ? `/content/${next.id}.html"` : 'javascript:;';
            },
            nexttitle() {
              res = next
                ? next.title
                : p2.includes('notext=')
                ? p2.match(/notext='([\S\s]+)?'/)[1]
                : '没有了';
            },
            nextico() {
              res = next ? next.ico : '';
            },
            isico() {
              const ico = conEntity.ico;
              return ico ? 1 : 0;
            },
					};
					parmasfunc[params] && parmasfunc[params]();
					if (p2 && p2.match(/len=[0-9]+/)) {
						let len = p2.match(/len=[0-9]+/)[1]
						res = res.substr(0,Number(len))
					}
          return res;
        },
      );
    } catch (error) {
      throw new HttpException('parseContent Error:  ' + error.message, 500);
    }
  }

  async parseNav() {
    try {
      const reg1 = /\{lesocms:nav(\s+[^}]+)?\}([\s\S]*?)\{\/lesocms:nav\}/g;
      const reg2 = /\[nav:([\w]+)(\s+[^\]]+)?\]/g;
      const reg3 = /lesocms:([0-9])+nav/g;
      const acode = this.acode;
      let deep = false;
      this.newHtml = await replaceAsync(
        this.newHtml,
        reg1,
        async (match: string, params: string, content: string) => {
          let parent = '0',
            num = 9999,
            res = '',
            db = this.db;
          if (params) {
            const numMatch = params.match(/\snum=([0-9]+)/);
            num = numMatch ? Number(numMatch[1]) : 9999;
            const parentMatch = params.match(/\sparent=([0-9]+)/);
            parent = parentMatch ? parentMatch[1] : '0';
          }
          const subSorts = (await this.db.getSubScodes(parent)).filter(
            (v, i) => i < num && v.acode === acode,
          );
          if (!subSorts) return res;
          for (let i = 0; i < subSorts.length; i++) {
            res += await replaceAsync(
              content,
              reg2,
              async (match2: string, params2: string,p2:string) => {
                let r = subSorts[i][params2];
                if (r !== undefined) return r;
                const params2Func = {
                  n() {
                    return i;
                  },
                  i() {
                    return i + 1;
                  },
                  link() {
                    return subSorts[i].outlink
                      ? subSorts[i].outlink
                      : `/${this.type() === '1' ? 'about' : 'list'}/${
                          subSorts[i].scode
                        }.html`;
                  },
                  type() {
                    return subSorts[i].mcode === '1' ? '1' : '2';
                  },
                  async soncount() {
                    const sons = await db.getSubScodes(subSorts[i].scode);
                    return sons.length;
                  },
                  async rows() {
                    const cons = await db.getContentList(
                      subSorts[i].scode,
                      9999,
                      0,
											{},
											true
                    );
                    return cons.length;
                  },
                };
								if (params2Func[params2]) {
									r = await params2Func[params2]();
								}
								if (p2 && p2.match(/len=[0-9]+/)) {
									let len = p2.match(/len=[0-9]+/)[1]
									r = r.substr(0,Number(len))
								}
                return r;
              },
            );
          }

          if (res.match(reg3)) {
            const reg4 = /([0-9])+nav/g;
            deep = true;
            res = res.replace(reg4, (match: string, n: string) => {
              if (Number(n) > 1) {
                let d;
                if (Number(n) - 1 === 1) {
                  d = '';
                } else {
                  d = Number(n) - 1;
                }
                return `${d}nav`;
              }
              return match;
            });
          }
          return res;
        },
      );
      if (deep) {
        await this.parseNav();
      }
    } catch (error) {
      throw new HttpException('parseNav Error:  ' + error.message, 500);
    }
  }

  async parseSorts() {
    try {
      const reg1 = /\{lesocms:sort(\s+[^}]+)?\}([\s\S]*?)\{\/lesocms:sort\}/g;
      const reg2 = /\[sort:([\w]+)(\s+[^\]]+)?\]/g;
      this.newHtml = await replaceAsync(
        this.newHtml,
        reg1,
        async (match: string, params: string, content: string) => {
          let scode = '0',
            res = '',
            db = this.db;
          if (params) {
            const scodeMatch = params.match(/\sscode=([0-9]+)/);
            scode = scodeMatch ? scodeMatch[1] : '0';
          }
          const subSorts = await this.db.getSubScodes(scode);
          if (!subSorts) return res;
          for (let i = 0; i < subSorts.length; i++) {
            res += await replaceAsync(
              content,
              reg2,
              async (match2: string, params2: string,p2:string) => {
                let r = subSorts[i][params2];
                if (r !== undefined) return r;
                const params2Func = {
                  n() {
                    return i;
                  },
                  i() {
                    return i + 1;
                  },
                  link() {
                    return subSorts[i].outlink
                      ? subSorts[i].outlink
                      : `/${this.type() === '1' ? 'about' : 'list'}/${
                          subSorts[i].scode
                        }.html`;
                  },
                  type() {
                    return subSorts[i].mcode === '1' ? '1' : '2';
                  },
                  async parentname() {
                    const parent = await db.getParentSort(subSorts[i].scode);
                    return parent.name;
                  },
                  async toprows() {
                    const t = await db.getTopSort(subSorts[i].scode);
                    const cons = await db.getContentList(t.scode, 9999, 0, {},true);
                    return cons.length;
                  },
                  async parentrows() {
                    const p = await db.getParentSort(subSorts[i].scode);
                    const cons = await db.getContentList(p.scode, 9999, 0, {},true);
                    return cons.length;
                  },
                  async rows() {
                    const cons = await db.getContentList(
                      subSorts[i].scode,
                      9999,
                      0,
											{},
											true
                    );
                    return cons.length;
                  },
                };
								if (params2Func[params2]) {
									
									r = await params2Func[params2]();
								}
								if (p2 && p2.match(/len=[0-9]+/)) {
									let len = p2.match(/len=[0-9]+/)[1]
									r = r.substr(0,Number(len))
								}
                return r;
              },
            );
          }
          return res;
        },
      );
    } catch (error) {
      throw new HttpException('parseSorts Error:  ' + error.message, 500);
    }
  }

  async parseList() {
    try {
      const reg1 = /\{lesocms:list(\s+[^}]+)?\}([\s\S]*?)\{\/lesocms:list\}/g;
      const reg2 = /\[list:([\w]+)(\s+[^\]]+)?\]/g;
      this.newHtml = await replaceAsync(
        this.newHtml,
        reg1,
        async (match: string, params: string, content: string) => {
          let scode = this.pageScode,
            num = 9999,
            order = {},
            tags = '',
            filter = '',
            start = 0,
            res = '',
						db = this.db;
          if (params) {
            const scodeMatch = params.match(/\sscode=([0-9]+)/);
            const numMatch = params.match(/\snum=([0-9]+)/);
            const startMatch = params.match(/\sstart=([0-9]+)/);
            const orderMatch = params.match(/\sorder='([\w\s,]+)'/);
            const tagsMatch = params.match(/\stags=([\w]+)/);
            const filterMatch = params.match(/\sfilter=([\w]+)/);
            scode = scodeMatch ? scodeMatch[1] : scode;
            num = numMatch ? Number(numMatch[1]) : num;
            start = (this.currentPage - 1) * num;
            if (startMatch) {
              start = Number(startMatch[1]);
            }
            tags = tagsMatch ? tagsMatch[1] : tags;
            filter = filterMatch ? filterMatch[1] : filter;

            if (orderMatch) {
              order = orderMatch[1].split(',').reduce((pre, cur) => {
                if (!cur.includes(' ')) {
                  pre[cur] = 'ASC';
                  return pre;
                }
                let res = cur.split(' ');
                pre[res[0]] = res[1].toUpperCase();
                return pre;
              }, {});
            }
					}
					const sort = await this.db.getSort(scode);
          const cons = (
            await this.db.getContentList(scode, num, start, order,true)
          )
          const counts = await this.db.getContentCount(scode, order);
          // if (scode === this.pageScode ) {
          //   this.pagerows = counts;
          //   this.pagecount = Math.ceil(counts / num);
          // }
					this.pagerows = counts;
					this.pagecount = Math.ceil(counts / num);

          if (!cons) return res;
          for (let i = 0; i < cons.length; i++) {
            res += await replaceAsync(
              content,
              reg2,
              async (match2: string, params2: string, p3: string) => {
                let r = cons[i][params2];
								if (params2.includes('ext_')) {
									try {
										r = await this.db.getConExp(cons[i].id, params2);
									} catch (error) {
										r = match2
									}
                }
                if (params2 === 'content') {
                  r = htmlDecode(r);
                }
                let lenReg = /\slen=([0-9]+)/;
								if (lenReg.test(p3)) {
                  let len = parseInt(p3.match(lenReg)[1]);
                  r = r.slice(0, len);
                }

                if (p3 && p3.includes('style=')) {
                  let reg = /style=([Y-m-d]+)/;
                  let style = p3.match(reg)[1];

                  if (style === 'Y-m') {
                    return dayjs(r).format('YYYY-MM');
                  } else if (style === 'Y-m-d') {
                    return dayjs(r).format('YYYY-MM-DD');
                  }
                }
                if (r !== undefined) return r;
                const params2Func = {
                  n() {
                    return i;
                  },
                  i() {
                    return i + 1;
                  },
                  link() {
                    return cons[i].outlink
                      ? cons[i].outlink
                      : `/content/${cons[i].id}.html`;
                  },
                  sortname() {
                    return sort.name;
                  },
                  async subsortname() {
                    const sort = await db.getSort(cons[i].subscode);
                    return sort.name;
                  },
                  sortlink() {
                    return `/list/${scode}.html`;
                  },
                  subsortlink() {
                    return `/list/${cons[i].subscode}.html`;
                  },
                  enclosuresize() {
                    return '未计算';
                  },
                  likeslink() {
                    return '';
                  },
                  opposelink() {
                    return '';
                  },
								};
								if (params2Func[params2]) {
									r = await params2Func[params2]();
								}
								if (p3 && p3.match(/len=[0-9]+/)) {
									let len = p3.match(/len=[0-9]+/)[1]
									r = r.substr(0,Number(len))
								}
                return r;
              },
            );
          }
          return res;
        },
      );
    } catch (error) {
      throw new HttpException('parseList Error:  ' + error.message, 500);
    }
  }

  async parseContentId() {
    try {
      const reg1 =
        /\{lesocms:content(\s+[^}]+)?\}([\s\S]*?)\{\/lesocms:content\}/g;
      const reg2 = /\[content:([\w]+)(\s+[^\]]+)?\]/g;
      this.newHtml = await replaceAsync(
        this.newHtml,
        reg1,
        async (match: string, params: string, content: string) => {
          const id = parseInt(params.match(/\sid=([0-9]+)/)[1]);
          const scode = params.match(/\sscode=([0-9]+)/)[1];
          let res = '',
            db = this.db;
          const contentEntity = await this.db.getSortContent(id, scode);
          const sort = await this.db.getSort(scode);
          if (!contentEntity) return res;
          res = await replaceAsync(
            content,
            reg2,
            async (match2: string, params2: string,p2:string) => {
              let r = contentEntity[params2];
              if (params2 === 'content') {
                r = htmlDecode(r);
              }
							if (params2.includes('ext_')) {
								try {
									r = await this.db.getConExp(contentEntity.id, params2);
								} catch (error) {
									r = match2
								}
              }
              if (r !== undefined) return r;
              const params2Func = {
                link() {
                  return contentEntity.outlink
                    ? contentEntity.outlink
                    : `/content/${contentEntity.id}.html`;
                },
                sortname() {
                  return sort.name;
                },
                async subsortname() {
                  const sort = await db.getSort(contentEntity.subscode);
                  return sort.name;
                },
                sortlink() {
                  return `/list/${contentEntity.scode}.html`;
                },
                subsortlink() {
                  return `/list/${contentEntity.subscode}.html`;
                },
                enclosuresize() {
                  return '未计算';
                },
                likeslink() {
                  return '';
                },
                opposelink() {
                  return '';
                },
              };
							if (params2Func[params2]) {
									
								r = await params2Func[params2]();
							}
							if (p2 && p2.match(/len=[0-9]+/)) {
								let len = p2.match(/len=[0-9]+/)[1]
								r = r.substr(0,Number(len))
							}
              return r;
            },
          );
          return res;
        },
      );
    } catch (error) {
      throw new HttpException('parseContentId Error:  ' + error.message, 500);
    }
  }

  parsePage() {
    try {
      // if (!this.pagerows && this.pagerows !== 0) return;
      const reg = /\{page:([\w]+)\}/g;
      const search = this.search;
      const current = this.currentPage;
      const scode = this.pageScode ? this.pageScode : this.searchScode;
      const type = this.searchScode ? 'search' : 'list';
      const count = this.pagecount;
			const rows = this.pagerows;
			
      this.newHtml = this.newHtml.replace(
        reg,
        (match: string, params: string) => {
          const paramsFunc = {
            bar() {
              const index = this.index();
              const last = this.last();
              const pre = this.pre();
              const next = this.next();
              const status = this.status();
              const numbar = this.numbar();
              return `
							<span class='page-status'>${status}</span>
							<span class='page-index'><a href='${index}'>首页</a></span>
							<span class='page-pre'><a href='${pre}'>前一页</a></span>
							<span class='page-numbar'>
							${numbar}
							</span>
							<span class='page-next'><a href='${next}'>后一页</a></span>
							<span class='page-last'><a href='${last}'>尾页</a></span>
							`;
            },
            current() {
              if (current > count) {
                return count;
              } else {
                return current;
              }
            },
            count() {
              return count;
            },
            rows() {
              return rows;
            },
            index() {
              if (type === 'search') {
                return '/Search/index.html' + search;
              }
              return `/list/${scode}/page/1.html`;
            },
            pre() {
              const current = this.current();
              if (current > 1) {
                if (type === 'search') {
                  return `/Search/index.html/page/${current - 1}.html` + search;
                }
                return `/list/${scode}/page/${current - 1}.html`;
              } else {
                return 'javascript:;';
              }
            },
            next() {
              const current = this.current();
              if (current < count) {
                if (type === 'search') {
                  return `/Search/index.html/page/${current + 1}.html` + search;
                }
                return `/list/${scode}/page/${current + 1}.html`;
              } else {
                return 'javascript:;';
              }
            },
            last() {
              if (type === 'search') {
                return (
                  `/Search/index.html/page/${count ? count : 1}.html` + search
                );
              }
              return `/list/${scode}/page/${count ? count : 1}.html`;
            },
            status() {
              return `共${count}条 当前${this.current()}/${count}页`;
            },
            numbar() {
              let res = '';
              const current = this.current();
              for (let i = 1; i - 1 < count; i++) {
                if (current === i) {
                  if (type === 'search') {
                    res += `
										<a href="/Search/index.html/page/${i}.html${search}" class="page-num page-num-current">${i}</a>
										`;
                  } else {
                    res += `
										<a href="/list/${scode}/page/${i}.html" class="page-num page-num-current">${i}</a>
										`;
                  }
                } else {
                  if (type === 'search') {
                    res += `
								<a href="/Search/index.html/page/${i}.html${search}" class="page-num ">${i}</a>
								`;
                  } else {
                    res += `
								<a href="/list/${scode}/page/${i}.html" class="page-num ">${i}</a>
								`;
                  }
                }
              }
              return res;
            },
            selectbar() {
              let current = this.current();
              let res = '<select onchange="changepage(this)" lay-ignore> ';
              for (let i = 1; i - 1 < count; i++) {
                if (current === i) {
                  res += `
									<option value="${i}" selected="selected">跳到${i}页</option>
									`;
                } else {
                  res += `
								<option value="${i}">跳到${i}页</option>
								`;
                }
							}
							res += ' </select>'
              if (type === 'search') {
                res += `<script>function changepage(tag){window.location.href="/Search/index.html/page/"+tag.value+".html${search}";}</script>`;
              } else {
                res += `<script>function changepage(tag){window.location.href="/list/${scode}/page/"+tag.value+".html";}</script>`;
              }

              return res;
            },
          };
          return paramsFunc[params]();
        },
      );
		} catch (error) {
			console.log('parsePage Error:  ' + error);
			return;
    }
  }

  async parsePics() {
    try {
      const reg = /\{lesocms:pics(\s+[^}]+)?\}([\s\S]*?)\{\/lesocms:pics\}/g;
      const reg2 = /\[pics:([\w]+)(\s+[^\]]+)?\]/g;
      this.newHtml = await replaceAsync(
        this.newHtml,
        reg,
        async (match: string, params: string, text: string) => {
          const reg_id = /\sid=([0-9]+)/;
          const reg_num = /\snum=([0-9]+)/;
          if (!reg_id.test(params)) return match;
          let num = 9999;
          const id = parseInt(params.match(reg_id)[1]);
          if (reg_num.test(params)) {
            num = parseInt(params.match(reg_num)[1]);
          }
					const picsStr = await this.db.getContentPics(id);
          const pics = picsStr.split(',').filter((v, i) => i < num);
          let res = '';
          for (let i = 0; i < pics.length; i++) {
            res += text.replace(reg2, (match: string, params: string) => {
              const paramsFunc = {
                get n() {
                  return i;
                },
                get i() {
                  return i + 1;
                },
                get src() {
                  return pics[i];
                },
              };
              return paramsFunc[params];
            });
          }
          return res;
        },
      );
    } catch (error) {
      throw new HttpException('parsePics Error:  ' + error.message, 500);
    }
  }

  async parseSlide() {
    try {
      const reg = /\{lesocms:slide(\s+[^}]+)?\}([\s\S]*?)\{\/lesocms:slide\}/g;
      const reg2 = /\[slide:([\w]+)(\s+[^\]]+)?\]/g;
      this.newHtml = await replaceAsync(
        this.newHtml,
        reg,
        async (match: string, params: string, text: string) => {
          const reg_gid = /\sgid=([0-9]+)/;
          const reg_num = /\snum=([0-9]+)/;
          if (!reg_gid.test(params)) return match;
          let num = 5;
          const gid = parseInt(params.match(reg_gid)[1]);
          if (reg_num.test(params)) {
            num = parseInt(params.match(reg_num)[1]);
          }
          const picsStr = await this.db.getSlides(gid, num);
          const pics = picsStr.map((v) => v.pic);
          let res = '';
          for (let i = 0; i < pics.length; i++) {
            res += text.replace(reg2, (match: string, params: string) => {
              const paramsFunc = {
                get n() {
                  return i;
                },
                get i() {
                  return i + 1;
                },
                get src() {
                  return pics[i];
                },
                get id() {
                  return picsStr[i].id;
                },
                get link() {
                  return picsStr[i].link;
                },
                get title() {
                  return picsStr[i].title;
                },
                get subtitle() {
                  return picsStr[i].subtitle;
                },
              };
              return paramsFunc[params];
            });
          }
          return res;
        },
      );
    } catch (error) {
      throw new HttpException('parseSlide Error:  ' + error.message, 500);
    }
  }

  async parseSearch() {
    if (this.type !== 'search') return;
    try {
      const reg1 =
        /\{lesocms:search(\s+[^}]+)?\}([\s\S]*?)\{\/lesocms:search\}/g;
      const reg2 = /\[search:([\w]+)(\s+[^]]+)?\]/g;
      this.newHtml = await replaceAsync(
        this.newHtml,
        reg1,
        async (match: string, params: string, content: string) => {
          let scode = this.searchScode,
            keyword = this.searchKeyword,
            num = 9999,
            order = {},
            tags = '',
            filter = '',
            start = 0,
            res = '',
            db = this.db;
          if (params) {
            const scodeMatch = params.match(/\sscode=([0-9]+)/);
            const numMatch = params.match(/\snum=([0-9]+)/);
            const startMatch = params.match(/\sstart=([0-9]+)/);
            const orderMatch = params.match(/\sorder='([\w\s,]+)'/);
            const tagsMatch = params.match(/\stags=([\w]+)/);
            const filterMatch = params.match(/\sfilter=([\w]+)/);
            scode = scodeMatch ? scodeMatch[1] : scode;
            num = numMatch ? Number(numMatch[1]) : num;
            start = (this.currentPage - 1) * num;
            if (startMatch) {
              start = Number(startMatch[1]);
            }
            tags = tagsMatch ? tagsMatch[1] : tags;
            filter = filterMatch ? filterMatch[1] : filter;

            if (orderMatch) {
              order = orderMatch[1].split(',').reduce((pre, cur) => {
                if (!cur.includes(' ')) {
                  pre[cur] = 'ASC';
                  return pre;
                }
                let res = cur.split(' ');
                pre[res[0]] = res[1].toUpperCase();
                return pre;
              }, {});
            }
          }

          const sort = await this.db.getSort(scode);
          const total = await this.db.findContentList(scode, keyword, order);

          const cons = total.filter(
            (v, i) => i >= start && i < this.currentPage * num,
          );
          const counts = total.length;
          this.pagerows = counts;
          this.pagecount = Math.ceil(counts / num);
          if (!cons) return res;
          for (let i = 0; i < cons.length; i++) {
            res += await replaceAsync(
              content,
              reg2,
              async (match2: string, params2: string, p3: string) => {
                let r = cons[i][params2];
								if (params2.includes('ext_')) {
									try {
										r = await this.db.getConExp(cons[i].id, params2);
										
									} catch (error) {
										r = match2
									}
                }
                if (params2 === 'content') {
                  r = htmlDecode(r);
                }
                let lenReg = /\slen=([0-9]+)/;
                if (lenReg.test(p3)) {
                  let len = parseInt(p3.match(lenReg)[1]);
                  r = r.slice(0, len);
                }
                if (r !== undefined) return r;
                const params2Func = {
                  n() {
                    return i;
                  },
                  i() {
                    return i + 1;
                  },
                  link() {
                    return cons[i].outlink
                      ? cons[i].outlink
                      : `/content/${cons[i].id}.html`;
                  },
                  sortname() {
                    return sort.name;
                  },
                  async subsortname() {
                    const sort = await db.getSort(cons[i].subscode);
                    return sort.name;
                  },
                  sortlink() {
                    return `/list/${scode}.html`;
                  },
                  subsortlink() {
                    return `/list/${cons[i].subscode}.html`;
                  },
                  enclosuresize() {
                    return '未计算';
                  },
                  likeslink() {
                    return '';
                  },
                  opposelink() {
                    return '';
                  },
								};
								if (params2Func[params2]) {
									r = await params2Func[params2]();
									
								}
                return r;
              },
            );
          }
          return res;
        },
      );
    } catch (error) {
      throw new HttpException('parseList Error:  ' + error.message, 500);
    }
  }

  parseOther() {
    try {
      const reg = /\{lesocms:([\w]+)\}/g;
      const keyword = this.searchKeyword;
      const url = this.host + this.url;
      this.newHtml = this.newHtml.replace(
        reg,
        (match: string, params: string, params2: string) => {
          const paramsFunc = {
            get lgpath() {
              return '/Do/area.html';
            },
            get scaction() {
              return '/Search/index.html';
            },
            get keyword() {
              return keyword;
            },
            get msgaction() {
              return '/Message/add.html';
            },
            get httpurl() {
              return url;
            },
          };
          if (paramsFunc[params]) {
            return paramsFunc[params];
          }
          return match;
        },
      );
    } catch (error) {
      throw new HttpException('parseOther Error:  ' + error.message, 500);
    }
  }

  parseQrcode() {
    try {
      const reg = /\{lesocms:qrcode(\s+[^}]+)?\}/g;
      this.newHtml = this.newHtml.replace(
        reg,
        (match: string, params: string) => {
          const m = params.match(/string=(.+)/);
          if (m) {
            return `<img src="http://qr.kegood.com/?m=2&e=L&p=5&url=${m[1]}" class="qrcode" >`;
          } else {
            return '';
          }
        },
      );
    } catch (error) {
      throw new HttpException('parseQRCODE Error:  ' + error.message, 500);
    }
  }

  parseIf() {
    try {
      const reg = /\{lesocms:if\(([^}^\$]+)\)\}([\s\S]*?)\{\/lesocms:if\}/g;
      const reg2 = /lesocms:([0-9])+if/g;
      let deep = false;
      this.newHtml = this.newHtml.replace(
        reg,
        (match: string, params: string, content: string) => {
          let isTrue = eval(params),
            res = '';
          const reg_content = /([\s\S]*)?\{else\}([\s\S]*)?/;
          if (reg_content.test(content)) {
            const trueContent = content.match(reg_content)[1];
            const falseContent = content.match(reg_content)[2];
            if (isTrue) {
              res = trueContent;
            } else {
              res = falseContent;
            }
          } else {
            if (isTrue) {
              res = content;
            }
          }
          if (reg2.test(res)) {
            deep = true;
            const reg3 = /([0-9])+(if|else)/g;
            deep = true;
            res = res.replace(reg3, (match: string, n: string) => {
              if (Number(n) > 1) {
                let d,t;
                if (Number(n) - 1 === 1) {
                  d = '';
                } else {
                  d = Number(n) - 1;
								}
								t = match.includes('if') ? 'if' :'else'
                return `${d+t}`;
              }
              return match;
            });
          }
          return res;
        },
      );
      if (deep) {
        this.parseIf();
      }
    } catch (error) {
      throw new HttpException('parseIf Error:  ' + error.message, 500);
    }
  }

  parseLoop() {
    try {
      const reg = /\{lesocms:loop(\s+[^}]+)?\}([\s\S]*?)\{\/lesocms:loop\}/;
      this.newHtml = this.newHtml.replace(
        reg,
        (match: string, params: string, content: string) => {
          let start: number,
            end: number,
            res = '';
          try {
            start = parseInt(params.match(/\sstart=([0-9]+)/)[1]);
            end = parseInt(params.match(/\send=([0-9]+)/)[1]);
            let index = 0;
            for (let i = start; i <= end; i++) {
              index++;
              res += content.replace(
                /\[loop:([\w]+)\]/g,
                (match2: string, params2: string) => {
                  if (params2 === 'i') {
                    return i.toString();
                  }
                  if (params2 === 'index') {
                    return index.toString();
                  }
                  return '';
                },
              );
            }
            return res;
          } catch (error) {
            return res;
          }
        },
      );
    } catch (error) {
      throw new HttpException('parseLoop Error:  ' + error.message, 500);
    }
  }

  async parsePosition() {
    try {
      if (!this.pageScode) return;
      const reg = /\{lesocms:position(\s+[^}]+)?\}/g;
      const sort = await this.db.getPosition(this.pageScode);
      this.newHtml = this.newHtml.replace(
        reg,
        (match: string, params: string) => {
          let separator = ' >> ',
            separatoricon,
            indextext = '首页',
            indexicon;
          if (params) {
            if (params.includes('separator')) {
              separator = params.match(/\sseparator=([\S]+)/)[1];
            }
            if (params.includes('separatoricon')) {
              separatoricon = params.match(/\sseparatoricon=([\S]+)/)[1];
              separator = `<i class="${separatoricon}"></i>`;
            }
            if (params.includes('indextext')) {
              indextext = params.match(/\sindextext=([\S]+)/)[1];
            }
            if (params.includes('indexicon')) {
              indexicon = params.match(/\sindexicon=([\S]+)/)[1];
              indextext = `<i class="${indexicon}"></i>`;
            }
          }

          const position = sort.reduce((pre, cur) => {
            const name = cur.name;
            let type: string;
            if (this.type === 'content') {
              type = 'list';
            } else {
              type = this.type;
            }
            const link = cur.outlink
              ? cur.outlink
              : `/${type}/` + cur.scode + '.html';

            const a = `<a href="${link}">${name}</a>`;
            pre = pre + separator + a;
            return pre;
          }, `<a href="/">${indextext}</a>`);

          return position;
        },
      );
    } catch (error) {
      throw new HttpException('parsePosition Error:  ' + error.message, 500);
    }
  }

  async changeUrl() {
    let html = this.newHtml;

    html = await replaceAsync(
      html,
      /content\/([0-9]+)/g,
			async (str: string, id: string) => {
				try {
					const content = await this.db.getContent(Number(id));
					const sort = await this.db.getSort(content.scode);
					const filename = sort.filename;

					if (!filename) {
						return str;
					}
					return str.replace('content', filename + '/item');	
				} catch (error) {
					return str
				}

      },
    );
    html = await replaceAsync(
      html,
      /list\/([0-9]+)/g,
			async (str: string, scode: string) => {
				try {
					const sort = await this.db.getSort(scode);
					const filename = sort.filename;
					if (!filename) {
						return str;
					}
					return str.replace('list', filename);
				} catch (error) {
					return str
				}

      },
    );
    html = await replaceAsync(
      html,
      /about\/([0-9]+)/g,
      async (str: string, scode: string) => {
        try {
          let sort = await this.db.getSort(scode);
          const filename = sort.filename;
          if (!filename) {
            return str;
          }
          return str.replace('about', filename);
        } catch (error) {
          return str;
        }
      },
    );

    this.newHtml = html;
  }
}

export { Parser };

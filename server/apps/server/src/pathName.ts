export const pathName = [
  '/product/:scode',
  '/product/item/:id',
  '/download/:scode',
  '/download/item/:id',
  '/contact/:scode',
  '/news/:scode',
  '/news/item/:id',
  '/honor/:scode',
  '/honor/item/:id',
  '/plant/:scode',
  '/plant/item/:id',
  '/culture/:scode',
  '/company/:scode',
  '/about/:scode',
  '/product/:scode/page/:page',
  '/download/:scode/page/:page',
  '/honor/:scode/page/:page',
  '/plant/:scode/page/:page',
	'/news/:scode/page/:page',
	'/message/:scode'
];

export const pathMap = 
  {
    list: [
      /\/(product)\/[0-9]+/,
      /\/(download)\/[0-9]+/,
      /\/(news)\/[0-9]+/,
      /\/(honor)\/[0-9]+/,
      /\/(plant)\/[0-9]+/,
			/\/(product)\/[0-9]+\/page/,
      /\/(download)\/[0-9]+\/page/,
      /\/(news)\/[0-9]+\/page/,
      /\/(honor)\/[0-9]+\/page/,
      /\/(plant)\/[0-9]+\/page/,
    ],
	content: [
		/\/(product\/item)\/[0-9]+/,
		/\/(download\/item)\/[0-9]+/,
		/\/(news\/item)\/[0-9]+/,
		/\/(honor\/item)\/[0-9]+/,
		/\/(plant\/item)\/[0-9]+/,
    ],
    about: [
      /(contact)/,
      /(culture)/,
      /(company)/,
			/(about)/,
			/(message)/
    ],
  }

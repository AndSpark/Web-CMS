import axios from './axios'

export interface CreateContentForm {
	acode: string
	scode: string
	subscode: string
	title: string
	titlecolor: string
	subtitle: string
	filename: string
	author: string
	source: string
	outlink: string
	date: string
	ico: string
	pics: string
	content: string
	tags: string
	enclosure: string
	keywords: string
	description: string
	sorting: number
	status: string
	istop: string
	isrecommend: string
	isheadline: string
	visits: number
	likes: number
	oppose: number
	[propName: string]:string | number
}

export interface Content extends CreateContentForm {
	id: number
}

export interface ContentFindOption {
	where: {
		mcode: string
		title?: string
		scode?: string
		acode:string
	}
	skip?: number
	take?: number
}

function _getContent(data: ContentFindOption) {
	return axios({method:'post', url: 'con', data })
}

function _getContentItem(id: number) {
	return axios({method:'get', url:'con',params: {id}})
}

function _putContent(data: CreateContentForm | Content | Content[]) {
	return axios({method:'put', url:'con',data})
}

function _deleteContent(data: {id:number} |  {id:number}[]) {
	return axios({ url:'con',method:'DELETE',data})
}

export { _getContent,_getContentItem,_putContent,_deleteContent }

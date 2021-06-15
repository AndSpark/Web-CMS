import axios from './axios'

export type extForm = {
	id?: number
	mcode: string
	name: string
	type: string
	value: string
	description: string
	sorting:number
}

function _getContentExt(contentid: number ) {
	return axios({ url:'conExt',params:{contentid}})
	
}

function _getExtField(){
	return axios({ url:'ext'})
}

function _addExt(data:extForm) {
	return axios({ url:'ext',method:'POST',data})
}

function _deleteExt(data: {id:number} |  {id:number}[]) {
	return axios({ url:'ext',method:'DELETE',data})
}


export {
	_getExtField,
	_addExt,
	_deleteExt,
	_getContentExt
}
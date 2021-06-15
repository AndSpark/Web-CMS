import axios from './axios'

type areaForm = {
	name: string
	acode: string
	is_default: string
}

function _getArea(){
	return axios({ url:'area'})
}

function _addArea(data:areaForm) {
	return axios({ url:'area',method:'POST',data})
}

function _deleteArea(data: {acode:string}) {
	return axios({ url:'area',method:'DELETE',data})
}


export {
	_getArea,
	_addArea,
	_deleteArea
}
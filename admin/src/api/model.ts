import axios from './axios'

type Data = {
	name: string,
	type: string,
	listtpl: string,
	contenttpl: string,
	status: string
}

function _getModels() {
	return axios({
		url:'model'
	})
}

function _addModel(
	data: Data
) {
	return axios({
		method:'POST',
		url: 'model',
		data
	})
}

function _updateModel(
	data: {
		findOption: {name:string},
		data:Data
	}
) {
	return axios({
		method: 'PUT',
		url: 'model',
		data
	})
}

function _deleteModel(name: string) {
	return axios({
		method: 'DELETE',
		url: 'model',
		data:{name}
	})
}


export {
	_getModels,
	_addModel,
	_updateModel,
	_deleteModel
}
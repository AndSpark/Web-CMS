import axios from './axios'

function _getLabel() {
	return axios({
		url:'label'
	})
}

function _addLabel(name:string,type:string,description:string) {
	return axios({
		url: 'label',
		method: 'POST',
		data: {
			name,
			type,
			description
		}
	})
}

function _updateLabel(name: string,value:string) {
	return axios({
		method: 'PUT',
		url: 'label',
		data: {
			findOption:{name},
			data: {
				value,
			}
		}
	})
}

function _deleteLabel(name: string) {
	return axios({
		method: 'DELETE',
		url: 'label',
		data:{name}
	})
}

export {
	_getLabel,
	_addLabel,
	_updateLabel,
	_deleteLabel
}
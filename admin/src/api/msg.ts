import axios from './axios'


function _getMsg(){
	return axios({ url:'msg'})
}

function _deleteMsg(id:number) {
	return axios({method:'delete',url:'msg',data:{id}})
	
}

export {
	_getMsg,
	_deleteMsg
}
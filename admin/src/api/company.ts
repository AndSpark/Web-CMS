import axios from './axios'

type Data = {
	findOption: {
		id:number
	},
	data: {
		id:number
		acode: string
		address: string
		blicense: string
		contact: string
		email: string
		fax: string
		mobile: string
		name: string
		other: string
		phone: string
		postcode: string
		qq: string
		weixin: string
	}
}


function _getCompany(){
	return axios({ url:'com'})
}

function _updateCompany(data:Data) {
	return axios({
		url: 'com', method: 'PUT', data})
}


export {
	_getCompany,
	_updateCompany
}
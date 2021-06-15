import axios from './axios'


type Data = {
	findOption: {
		id:number
	}
	data: {
		title: string
		subtitle: string
		domain: string
		logo: string
		keywords: string
		description: string
		icp: string
		theme: string
		statistical: string
		copyright: string
	}

}

function _getSite(){
	return axios({ url:'site'})
}

function _updateSite(data:Data) {
	return axios({
		url: 'site', method: 'PUT', data})
}

export {
	_getSite,
	_updateSite
}
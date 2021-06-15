import axios from './axios'


function _getSiteStats() {
	return axios({url:'stats'})
}
function _clearCache() {
	return axios({method:'DELETE',url:'cache'})
}

function _transDb(data: {
	fromAcode:string,
	toAcode:string,
	fromLang:string,
	toLang:string,
}) {
	return axios(
		{
			method: 'POST',
			url: 'trans/db',
			data
		}
	)
}

export {
	_getSiteStats,
	_clearCache,
	_transDb
}
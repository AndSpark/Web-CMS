import axios from './axios'

export type site = {
	site: string
	name: string
	create_time: string
	hosts: string[]
	status: number
	visit: 0
}
	let baseURL = import.meta.env.VITE_BASE_URL as string

function _getSiteStats(site:string) {
	return axios({
		baseURL,
		url:`/Sites/${site}/data/stats.json`
	})
}

function _getSites():Promise<site[]> {
	return axios({
		baseURL,
		url:'/Sites/sites.json'
	})
}

function _addServerSite(data: {
	name: string
	site: string
	hosts: string
	isRemote: boolean
}) {
	return axios({
		baseURL: import.meta.env.VITE_SERVER_URL as string,
		method: 'POST',
		url: '/api/site/add',
		data
	})
}

function _uploadServerSite(site: string) {
	return axios({
		method: 'PUT',
		url: '/site/upload',
		data:{site}
	})
}

function _addSite(data: {
	name: string
	site: string
	hosts:string
}) {
	return axios({
		method: 'POST',
		url: '/site/add',
		data
	})
}

function _updateSite(data: {
	name: string
	site: string
	hosts:string
}) {
	return axios({
		method: 'put',
		url: '/site/update',
		data
	})
}

function _updatesiteStatus(site: string) {
	return axios({
		method: 'put',
		url: '/site/status',
		data:{site}
	})
}

function _deleteSite(site: string) {
	return axios({
		method: 'DELETE',
		url: '/site/delete',
		data:{site}
	})
}

export {
	_getSiteStats,
	_getSites,
	_addSite,
	_deleteSite,
	_updateSite,
	_updatesiteStatus,
	_addServerSite,
	_uploadServerSite
}
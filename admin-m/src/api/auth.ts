import { AxiosPromise, AxiosResponse } from 'axios'
import axios from './axios'

interface LoginForm {
	username: string
	password: string
}
	let baseURL = import.meta.env.VITE_BASE_URL as string


function _login(data:LoginForm) {
	return axios({
		method: 'POST',
		baseURL,
		url: '/auth/login',
		data
	})
}

function _getUser() {
	return axios({ url: '/auth/user',baseURL, })
}

function _updateUser(data: {
	username: string
	originPassword: string
	password: string
	confirmPassword: string
}) {
	return axios({method:'PUT',url: '/auth/user',baseURL,data })
	
}

export {
	_login,
	_getUser,
	_updateUser
}
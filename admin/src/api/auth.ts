import { AxiosPromise, AxiosResponse } from 'axios'
import axios from './axios'

interface LoginForm {
	username: string
	password: string
}

function _login(data:LoginForm) {
	return axios({
		method: 'POST',
		baseURL: import.meta.env.VITE_BASE_URL as string,
		url: '/auth/login',
		data
	})
}

function _getUser() {
	return axios({ url: '/auth/user',baseURL: import.meta.env.VITE_BASE_URL as string, })
}

function _updateUser(data: {
	username: string
	originPassword: string
	password: string
	confirmPassword: string
}) {
	return axios({method:'PUT',url: '/auth/user',baseURL: import.meta.env.VITE_BASE_URL as string,data })
	
}

export {
	_login,
	_getUser,
	_updateUser
}
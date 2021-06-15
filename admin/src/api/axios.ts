import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { localGet, localSet } from '../utils'
import loadingBar from '../utils/loadingBar'

export default (options: AxiosRequestConfig): Promise<AxiosResponse['data']> => {
	return new Promise((resolve, reject) => {
		const instance = Axios.create({
			baseURL:import.meta.env.VITE_BASE_URL + '/api',
			timeout: 5000,
		})
	
		instance.interceptors.request.use(
			config => {
				loadingBar.start()
				let token = localGet("token") || ''
				if (token) {
						config.headers.Authorization = token;     
						return config;
				}
				return config
			},
			err => err
		)
		instance.interceptors.response.use(
			res => {
				loadingBar.end()
				if (res.data.token) {
					localSet('token', res.data.token)
				}
				return res.data
			},
			err => {
				loadingBar.end()
				reject(err.response.data)
			}
		)
	
		instance(options) // 不知道为什么axios返回报错也是then
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
	
}
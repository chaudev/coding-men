import { instance } from './instance'
import _ from '~/appConfig'

const FormData = require('form-data')

export const login = async (params: any) => {
	try {
		const formData = new FormData()
		formData.append('username', params.username)
		formData.append('password', params.password)
		const res: any = await instance.post('/api/Account/LoginV2', formData, {
			headers: formData.getHeaders()
		})
		return res
	} catch (error) {
		console.log('login error', error)
		return Promise.reject(error)
	}
}

export const loginByDev = async (params: any) => {
	try {
		const formData = new FormData()
		formData.append('roleId', params.roleId)
		const res: any = await instance.post('/api/LoginByDev', formData, {
			headers: formData.getHeaders()
		})
		return res
	} catch (error) {
		console.log('login error', error)
		return Promise.reject(error)
	}
}

export const registerAPI = async (params: any) => {
	try {
		const res: any = await instance.post('/auth/signup', params)
		return res
	} catch (error) {
		console.log('register error', error)
		return Promise.reject(error)
	}
}

export const SocialLogin = async (params: any) => {
	try {
		var myHeaders = new Headers()
		myHeaders.append('token', params?.tokenId)
		var requestOptions: any = {
			method: 'POST',
			headers: myHeaders,
			redirect: 'follow'
		}
		let res: any = ''
		let link: string = params?.type == 'google' ? '/api/LoginByGoogleAccount' : '/api/LoginByFacebook'
		await fetch(_.hostURL + link, requestOptions)
			.then((response: any) => response.text())
			.then((result: any) => {
				res = JSON.parse(result)
			})
			.catch((error: any) => console.log('error', error))
		return res
	} catch (error) {
		return Promise.reject(error)
	}
}

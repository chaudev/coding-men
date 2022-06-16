import { instance } from '~/apiBase/instance'

class StudentCertificateApi {
	getAll = (todoApi: object) =>
		instance.get<IApiResultData<IStudentCertificate[]>>('/api/StudentCertificate', {
			params: todoApi
		})

	getByID = (ID: number) => instance.get<IApiResultData<IStudentCertificate>>(`/api/StudentCertificate/${ID}`)

	add = (data) => instance.post('/api/StudentCertificate', data, {})

	update = (data) => instance.put('/api/StudentCertificate', data, {})
}

export const studentCertificateApi = new StudentCertificateApi()

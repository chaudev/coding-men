import { instance } from '~/apiBase/instance'

class CertificateApi {
	// Lấy tất cả data có phân trang
	getAll = () => instance.get<IApiResultData<ICertificate>>('/api/Certificate')

	// Cập nhật data
	update = (data: any) => instance.put('/api/Certificate', data, {})
}

export const certificateApi = new CertificateApi()

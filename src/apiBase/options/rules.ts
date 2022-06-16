import { instance } from '~/apiBase/instance'

class Rules {
	// Lấy tất cả data
	getAll = (params) =>
		instance.get<IApiResultData<IRules[]>>('/api/Rules', {
			params
		})
	// Cập nhật data
	update = (data: any) => instance.put('/api/Rules', data, {})
}

export const rulesApi = new Rules()

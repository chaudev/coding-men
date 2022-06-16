import { instance } from '~/apiBase/instance'

class DiscountApi {
	getAll = (todoApi: object) =>
		instance.get<IApiResultData<IDiscount[]>>('/api/Discount', {
			params: todoApi
		})

	getSuggest = (ID: any) => instance.get<IApiResultData<IDiscount[]>>('/api/Discount/suggest_discount_code/' + ID)

	add = (data: IDiscount) => instance.post('/api/Discount', data, {})

	update = (data: any) => instance.put('/api/Discount', data, {})

	getOfStudent = (todoApi: object) =>
		instance.get<IApiResultData<any>>('/api/DiscountOfStudent', {
			params: todoApi
		})

	discountStudent = (todoApi: object) =>
		instance.get<IApiResultData<any>>('/api/DiscountStudent', {
			params: todoApi
		})
}

export const discountApi = new DiscountApi()

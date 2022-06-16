import { instance } from '~/apiBase/instance'

const url = '/api/SetPackageCategory'

class PackageCategoryApi {
	getDetail = (id: number) => instance.get<IApiResultData<ISetPackageCategory[]>>(`${url}/${id}`)

	add = (data) => instance.post(url, data)

	update = (data) => instance.put(url, data, {})
}

export const packageCategoryApi = new PackageCategoryApi()

import { instance } from '../instance';

const url = '/api/BillCourse/';
export const billCourseApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<any[]>>(url, {
			params
		});
	},
	// Thêm mới data
	add(data) {
		return instance.post(url, data);
	},
	// update mới data
	update(data) {
		return instance.put(url, data);
	},
	getById(id: number) {
		return instance.get<IApiResultData<ICourseDetail>>(`${url}${id}`);
	}
};

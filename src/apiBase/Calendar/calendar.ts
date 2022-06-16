import { instance } from '../instance'

const url = '/api/calendar/'
export const CalendarApi = {
	// Lấy tất cả data
	getCalendarEvents(params) {
		return instance.get<IApiResultData<IEvents[]>>(url + 'getcalendarevent', { params })
	},
	getByID(id) {
		return instance.get<IApiResultData<IEvents[]>>(url + `${id}`)
	},
	getHistory(id) {
		return instance.get<IApiResultData<IEvents[]>>(url + `history/${id}`)
	},
	getOpenCalendar() {
		return instance.get<IApiResultData<IEvents[]>>(url + 'get_videocourse_for_teacher_opencalendar')
	},
	// Thêm mới data
	add(data) {
		return instance.post(url + 'insert', data)
	},
	// Cập nhật data
	update(data) {
		return instance.put(url + 'update', data)
	},
	// Xóa data
	delete(data) {
		return instance.put(url, data)
	},
	getTeachers(params) {
		return instance.get<IApiResultData<IEvents[]>>(url + 'getteacherbooking', { params })
	},
	getOptionCurriculum() {
		return instance.get<IApiResultData<any[]>>(url + 'getoptioncurriculum')
	},
	createRoom(id) {
		return instance.put(url + `create_room/${id}`)
	},
	joinRoom(id) {
		return instance.get(url + `join_room/${id}`)
	},
	checkRoom(id) {
		return instance.get(url + `check_join_room/${id}`)
	},
	exitRoom(id) {
		return instance.put(url + `exit_room/${id}`)
	}
}

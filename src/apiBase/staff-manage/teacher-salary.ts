import { instance } from '~/apiBase/instance'

class TeacherSalaryApi {
	getAll = (Params: any) => instance.get<IApiResultData<ITeacherSalary[]>>('/api/SalaryOfTeacher', { params: Params })
	getDetail = (Params: any) => instance.get<IApiResultData<ITeacherSalaryDetail[]>>('/api/SalaryOfTeacherDetail', { params: Params })
	getFixExam = (Params: any) => instance.get<IApiResultData<ITeacherSalaryFixExam[]>>('/api/TeacherFixExam', { params: Params })
	postSalaryClosing = () => instance.post('/api/SalaryOfTeacherClosing')
	update = (data) => instance.put('/api/SalaryOfTeacher', data)
	exportExcel = (params) => instance.get<IApiResultData<ITeacherExportExcel[]>>('/api/ExportSalaryTeacher', { params: params })
	salaryTeacher = () => instance.post('/api/salaryofteacher/payroll')
	salaryOfTeacherId = (Params: any) =>
		instance.get<IApiResultData<ITeacherSalaryDetail[]>>('/api/salaryofteacher/get_salary_detail/' + Params?.SalaryOfTeacherID, {
			params: Params
		})
}
export const teacherSalaryApi = new TeacherSalaryApi()

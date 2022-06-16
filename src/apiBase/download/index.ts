import { instance } from '../instance'

export const downloadApi = {
	StudentExcel() {
		return instance.get<any>('/api/Student/StockExcel')
	}
}

type IStaffSalaryHistory = IBaseApi<{
	SalaryChangeHistoryID: number
	SalaryID: number
	UserInformationID: number
	SalaryOld: number
	SalaryNew: number
	Note: string
}>

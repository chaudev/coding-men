type IStudentCertificate = IBaseApi<{
	ID: number
	CourseOfStudentID: number
	StudentID: number
	StudentName: string
	CourseID: number
	CourseName: string
	StartDay: string
	EndDay: string
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
	Content: string
	Enable: boolean
}>

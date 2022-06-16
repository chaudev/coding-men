type ICategoryDoc = IBaseApi<{
	ID: number
	CategoryName: string
	CurriculumnID: number
	Enable: boolean
	Icon: string
}>

type IDocument = IBaseApi<{
	ID: number
	CategoryID: number
	DocumentLink: string
	DocumentName: string
}>

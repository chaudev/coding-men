import React, { useEffect, useState } from 'react'
import { rankResultApi } from '~/apiBase/package/rank-result'
import PowerTable from '~/components/PowerTable'
import { useWrap } from '~/context/wrap'
import { examTopicApi } from '~/apiBase'
import { Select } from 'antd'

const { Option } = Select

const RankResult = (props) => {
	const { isStudent, getDataDeital, ExamTopicID } = props

	let listFieldFilter = {
		pageIndex: 1,
		fromDate: null,
		toDate: null,
		TeacherID: null,
		StatusID: null,
		Month: null,
		Year: null
	}

	let listFieldSearch = {
		pageIndex: 1,
		TeacherName: null
	}

	const [dataFilter, setDataFilter] = useState([
		{
			name: 'TeacherID',
			title: 'Giáo viên',
			col: 'col-md-6 col-12',
			type: 'select',
			optionList: null,
			value: null
		},
		{
			name: 'StatusID',
			title: 'Trạng thái',
			col: 'col-md-6 col-12',
			type: 'select',
			optionList: [
				{
					title: 'Chưa chốt',
					value: 1
				},
				{
					title: 'Đã chốt lương',
					value: 2
				}
			],
			value: null
		},

		{
			name: 'date-range',
			title: 'Từ - đến',
			col: 'col-12',
			type: 'date-range',
			value: null
		}
	])

	const [dataExam, setDataExam] = useState<IExamTopic[]>([])

	// ------ BASE USESTATE TABLE -------
	const [dataSource, setDataSource] = useState<IRankResult[]>([])
	const { showNoti, pageSize, userInformation } = useWrap()
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	})
	const [totalPage, setTotalPage] = useState(null)
	const [currentPage, setCurrentPage] = useState(1)

	const listTodoApi = {
		pageSize: 9999,
		pageIndex: currentPage,
		sort: null,
		sortType: null,
		ExamTopicID: null
	}
	const [todoApi, setTodoApi] = useState(listTodoApi)

	// GET EXAM LIST
	const getExamList = async () => {
		try {
			let res = await examTopicApi.getAll({ selectAll: true, Type: 2 })
			res.status == 200 && setDataExam(res.data.data)
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			})
		}
	}

	// GET DATA SOURCE
	const getDataSource = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		})

		try {
			let res = await rankResultApi.getAll({ ...todoApi, ExamTopicID: todoApi?.ExamTopicID == null ? ExamTopicID : todoApi?.ExamTopicID })
			res.status == 200 && (setDataSource(res.data.data), setTotalPage(res.data.totalRow))

			res.status == 204 && (showNoti('danger', 'Không có dữ liệu'), setDataSource([]))
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			})
		}
	}

	// -------------- GET PAGE_NUMBER -----------------
	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber)
		setTodoApi({
			...todoApi,
			pageIndex: pageNumber
		})
	}

	// -------------- CHECK FIELD ---------------------
	const checkField = (valueSearch, dataIndex) => {
		let newList = { ...listFieldSearch }
		Object.keys(newList).forEach(function (key) {
			console.log('key: ', key)
			if (key != dataIndex) {
				if (key != 'pageIndex') {
					newList[key] = null
				}
			} else {
				newList[key] = valueSearch
			}
		})

		return newList
	}

	const handleChange_Exam = (value) => {
		if (value === 'all') {
			setTodoApi({
				...listTodoApi
			})
		} else {
			setTodoApi({
				...todoApi,
				ExamTopicID: value
			})
		}
	}

	const columns = [
		{
			title: 'Hạng',
			dataIndex: 'Rank',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Học viên',
			dataIndex: 'StudentName',
			render: (text, data) => (
				<p className="font-weight-primary d-flex align-items-center">
					{data.Rank == 1 && <img width="15px" className="logo-img mr-2" src="/images/king.png"></img>} {text}
				</p>
			)
		},
		{
			title: 'Đề thi',
			dataIndex: 'ExamTopicName',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Điểm',
			dataIndex: 'Point',
			render: (text) => <p className="font-weight-black">{text}</p>
		}
	]

	useEffect(() => {
		getDataSource()
	}, [todoApi])

	useEffect(() => {
		getExamList()
	}, [])

	useEffect(() => {
		if (userInformation) {
			if (todoApi.ExamTopicID) {
				dataSource.every((item) => {
					if (item.StudentID === userInformation.UserInformationID) {
						getDataDeital && getDataDeital(item)
						return false
					}
					return true
				})
			}
		}
	}, [userInformation, dataSource])

	return (
		<>
			<PowerTable
				Size={!isStudent ? 'table-medium' : ''}
				currentPage={currentPage}
				totalPage={totalPage && totalPage}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				loading={isLoading}
				addClass="basic-header"
				TitlePage="Xếp hạng làm bài"
				TitleCard={null}
				dataSource={dataSource}
				columns={columns}
				Extra={
					ExamTopicID == undefined ? (
						<div className="extra-table">
							<Select
								defaultValue="all"
								className="style-input"
								placeholder="Chọn đề thi"
								style={{ width: 150 }}
								onChange={handleChange_Exam}
							>
								<Option value="all">Tất cả</Option>
								{dataExam?.length > 0 &&
									dataExam.map((item, index) => (
										<Option value={item.ID} key={index}>
											{item.Name}
										</Option>
									))}
							</Select>
						</div>
					) : null
				}
			/>
		</>
	)
}

export default RankResult

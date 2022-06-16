import React, { Fragment, useEffect, useState } from 'react'
import SortBox from '~/components/Elements/SortBox'
import FilterStaffSalaryTable from '~/components/Global/Option/FilterTable/FilterStaffSalaryTable'
import StaffSalaryForm from '~/components/Global/Option/StaffSalaryForm'
import LayoutBase from '~/components/LayoutBase'
import PowerTable from '~/components/PowerTable'
import FilterColumn from '~/components/Tables/FilterColumn'
import { useWrap } from '~/context/wrap'
import { staffSalaryApi } from '~/apiBase'
import { Tooltip } from 'antd'
import { AlertTriangle, X } from 'react-feather'
import Modal from 'antd/lib/modal/Modal'
import moment from 'moment'
import ExpandTable from '~/components/ExpandTable'
import CourseExamDetail from '~/components/Global/CourseExam/CourseExamDetail'
import SalaryHistory from '~/components/Global/SalaryHistory/SalaryHistory'

const StaffSalary = () => {
	const [dataTable, setDataTable] = useState<IStaffSalary[]>([])

	const [dataDelete, setDataDelete] = useState({
		SalaryID: null,
		Enable: null
	})
	const { showNoti, pageSize } = useWrap()
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	})
	const [totalPage, setTotalPage] = useState(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [activeColumnSearch, setActiveColumnSearch] = useState('')
	const [updateSalary, setUpdateSalary] = useState({
		type: '',
		SalaryID: null
	})

	let pageIndex = 1

	// SORT
	const dataOption = [
		{
			dataSort: {
				sort: 2,
				sortType: false
			},
			value: 3,
			text: 'Tên giảm dần'
		},
		{
			dataSort: {
				sort: 2,
				sortType: true
			},
			value: 4,
			text: 'Tên tăng dần '
		}
	]

	// PARAMS SEARCH
	let listField = {
		FullName: ''
	}

	// PARAMS API GETALL
	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: pageIndex,
		sort: null,
		sortType: null,
		RoleID: 2,
		FullName: null,
		fromDate: null,
		toDate: null
	}
	const [todoApi, setTodoApi] = useState(listTodoApi)

	// GET DATA STAFFSALARY
	const getDataTable = () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		})
		;(async () => {
			try {
				let res = await staffSalaryApi.getAll(todoApi)
				if (res.status == 204) {
					showNoti('danger', 'Không có dữ liệu')
					handleReset()
					setDataTable([])
				}
				if (res.status == 200) {
					setDataTable(res.data.data)
					if (res.data.data.length < 1) {
						handleReset()
					}
					setTotalPage(res.data.totalRow)
				}
			} catch (error) {
				showNoti('danger', error.message)
			} finally {
				setIsLoading({
					type: 'GET_ALL',
					status: false
				})
			}
		})()
	}

	// ADD DATA
	const _onSubmit = async (data: any) => {
		setIsLoading({ type: 'ADD_DATA', status: true })

		let res = null

		if (updateSalary.type == 'update') {
			try {
				res = await staffSalaryApi.update({ ...data, SalaryID: updateSalary.SalaryID, Enable: true })
				res.status === 200 && showNoti('success', 'Cập nhật thành công'), getDataTable()
			} catch (error) {
				showNoti('danger', error.message)
			} finally {
				setIsLoading({
					type: 'ADD_DATA',
					status: false
				})
			}
		} else {
			try {
				res = await staffSalaryApi.add(data)
				res?.status == 200 && afterPost('Thêm')
			} catch (error) {
				showNoti('danger', error.message)
			} finally {
				setIsLoading({
					type: 'ADD_DATA',
					status: false
				})
			}
		}

		return res
	}

	const afterPost = (value) => {
		showNoti('success', `${value} thành công`)
		setTodoApi({
			...listTodoApi,
			pageIndex: 1
		})
		setCurrentPage(1)
	}

	// PAGINATION
	const getPagination = (pageNumber: number, pageSize: number) => {
		if (!pageSize) pageSize = 10
		pageIndex = pageNumber
		setCurrentPage(pageNumber)
		setTodoApi({
			...todoApi,
			//   ...listFieldSearch,
			pageIndex: pageIndex,
			pageSize: pageSize
		})
	}

	// ON SEARCH
	const compareField = (valueSearch, dataIndex) => {
		let newList = null
		Object.keys(listField).forEach(function (key) {
			if (key != dataIndex) {
				listField[key] = ''
			} else {
				listField[key] = valueSearch
			}
		})
		newList = listField
		return newList
	}

	const onSearch = (valueSearch, dataIndex) => {
		let clearKey = compareField(valueSearch, dataIndex)

		setTodoApi({
			...todoApi,
			pageIndex: 1,
			...clearKey
		})

		setCurrentPage(pageIndex)
	}

	// DELETE
	const handleDelele = async () => {
		if (dataDelete) {
			setIsModalVisible(false)
			let res = null
			try {
				res = await staffSalaryApi.update(dataDelete)
				res.status === 200 && showNoti('success', 'Xóa thành công')
				if (dataTable.length === 1) {
					listTodoApi.pageIndex === 1
						? setTodoApi({
								...listTodoApi,
								pageIndex: 1
						  })
						: setTodoApi({
								...listTodoApi,
								pageIndex: listTodoApi.pageIndex - 1
						  })
					return
				}
				getDataTable()
			} catch (error) {
				showNoti('danger', error.message)
			} finally {
				setIsLoading({
					type: 'DELETE_DATA',
					status: false
				})
			}
		}
	}

	// HANDLE RESET
	const handleReset = () => {
		setActiveColumnSearch('')
		setTodoApi({
			...listTodoApi,
			pageIndex: 1
		})
		setCurrentPage(1)
	}

	// HANDLE SORT
	const handleSort = async (option) => {
		let newTodoApi = {
			...listTodoApi,
			sort: option.title.sort,
			sortType: option.title.sortType
		}

		setCurrentPage(1)
		setTodoApi(newTodoApi)
	}

	// HANDLE FILTER
	const _onFilterTable = (data) => {
		let newTodoApi = {
			...listTodoApi,
			pageIndex: 1,
			RoleID: data.RoleID,
			fromDate: data.fromDate,
			toDate: data.toDate
		}
		setCurrentPage(1)
		setTodoApi(newTodoApi)
	}

	// COLUMNS TABLE
	const columns = [
		{
			title: 'Họ và tên',
			dataIndex: 'FullName',
			...FilterColumn('FullName', onSearch, handleReset, 'text'),
			className: activeColumnSearch === 'ID' ? 'active-column-search' : '',
			render: (text) => {
				return <p className="font-weight-black">{text}</p>
			}
		},
		{
			title: 'Email',
			dataIndex: 'Email'
		},
		{
			title: 'Vai trò',
			dataIndex: 'RoleName'
		},
		{
			title: 'Mức lương',
			dataIndex: 'Salary',
			render: (salary) => {
				return <p className="font-weight-primary">{Intl.NumberFormat('ja-JP').format(salary)}</p>
			}
		},
		{
			title: 'Loại',
			dataIndex: 'StyleName'
		},
		{ title: 'Thêm bởi', dataIndex: 'CreatedBy' },
		{
			title: 'Thêm lúc',
			dataIndex: 'CreatedOn',
			render: (date) => moment(date).format('DD/MM/YYYY')
		},
		{
			align: 'right',
			render: (record) => (
				<>
					<StaffSalaryForm
						showIcon={true}
						rowData={record}
						isLoading={isLoading}
						_onSubmitStaff={(data: any) => _onSubmit(data)}
						setUpdateSalary={setUpdateSalary}
					/>
					<Tooltip title="Xóa">
						<button
							className="btn btn-icon delete"
							onClick={() => {
								setIsModalVisible(true)
								setDataDelete({
									SalaryID: record.SalaryID,
									Enable: false
								})
							}}
						>
							<X />
						</button>
					</Tooltip>
				</>
			)
		}
	]

	useEffect(() => {
		getDataTable()
	}, [todoApi])

	const expandedRowRender = (data, index) => {
		return (
			<>
				<SalaryHistory ID={data.SalaryID} />
			</>
		)
	}

	return (
		<Fragment>
			<Modal
				title={<AlertTriangle color="red" />}
				visible={isModalVisible}
				onOk={() => handleDelele()}
				onCancel={() => setIsModalVisible(false)}
			>
				<span className="text-confirm">Bạn có chắc chắn muốn xóa không ?</span>
			</Modal>
			<ExpandTable
				loading={isLoading}
				currentPage={currentPage}
				totalPage={totalPage && totalPage}
				getPagination={getPagination}
				addClass="basic-header"
				TitlePage="Cấu hình lương"
				TitleCard={
					<StaffSalaryForm
						showAdd={true}
						isLoading={isLoading}
						_onSubmitStaff={(data: any) => _onSubmit(data)}
						setUpdateSalary={setUpdateSalary}
					/>
				}
				dataSource={dataTable}
				columns={columns}
				Extra={
					<div className="extra-table">
						<FilterStaffSalaryTable _onFilter={(value: any) => _onFilterTable(value)} _onHandleReset={handleReset} />
						<SortBox handleSort={(value) => handleSort(value)} dataOption={dataOption} />
					</div>
				}
				expandable={{ expandedRowRender }}
			/>
		</Fragment>
	)
}
StaffSalary.layout = LayoutBase
export default StaffSalary

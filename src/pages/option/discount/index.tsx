import React, { useEffect, useState } from 'react'
import FilterDiscountTable from '~/components/Global/Option/FilterTable/FilterDiscountTable'
import SortBox from '~/components/Elements/SortBox'
import DiscountForm from '~/components/Global/Option/DiscountForm'
import LayoutBase from '~/components/LayoutBase'
import PowerTable from '~/components/PowerTable'
import FilterColumn from '~/components/Tables/FilterColumn'
import TitlePage from '~/components/TitlePage'
import { Popconfirm, Button } from 'antd'
import { useWrap } from '~/context/wrap'
import { discountApi } from '~/apiBase'
import { X } from 'react-feather'
import moment from 'moment'
import { parseToMoney } from '~/utils/functions'
import ViewImage from './show-image'

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

let listField = { DiscountCode: '', Status: '' }
let pageIndex = 1

const Discount = () => {
	const { showNoti, pageSize } = useWrap()

	const [dataTable, setDataTable] = useState<IDiscount[]>([])
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [totalPage, setTotalPage] = useState(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [activeColumnSearch, setActiveColumnSearch] = useState('')

	const [rerender, setRerender] = useState<any>('')

	// PARAMS API GETALL
	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: pageIndex,
		sort: null,
		sortType: null,
		DiscountCode: null,
		Status: null
	}

	const [todoApi, setTodoApi] = useState(listTodoApi)

	// GET DATA STAFFSALARY
	const getDataTable = async () => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			let res = await discountApi.getAll(todoApi)
			if (res.status == 204) {
				showNoti('danger', 'Không có dữ liệu')
				setDataTable([])
			}
			if (res.status == 200) {
				setDataTable(res.data.data)
				if (res.data.data.length < 1) {
					handleReset()
				}
				setTotalPage(res.data.totalRow)
				let now = new Date().getTime()
				setRerender(now)
			}
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false })
		}
	}

	// ADD DATA
	const _onSubmit = async (data: any) => {
		setIsLoading({ type: 'ADD_DATA', status: true })
		let res = null
		if (data.ID) {
			try {
				res = await discountApi.update(data)
				res?.status == 200 && showNoti('success', 'Cập nhật thành công'), getDataTable()
			} catch (error) {
				showNoti('danger', error.message)
			} finally {
				setIsLoading({ type: 'ADD_DATA', status: false })
			}
		} else {
			try {
				res = await discountApi.add(data)
				res?.status == 200 && afterPost('Thêm')
			} catch (error) {
				showNoti('danger', error.message)
			} finally {
				setIsLoading({ type: 'ADD_DATA', status: false })
			}
		}
		return res
	}

	const afterPost = (value) => {
		showNoti('success', `${value} thành công`)
		setTodoApi({ ...listTodoApi, pageIndex: 1 })
		setCurrentPage(1)
	}

	// PAGINATION
	const getPagination = (pageNumber: number, pageSize: number) => {
		if (!pageSize) pageSize = 10
		pageIndex = pageNumber
		setCurrentPage(pageNumber)
		setTodoApi({ ...todoApi, pageIndex: pageIndex, pageSize: pageSize })
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
		setTodoApi({ ...todoApi, pageIndex: 1, ...clearKey })
	}

	// DELETE
	const handleDelele = async (param) => {
		if (param) {
			let res = null
			try {
				res = await discountApi.update(param)
				res.status === 200 && showNoti('success', 'Xóa thành công')
				if (dataTable.length === 1) {
					listTodoApi.pageIndex === 1
						? setTodoApi({ ...listTodoApi, pageIndex: 1 })
						: setTodoApi({ ...listTodoApi, pageIndex: listTodoApi.pageIndex - 1 })
					return
				}
				getDataTable()
			} catch (error) {
				showNoti('danger', error.message)
			} finally {
				setIsLoading({ type: 'DELETE_DATA', status: false })
			}
		}
	}

	// HANDLE RESET
	const handleReset = () => {
		setActiveColumnSearch('')
		setTodoApi({ ...listTodoApi, pageIndex: 1 })
		setCurrentPage(1)
	}

	// HANDLE SORT
	const handleSort = async (option) => {
		let newTodoApi = { ...listTodoApi, sort: option.title.sort, sortType: option.title.sortType }
		setCurrentPage(1)
		setTodoApi(newTodoApi)
	}

	// HANDLE FILTER
	const _onFilterTable = (data) => {
		let newTodoApi = {
			...listTodoApi,
			fromDate: data.fromDate,
			toDate: data.toDate,
			Status: data.Status
		}
		setCurrentPage(1)
		setTodoApi(newTodoApi)
	}

	const columns = [
		{
			title: 'Mã khuyến mãi',
			width: 150,
			dataIndex: 'DiscountCode',
			...FilterColumn('DiscountCode', onSearch, handleReset, 'text'),
			className: activeColumnSearch === 'ID' ? 'active-column-search' : '',
			render: (code) => <span className="tag green">{code}</span>
		},
		{
			title: 'Khuyến mãi',
			dataIndex: 'Discount',
			width: 150,
			render: (text, record) => {
				if (record.DiscountType == 2) {
					return <p className="font-weight-primary">{text}%</p>
				} else {
					return <p className="font-weight-primary">{Intl.NumberFormat('ja-JP').format(text)}</p>
				}
			}
		},
		{
			title: 'Gói',
			dataIndex: 'StyleName',
			width: 150,
			render: (text, record) => {
				return <p className="font-weight-black">{text}</p>
			}
		},
		{
			title: 'Trạng thái',
			width: 150,
			align: 'center',
			dataIndex: 'StatusName',
			render: (text: any, record: any) => {
				switch (record.Status) {
					case 1:
						return <span className="tag green">{text}</span>
					case 2:
						return <span className="tag yellow">{text}</span>
					case 3:
						return <span className="tag red">{text}</span>
				}
			}
		},
		{
			title: 'Đơn hàng tối thiểu',
			align: 'center',
			width: 200,
			dataIndex: 'MinimumOrder',
			render: (data: string, value) => <>{parseToMoney(data)}đ</>
		},
		{
			title: 'Giảm tối đa',
			align: 'center',
			width: 200,
			dataIndex: 'MaxDiscountPrice',
			render: (data: string, value) => <>{parseToMoney(data)}đ</>
		},
		{
			title: 'Số lượng',
			align: 'center',
			width: 100,
			dataIndex: 'Quantity'
		},
		{
			title: 'Số lượng đã dùng',
			width: 200,
			align: 'center',
			dataIndex: 'QuantityLeft'
		},
		{ title: 'Ghi chú', width: 200, dataIndex: 'Note' },
		{
			title: 'Thời hạn',
			dataIndex: 'DeadLine',
			render: (date) => moment(date).format('DD/MM/YYYY')
		},
		{
			align: 'right',
			render: (record, text, index) => (
				<>
					<DiscountForm showIcon={true} rowData={record} isLoading={isLoading} _onSubmit={(data: any) => _onSubmit(data)} />
					<Popconfirm
						placement="left"
						title="Bạn có chắc chắn muốn xóa không?"
						onConfirm={() =>
							handleDelele({
								ID: record.ID,
								Enable: false
							})
						}
						okText="Xóa"
						cancelText="Huỷ"
					>
						<Button className="btn btn-icon delete">
							<X />
						</Button>
					</Popconfirm>
					<ViewImage url={record?.Images} />
				</>
			)
		}
	]

	useEffect(() => {
		getDataTable()
	}, [todoApi])

	return (
		<div className="row">
			<div className="col-12">
				<TitlePage title="Danh sách mã khuyến mãi" />
			</div>
			<div className="col-12">
				<PowerTable
					loading={isLoading}
					currentPage={currentPage}
					totalPage={totalPage && totalPage}
					getPagination={getPagination}
					addClass="basic-header"
					TitleCard={<DiscountForm showAdd={true} isLoading={isLoading} _onSubmit={(data: any) => _onSubmit(data)} />}
					dataSource={dataTable}
					columns={columns}
					Extra={
						<div className="extra-table">
							<FilterDiscountTable _onFilter={(value: any) => _onFilterTable(value)} _onHandleReset={handleReset} />
							<SortBox handleSort={(value) => handleSort(value)} dataOption={dataOption} />
						</div>
					}
				/>
			</div>
		</div>
	)
}

Discount.layout = LayoutBase
export default Discount

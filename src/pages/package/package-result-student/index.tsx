import { ExclamationCircleOutlined, FormOutlined } from '@ant-design/icons'
import { Modal, Tooltip } from 'antd'
import moment from 'moment'
import Link from 'next/link'
import React, { Fragment, useEffect, useState } from 'react'
import { packageDetailApi } from '~/apiBase/package/package-detail'
import { packageResultApi } from '~/apiBase/package/package-result'
import FilterBase from '~/components/Elements/FilterBase/FilterBase'
import SortBox from '~/components/Elements/SortBox'
import ExpandTable from '~/components/ExpandTable'
import PackageResultExpand from '~/components/Global/Package/PackageResult/PackageResultExpand'
import LayoutBase from '~/components/LayoutBase'
import { useWrap } from '~/context/wrap'

const RequestMaking = (props) => {
	const { status, AmountFixOfStudent, handleBuyMarking, onFetchData, dataRow } = props
	const [isModalVisible, setIsModalVisible] = useState(false)
	const { showNoti } = useWrap()
	const [loading, setLoading] = useState(false)

	const showModal = () => {
		setIsModalVisible(true)
	}

	const handleRequestMaking = async () => {
		let res = null
		let dataSubmit = { ID: dataRow.ID, Enable: true }
		setLoading(true)
		try {
			switch (dataRow.StatusID) {
				case 1:
					res = await packageResultApi.update({ ...dataSubmit, isFixPaid: true })
					break
				case 3:
					res = await packageResultApi.update({ ...dataSubmit, isReevaluate: true })
					break
				default:
					break
			}
			if (res.status == 200) {
				showNoti('success', 'Yêu cầu thành công')
				onFetchData && onFetchData()
				setIsModalVisible(false)
			}
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setLoading(false)
		}
	}

	const handleOk = () => {
		if (AmountFixOfStudent > 0) {
			handleRequestMaking()
		} else {
			handleBuyMarking && handleBuyMarking()
			setIsModalVisible(false)
		}
	}

	const handleCancel = () => {
		setIsModalVisible(false)
	}

	return (
		<>
			<Tooltip title={status == 1 ? 'Yêu cầu chấm bài' : 'Yêu cầu chấm lại'}>
				<button className="btn btn-icon edit" onClick={showModal}>
					<FormOutlined />
				</button>
			</Tooltip>
			<Modal
				confirmLoading={loading}
				title={
					<button className="btn btn-icon" onClick={showModal}>
						<ExclamationCircleOutlined />
					</button>
				}
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				okText={AmountFixOfStudent > 0 ? 'Ok' : 'Mua lượt chấm'}
			>
				{AmountFixOfStudent > 0 ? (
					<p style={{ fontWeight: 500 }}>{status == 1 ? 'Bạn muốn yêu cầu chấm đề này?' : 'Bạn muốn yêu cầu chấm lại đề này?'}</p>
				) : (
					<p style={{ fontWeight: 500 }}>Bạn cần mua lượt chấm bài để sử dụng chức năng này!</p>
				)}
			</Modal>
		</>
	)
}

type IPackageResult = {
	lession: any
}

const filterVideo = [
	{
		name: 'StatusID',
		title: 'Trạng thái',
		col: 'col-12',
		type: 'select',
		optionList: [
			{
				value: 1,
				title: 'Đã nộp bài'
			},
			{
				value: 2,
				title: 'Đang chấm bài'
			},
			{
				value: 3,
				title: 'Đã chấm bài'
			},
			{
				value: 4,
				title: 'Đang chấm bài lại'
			},
			{
				value: 5,
				title: 'Đã chấm bài'
			}
		],
		value: null
	},
	{
		name: 'date-range',
		title: 'Ngày tạo',
		col: 'col-12',
		type: 'date-range',
		value: null
	}
]

const PackageResultStudent = (props: IPackageResult) => {
	const { showNoti, pageSize } = useWrap()

	const [currentPage, setCurrentPage] = useState(1)
	const [totalPage, setTotalPage] = useState(null)
	const [packageSetResult, setPackageSetResult] = useState<ISetPackageResult[]>([])
	const [isLoading, setIsLoading] = useState({ type: 'GET_ALL', status: false })
	const [rr, setRR] = useState('')

	const listParamsDefault = {
		pageSize: pageSize,
		pageIndex: currentPage,
		sort: null,
		sortType: null,
		fromDate: null,
		toDate: null,
		StudentID: null,
		SetPackageDetailID: null,
		isDone: null,
		StudentName: null,
		ExamTopicType: null,
		LessonID: !!props.lession?.ID ? props.lession?.ID : null
	}

	const [params, setParams] = useState(listParamsDefault)

	const sortOption = [
		{
			dataSort: {
				sortType: null
			},
			value: 1,
			text: 'Mới cập nhật'
		},
		{
			dataSort: {
				sortType: true
			},
			value: 2,
			text: 'Từ dưới lên'
		}
	]

	const [dataFilter, setDataFilter] = useState(
		!!props?.lession
			? [
					{
						name: 'StatusID',
						title: 'Trạng thái',
						col: 'col-12',
						type: 'select',
						optionList: [
							{
								value: 1,
								title: 'Đã nộp bài'
							},
							{
								value: 2,
								title: 'Đang chấm bài'
							},
							{
								value: 3,
								title: 'Đã chấm bài'
							},
							{
								value: 4,
								title: 'Đang chấm bài lại'
							},
							{
								value: 5,
								title: 'Đã chấm bài'
							}
						],
						value: null
					},
					{
						name: 'date-range',
						title: 'Thời gian làm',
						col: 'col-12',
						type: 'date-range',
						value: null
					}
			  ]
			: [
					{
						name: 'SetPackageDetailID',
						title: 'Bộ đề',
						col: 'col-12',
						type: 'select',
						optionList: null,
						value: null
					},
					{
						name: 'StatusID',
						title: 'Trạng thái',
						col: 'col-12',
						type: 'select',
						optionList: [
							{
								value: 1,
								title: 'Đã nộp bài'
							},
							{
								value: 2,
								title: 'Đang chấm bài'
							},
							{
								value: 3,
								title: 'Đã chấm bài'
							},
							{
								value: 4,
								title: 'Đang chấm bài lại'
							},
							{
								value: 5,
								title: 'Đã chấm bài'
							}
						],
						value: null
					},
					{
						name: 'date-range',
						title: 'Thời gian làm',
						col: 'col-12',
						type: 'date-range',
						value: null
					}
			  ]
	)

	const handleReset = () => {
		setCurrentPage(1)
		setParams(listParamsDefault)
	}

	const returnTypeExam = (data) => {
		let text = ''
		if (data.ListeningNumber > 0 || data.ReadingNumber > 0) {
			if (data.SpeakingNumber > 0 || data.WritingNumber > 0) {
				text = 'Tổng hợp'
			} else {
				text = 'Trắc nghiệm'
			}
		} else {
			if (data.SpeakingNumber > 0 || data.WritingNumber > 0) {
				text = 'Tự luận'
			}
		}
		return text
	}

	const handleFilter = (listFilter) => {
		let newListFilter = {
			pageIndex: 1,
			fromDate: null,
			toDate: null,
			StudentID: null,
			SetPackageDetailID: null,
			isDone: null,
			StudentName: null,
			ExamTopicType: null,
			StatusID: null
		}
		listFilter.forEach((item, index) => {
			let key = item.name
			Object.keys(newListFilter).forEach((keyFilter) => {
				if (keyFilter == key) {
					newListFilter[key] = item.value
				}
			})
		})
		setParams({ ...listParamsDefault, ...newListFilter, pageIndex: 1 })
	}

	const handleSort = async (option) => {
		setParams({ ...listParamsDefault, sortType: option.title.sortType })
	}

	const getDataSetPackageResult = async (page: any) => {
		setIsLoading({ type: 'GET_ALL', status: true })

		try {
			let res = await packageResultApi.getAll({ ...params, pageIndex: page, LessonID: !!props.lession?.ID ? props.lession.ID : null })
			res.status == 200 && setPackageSetResult(res.data.data)
			if (res.status == 204) {
				setPackageSetResult([])
			} else {
				setTotalPage(res.data.totalRow)
			}
			setRR(Date.now().toString())
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false })
		}
	}

	const setDataFunc = (name, data) => {
		dataFilter.every((item, index) => {
			if (item.name == name) {
				item.optionList = data
				return false
			}
			return true
		})
		setDataFilter([...dataFilter])
	}

	const getDataPackageDetail = async () => {
		try {
			let res = await packageDetailApi.getAll({ pageSize: 99999, pageIndex: 1 })
			if (res.status == 200) {
				const newData = res.data.data.map((item) => ({ title: item.SetPackageName, value: item.ID }))
				setDataFunc('SetPackageDetailID', newData)
			}
			res.status == 204 && showNoti('danger', 'Không có dữ liệu bộ đề này!')
		} catch (error) {
			showNoti('danger', error.message)
		}
	}

	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber)
		setParams({ ...params, pageIndex: currentPage })
	}

	const expandedRowRender = (data, index) => {
		return (
			<Fragment>
				<PackageResultExpand infoID={data.ID} />
			</Fragment>
		)
	}

	const columns = [
		{
			title: 'Đề thi',
			dataIndex: 'ExamTopicName',
			render: (text, data) => (
				<Link
					href={{
						pathname: '/package/package-result-student/detail/[slug]',
						query: { slug: `${data.ID}`, examID: data.ExamTopicID, packageDetailID: data.SetPackageDetailID }
					}}
				>
					<a href="#" className="font-weight-black">
						{text}
					</a>
				</Link>
			)
		},
		{
			title: 'Trạng thái',
			dataIndex: 'StatusID',
			align: 'center',
			render: (status) => (
				<Fragment>
					{status == 1 && <span className="tag gray">Đã nộp bài</span>}
					{status == 2 && <span className="tag yellow">Đang chấm bài</span>}
					{status == 3 && <span className="tag green">Đã chấm bài</span>}
					{status == 4 && <span className="tag yellow">Đang chấm bài lại</span>}
					{status == 5 && <span className="tag green">Đã chấm bài lại</span>}
				</Fragment>
			)
		},
		{
			title: 'Dạng đề',
			align: 'center',
			render: (data) => <>{<p className="font-weight-black">{returnTypeExam(data)}</p>}</>
		},
		{
			title: 'Thời gian làm',
			align: 'center',
			render: (data) => <>{<p className="font-weight-black">{moment(data?.CreatedOn).format('DD/MM/YYYY')}</p>}</>
		},
		{
			align: 'right',
			render: (data) => (
				<>
					<Link
						href={{
							pathname: '/package/package-result-student/detail/[slug]',
							query: {
								slug: `${data.ID}`,
								examID: data.ExamTopicID,
								packageDetailID: data.SetPackageDetailID,
								score: true
							}
						}}
					>
						<Tooltip title="Kết quả bộ đề chi tiết">
							<button className="btn btn-icon">
								<ExclamationCircleOutlined />
							</button>
						</Tooltip>
					</Link>
				</>
			)
		}
	]

	useEffect(() => {
		getDataSetPackageResult(currentPage)
	}, [params])

	useEffect(() => {
		getDataPackageDetail()
	}, [])

	useEffect(() => {
		if (!!props?.lession) {
			getDataSetPackageResult(currentPage)
		}
	}, [props?.lession])

	return (
		<div className={`${!!props.lession ? 'video-table' : ''}`}>
			<ExpandTable
				currentPage={currentPage}
				loading={isLoading}
				totalPage={totalPage && totalPage}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				addClass="basic-header"
				TitlePage="Kết quả đã làm bài"
				dataSource={packageSetResult}
				columns={columns}
				Extra={
					<div className="extra-table">
						<FilterBase
							isVideo={!!props.lession}
							dataFilter={dataFilter}
							handleFilter={(listFilter: any) => handleFilter(listFilter)}
							handleReset={handleReset}
						/>
						<SortBox dataOption={sortOption} handleSort={(value) => handleSort(value)} />
					</div>
				}
				expandable={{ expandedRowRender }}
			/>
		</div>
	)
}

PackageResultStudent.layout = LayoutBase
export default PackageResultStudent

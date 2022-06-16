import { faPenSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card, Input, List, Modal, Progress, Rate, Tooltip, Popover, Button, Spin } from 'antd'
import 'antd/dist/antd.css'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { VideoCourseListApi } from '~/apiBase'
import CourseVideoTable from '~/components/CourseVideoTable'
import LayoutBase from '~/components/LayoutBase'
import { useWrap } from '~/context/wrap'
import NumberFormat from 'react-number-format'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

const { TextArea, Search } = Input

const ItemVideo = ({ item, onRate }) => {
	const [rerender, setRender] = useState('')
	const { userInformation } = useWrap()

	useEffect(() => {
		setRender(item)
	}, [item])

	return (
		<div className="video-course-list__item">
			<Link
				href={{
					pathname: '/video-learning',
					query: {
						ID: userInformation.RoleID == 3 ? item.ID : item.VideoCourseID,
						course: item.VideoCourseID,
						complete: item.Complete + '/' + item.TotalLesson,
						name: item.VideoCourseName
					}
				}}
			>
				<div className="video-course-list__item_warp-image">
					<Link
						href={{
							pathname: '/video-learning',
							query: {
								ID: userInformation.RoleID == 3 ? item.ID : item.VideoCourseID,
								course: item.VideoCourseID,
								complete: item.Complete + '/' + item.TotalLesson,
								name: item.VideoCourseName
							}
						}}
					>
						{item.ImageThumbnails === '' || item.ImageThumbnails === null || item.ImageThumbnails === undefined ? (
							<img src="/images/logo-thumnail.jpg" />
						) : (
							<img src={item.ImageThumbnails} />
						)}
					</Link>
				</div>
			</Link>

			<Link
				href={{
					pathname: '/video-learning',
					query: {
						ID: userInformation.RoleID == 3 ? item.ID : item.VideoCourseID,
						course: item.VideoCourseID,
						complete: item.Complete + '/' + item.TotalLesson,
						name: item.VideoCourseName
					}
				}}
			>
				<div className="p-3 video-course-list__item__content">
					<Tooltip title={item.VideoCourseName} style={{ width: '100%' }}>
						<span className="title in-1-line" style={{ width: '100%' }}>
							{item.VideoCourseName}
						</span>
					</Tooltip>
					<>
						<Progress
							className="text-process"
							percent={(item.Complete / item.TotalLesson) * 100} // 10 - CHANGE TO TOTALESSION
							status="active"
						/>

						<div style={{}}>Thời gian còn lại: {item?.DaysLeft} ngày</div>

						<div style={{ color: '#8E8E93' }}>Số lần đặt lịch còn lại: {item?.LeftLimitBooking}</div>

						{/* <div className="pr-3 pl-3 pt-3 row rate-container">
							<Rate className="rate-start" disabled value={item.RatingNumber} />
							<a
								onClick={(e) => {
									e.stopPropagation()
									onRate(item)
								}}
								className="none-selection btn-rate "
							>
								Đánh giá
							</a>
						</div> */}
					</>
				</div>
			</Link>
		</div>
	)
}

let pageIndex = 1

const VideoCourseList = () => {
	const { userInformation, pageSize, showNoti, getTitlePage } = useWrap()

	const [data, setData] = useState([])
	const [showModal, setShowModal] = useState(false)
	const [rerender, setRender] = useState('')
	const [loading, setLoading] = useState(true)
	const [totalPage, setTotalPage] = useState(null)

	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: pageIndex,
		search: ''
	}
	const [todoApi, setTodoApi] = useState(listTodoApi)

	const [state, dispatch] = React.useReducer(
		(prevState, action) => {
			switch (action.type) {
				case 'ID':
					return {
						...prevState,
						ID: action.ID
					}
				case 'RatingNumber':
					return {
						...prevState,
						RatingNumber: action.RatingNumber
					}
				case 'RatingComment':
					return {
						...prevState,
						RatingComment: action.RatingComment
					}
			}
		},
		{
			ID: '',
			RatingNumber: 0,
			RatingComment: ''
		}
	)

	useEffect(() => {
		if (userInformation) {
			getAllArea()
			getTitlePage()
			userInformation?.RoleID == 1 ? getTitlePage('Khóa học video đã bán') : getTitlePage('Khóa học video đã sở hữu')
		}
	}, [userInformation])

	//GET DATA
	const getAllArea = async () => {
		setLoading(true)
		try {
			const res = userInformation?.RoleID == 1 ? await VideoCourseListApi.getAll(todoApi) : await VideoCourseListApi.getByUser(todoApi)
			res.status == 200 && (setData(res.data.data), setTotalPage(res.data.totalRow))
			res.status == 204 && setData([])
			setRender(res + '')
		} catch (err) {
			showNoti('danger', err)
		} finally {
			setLoading(false)
		}
	}

	//GET DATA
	const updateRate = async () => {
		let temp = {
			ID: state.ID,
			RatingNumber: state.RatingNumber,
			RatingComment: state.RatingComment
		}
		try {
			await VideoCourseListApi.update(temp)
		} catch (err) {
			showNoti('danger', err.message)
		}
		getAllArea()
	}

	const [num, setNum] = useState('')

	const _updateData = async (ID: number) => {
		setLoading(true)
		try {
			const res = await VideoCourseListApi.updateLimitBooking({ ID: ID, LimitBooking: num })
			if (res.status == 200) {
				setNum('')
				getAllArea()
				showNoti('success', res.data?.message)
			}
		} catch (error) {
			showNoti('danger', error?.message)
		}
	}

	const columnsVideoCourse = [
		{
			title: 'Tên khóa học',
			dataIndex: 'VideoCourseName',
			key: 'VideoCourseName'
		},
		{
			title: 'Người mua',
			dataIndex: 'StudentName',
			key: 'StudentName'
		},
		{
			title: 'Ngày kích hoạt',
			dataIndex: 'CreatedOn',
			key: 'CreatedOn',
			render: (Action, data, index) => <div>{data.CreatedOn}</div>
		},
		{
			title: 'Điện thoại',
			dataIndex: 'Phone',
			key: 'Phone'
		},
		{
			title: 'Đặt lịch còn lại',
			dataIndex: 'LeftLimitBooking',
			key: 'LeftLimitBooking',
			align: 'center'
		},
		{
			title: '',
			dataIndex: '',
			key: 'hoho',
			align: 'center',
			render: (Action, data, index) => {
				return (
					<div>
						<Popover
							content={
								<div className="wrap-calendar-x">
									<NumberFormat
										value={num}
										placeholder="Số lần có thể đặt"
										className="ant-input style-input w-100"
										onChange={(e: any) => setNum(e.target.value)}
										thousandSeparator={true}
									/>
									<Button onClick={() => _updateData(data?.ID)} className="btn btn-primary w-100 mt-3">
										Cập nhật {loading && <Spin className="ml-2" size="small" />}
									</Button>
								</div>
							}
							title="Cập nhật số lần đặt lịch"
							trigger="hover"
							placement="left"
						>
							<FontAwesomeIcon className="pen-edit" icon={faPenSquare as IconProp} size="lg" />
						</Popover>
					</div>
				)
			}
		}
	]

	useEffect(() => {
		todoApi !== listTodoApi && getAllArea()
	}, [todoApi])

	// HANDLE SEARCH
	const handleSearch = (e) => {
		let newTodoApi = { ...listTodoApi, pageIndex: 1, search: e }
		;(pageIndex = 1), setTodoApi(newTodoApi)
	}

	// HANDLE CHANGE PAGE
	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber
		setTodoApi({ ...todoApi, pageIndex: pageIndex })
	}

	// CARD EXTRA
	const Extra = () => {
		return (
			<div className="row m-0 vc-store_extra-table">
				<div className="row m-0">
					<div className="row m-0 st-fb-100w ">
						<Search
							className="fb-btn-search style-input vc-teach-modal_search"
							size="large"
							placeholder="Tìm kiếm"
							onSearch={(e) => handleSearch(e)}
						/>
					</div>
				</div>
			</div>
		)
	}

	// RENDER
	return (
		<div className="">
			<Card title={Extra()} className="video-course-list" style={{ width: '100%' }}>
				{userInformation !== null && (
					<>
						{userInformation?.RoleID == 1 ? (
							<CourseVideoTable
								totalPage={totalPage && totalPage}
								getPagination={(pageNumber: number) => getPagination(pageNumber)}
								currentPage={pageIndex}
								columns={columnsVideoCourse}
								dataSource={data}
								loading={{ type: 'GET_ALL', status: loading }}
								TitleCard={null}
							/>
						) : (
							<List
								pagination={{
									onChange: getPagination,
									total: totalPage,
									size: 'small',
									current: pageIndex
								}}
								loading={loading}
								itemLayout="horizontal"
								dataSource={data}
								grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 5 }}
								renderItem={(item) => (
									<ItemVideo
										onRate={(p) => {
											dispatch({ type: 'ID', ID: p.ID })
											dispatch({ type: 'RatingNumber', RatingNumber: p.RatingNumber })
											dispatch({ type: 'RatingComment', RatingComment: p.RatingComment })
											setShowModal(true)
										}}
										item={item}
									/>
								)}
							/>
						)}
					</>
				)}

				<Modal
					title="Đánh giá"
					visible={showModal}
					onOk={() => {
						setShowModal(false)
						updateRate()
					}}
					okText="Đánh giá"
					cancelText="Hủy"
					confirmLoading={false}
					onCancel={() => setShowModal(false)}
				>
					<Rate value={parseInt(state.RatingNumber)} onChange={(e) => dispatch({ type: 'RatingNumber', RatingNumber: e })} />
					<TextArea
						value={state.RatingComment}
						onChange={(p) => dispatch({ type: 'RatingComment', RatingComment: p.target.value })}
						rows={4}
						className="mt-4"
					/>
				</Modal>
			</Card>
		</div>
	)
}

VideoCourseList.layout = LayoutBase

export default VideoCourseList

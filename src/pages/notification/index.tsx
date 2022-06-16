import React, { useEffect, useState } from 'react'
import PowerTable from '~/components/PowerTable'
import LayoutBase from '~/components/LayoutBase'
import { AlertCircle } from 'react-feather'
import { notificationApi } from '~/apiBase'
import { useWrap } from '~/context/wrap'
import moment from 'moment'
import { Checkbox, Tooltip } from 'antd'
import ReactHtmlParser from 'react-html-parser'
import Modal from 'antd/lib/modal/Modal'

const listTodoApi = {
	pageSize: 10,
	pageIndex: 1,
	IsPagination: true
}

const Notification = () => {
	const { showNoti } = useWrap()

	const [dataTable, setDataTable] = useState<any>()
	const [contentRow, setContentRow] = useState({ ID: null, content: null, title: null, status: null })
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [currentPage, setCurrentPage] = useState(1)
	const [todoApi, setTodoApi] = useState(listTodoApi)

	// GET DATA
	const getDataTable = async () => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			let res = await notificationApi.getAllWithUser(todoApi)
			if (res.status == 200) {
				setDataTable(res.data)
			}
			if (res.status == 204) {
				showNoti('danger', 'Không có dữ liệu')
				console.log(`%c - Noti 204:` + `%c Không tìm thấy thông báo nào`, 'color: red; font-weight: bold', 'color: yellow;')
			}
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false })
		}
	}

	// PAGINATION
	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber)
		setTodoApi({ ...todoApi, pageIndex: pageNumber })
	}

	const _onSubmit = async (data: any) => {
		setIsLoading({ type: 'UPDATE_DATA', status: true })
		let res = null
		try {
			res = await notificationApi.updateSeen(data)
			if (res?.status == 200) {
				showNoti('success', 'Cập nhật thành công')
				getDataTable()
			}
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setIsLoading({ type: 'ADD_DATA', status: false })
		}
		return res
	}

	const onChange = (e) => {
		const data = { ID: e.target.value }
		_onSubmit(data)
	}

	const columns = [
		{
			title: () => (
				<Checkbox value={0} onChange={onChange} defaultChecked={false}>
					<span className="color-white">Đã xem tất cả</span>
				</Checkbox>
			),
			dataIndex: 'Status',
			render: (text, record) => (
				<div>
					{text == 0 ? (
						<Checkbox className="uncheck" value={record.ID} onChange={onChange}>
							<span>Đã xem</span>
						</Checkbox>
					) : (
						<Checkbox checked>
							<span>Đã xem</span>
						</Checkbox>
					)}
				</div>
			)
		},
		{
			title: 'Tên thông báo',
			dataIndex: 'NotificationTitle',
			render: (text) => <span className="font-weight-black">{text}</span>
		},
		{
			title: 'Nội dung thông báo',
			dataIndex: 'NotificationContent',
			render: (text) => <div className="content-notification">{ReactHtmlParser(text)}</div>
		},
		{
			title: 'Thời gian',
			dataIndex: 'CreatedOn',
			render: (date) => <span className="font-weight-primary">{moment(date).format('DD/MM/YYYY')}</span>
		},
		{
			render: (record) => (
				<Tooltip title="Chi tiết">
					<button
						className="btn btn-icon delete"
						onClick={() => {
							setIsModalVisible(true)
							setContentRow({
								ID: record.ID,
								content: record.NotificationContent,
								title: record.NotificationTitle,
								status: record.Status
							})
						}}
					>
						<AlertCircle color="#32c6a4" />
					</button>
				</Tooltip>
			)
		}
	]

	useEffect(() => {
		getDataTable()
	}, [todoApi])

	return (
		<>
			<Modal
				title={<AlertCircle color="#32c6a4" />}
				visible={isModalVisible}
				onOk={() => {
					setIsModalVisible(false)
					contentRow.status == 0 && _onSubmit({ ID: contentRow.ID })
				}}
				onCancel={() => {
					setIsModalVisible(false)
					contentRow.status == 0 && _onSubmit({ ID: contentRow.ID })
				}}
			>
				<h4>{contentRow.title}</h4>
				<div>{ReactHtmlParser(contentRow.content)}</div>
			</Modal>
			<PowerTable
				loading={isLoading}
				currentPage={currentPage}
				totalPage={dataTable?.totalRow && dataTable?.totalRow}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				addClass="basic-header"
				TitlePage="Danh sách thông báo"
				dataSource={dataTable?.data}
				columns={columns}
			/>
		</>
	)
}

Notification.layout = LayoutBase
export default Notification

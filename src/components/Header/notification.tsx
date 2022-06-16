import { BellOutlined, NotificationOutlined, NotificationTwoTone } from '@ant-design/icons'
import { Card, List, Popover } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { AlertCircle } from 'react-feather'
import ReactHtmlParser from 'react-html-parser'
import { notificationApi } from '~/apiBase'
import { useWrap } from '~/context/wrap'

const listTodoApi = { pageSize: 10, pageIndex: 1, IsPagination: false }

const Notification = () => {
	const { reloadNotification, handleReloadNoti } = useWrap()

	const [dataTable, setDataTable] = useState<any>({})
	const [contentRow, setContentRow] = useState({ ID: null, content: null, title: null, status: null })
	const [isModalVisible, setIsModalVisible] = useState(false)

	const getDataNotification = async () => {
		try {
			let res = await notificationApi.getAllWithUser(listTodoApi)
			if (res.status == 200) {
				setDataTable(res.data)
			}
			if (res.status == 204) {
				console.log(`%c - Noti 204:` + `%c Không tìm thấy thông báo nào`, 'color: red; font-weight: bold', 'color: yellow;')
			}
		} catch (error) {
			console.log('error: ', error)
		}
	}

	const _onSubmit = async (data: any) => {
		let res = null
		try {
			res = await notificationApi.updateSeen(data)
			if (res.status == 200) {
				getDataNotification()
			}
		} catch (error) {
			console.log('error', error.message)
		}
		return res
	}

	const content_notification = (
		<div className={`wrap-notification middle`}>
			<div className="content_notification">
				<Card
					title="Thông báo"
					extra={
						<Link href="/notification">
							<a>Xem tất cả</a>
						</Link>
					}
					bordered={false}
				>
					<List
						itemLayout="horizontal"
						dataSource={dataTable.data}
						className="list-notification"
						renderItem={(item: INotification) => (
							<>
								<a
									onClick={() => {
										setIsModalVisible(true)
										setContentRow({
											ID: item.ID,
											content: item.NotificationContent,
											title: item.NotificationTitle,
											status: item.Status
										})
									}}
								>
									<List.Item className={item.Status == 0 ? 'new' : 'old'}>
										{item.Status == 0 ? (
											<List.Item.Meta
												avatar={<NotificationTwoTone />}
												title={item.NotificationTitle}
												description={ReactHtmlParser(item.NotificationContent)}
											/>
										) : (
											<List.Item.Meta
												avatar={<NotificationOutlined />}
												title={item.NotificationTitle}
												description={ReactHtmlParser(item.NotificationContent)}
											/>
										)}
									</List.Item>
								</a>
							</>
						)}
					/>
				</Card>
			</div>
		</div>
	)

	useEffect(() => {
		if (!!reloadNotification) {
			getDataNotification()
			handleReloadNoti()
		}
	}, [reloadNotification])

	useEffect(() => {
		getDataNotification()
	}, [])

	return (
		<>
			<Modal
				title={<AlertCircle color="#32c6a4" />}
				visible={isModalVisible}
				width={700}
				okButtonProps={{
					style: {
						display: 'none'
					}
				}}
				onCancel={() => {
					setIsModalVisible(false)
					contentRow.status == 0 && _onSubmit({ ID: contentRow.ID })
				}}
			>
				<h4>{contentRow.title}</h4>
				<div>{ReactHtmlParser(contentRow.content)}</div>
			</Modal>
			<Popover placement="bottomRight" content={content_notification}>
				<div className="shopping__cart-detail cart-icon d-flex justify-content-center align-items-center">
					<a style={{ textDecoration: 'none' }}>
						<BellOutlined size={18} />
					</a>
					<span className={dataTable?.totalRow > 0 ? 'count-notification' : 'hide'}>
						<span>{dataTable?.totalRow > 9 ? `9+` : dataTable?.totalRow}</span>
					</span>
				</div>
			</Popover>
		</>
	)
}

export default Notification

import { Modal, Tooltip, Spin } from 'antd'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useWrap } from '~/context/wrap'
import _ from '~/appConfig'
import { CalendarApi } from '~/apiBase/Calendar/calendar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHistory } from '@fortawesome/free-solid-svg-icons'
import PowerTable from '../PowerTable'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

moment.locale('vi')

const ModalHistory = (props: any) => {
	const { ID, title } = props
	const { showNoti } = useWrap()

	const [loading, setLoading] = useState<boolean>(false)
	const [details, setDetails] = useState<any>('')
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		if (visible) {
			_getDetails()
		}
	}, [visible])

	const _getDetails = async () => {
		setLoading(true)
		try {
			const res: any = await CalendarApi.getHistory(ID)
			if (res.status == 200 || res.status == 204) {
				setDetails(res.data.data)
			}
		} catch (error) {
			showNoti('danger', error?.message)
		} finally {
			setLoading(false)
		}
	}

	const columns = [
		{
			title: 'Hành động',
			dataIndex: 'Action',
			key: 'Action',
			width: 250,
			render: (text) => <a>{text}</a>
		},
		{
			title: 'Lý do',
			dataIndex: 'Reason',
			key: 'Reason',
			width: 200,
			render: (text) => <a>{text}</a>
		},
		{
			title: 'Thời gian',
			dataIndex: 'CreatedDate',
			key: 'CreatedDate',
			width: 100,
			render: (text) => <a>{moment(text).format('DD/MM/YYYY HH:MM')}</a>
		},
		{
			title: 'Thao tác',
			dataIndex: 'CreatedByFullName',
			key: 'CreatedByFullName',
			width: 150,
			align: 'right',
			render: (text) => <a>{text}</a>
		}
	]

	return (
		<>
			<Tooltip title="Lịch sử thay đổi">
				<div onClick={() => setVisible(true)}>
					<FontAwesomeIcon icon={faHistory as IconProp} size="1x" color="#727272" />
				</div>
			</Tooltip>

			<div style={{ zIndex: 999 }}>
				<Modal
					title={'Lịch sử thay đổi: ' + title}
					visible={visible}
					onCancel={() => setVisible(false)}
					footer={null}
					centered
					width={1200}
				>
					{loading ? (
						<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							<Spin />
						</div>
					) : (
						<PowerTable columns={columns} dataSource={details} pagination={{ current: 1, pageSize: 20 }} size="small" />
					)}
				</Modal>
			</div>
		</>
	)
}

export default ModalHistory

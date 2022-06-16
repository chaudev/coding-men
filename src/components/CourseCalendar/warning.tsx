import { Button, Input, Popover, Spin } from 'antd'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useWrap } from '~/context/wrap'
import _ from '~/appConfig'
import { CalendarApi } from '~/apiBase/Calendar/calendar'

const { TextArea } = Input
moment.locale('vi')

const WarningEvent = (props: any) => {
	const { title, ID, getData, Status } = props
	const { showNoti, userInformation } = useWrap()

	const [loading, setLoading] = useState<boolean>(false)
	const [errorText, setErrorText] = useState<any>('')
	const [reason, setReason] = useState<any>('')

	useEffect(() => {
		setErrorText('')
	}, [])

	const _deleteEvent = async (Sta: number) => {
		setLoading(true)
		if (Sta == 6 && !reason) {
			setErrorText('Vui lòng nhập lý do')
		} else {
			try {
				const res: any = await CalendarApi.update({ ID: ID, Status: Sta, Reason: reason })
				if (res.status == 200 || res.status == 204) {
					showNoti('success', 'Thành công')
					getData()
				}
			} catch (error) {
				showNoti('danger', error?.message)
			} finally {
				setLoading(false)
			}
		}
	}

	const content = () => {
		return (
			<div className="w-100 wrap-calendar-x" style={{ minWidth: 350 }}>
				<div className="mb-2">
					Nhập sự cố <span style={{ color: 'red' }}> *</span>
				</div>
				<TextArea onChange={(e: any) => setReason(e.target.value)} className="ant-input" />
				{!errorText && (
					<div className="mt-2" style={{ color: 'red' }}>
						{errorText || ''}
					</div>
				)}
				<Button onClick={() => _deleteEvent(6)} size="middle" className="btn-issue w-100 mt-2">
					Lưu lại {loading && <Spin className="ml-2" size="small" />}
				</Button>
			</div>
		)
	}

	const isTeach = () => {
		return !!userInformation && (userInformation.RoleID == 1 || userInformation.RoleID == 2) ? true : false
	}

	return (
		<>
			{isTeach() && (
				<div className="wrap-calendar-x" style={{ zIndex: 999 }}>
					{Status == 2 ? (
						<Button onClick={() => _deleteEvent(1)} size="middle" className="btn-blue w-100 mt-2">
							Đã hết sự cố {loading && <Spin className="ml-2" size="small" />}
						</Button>
					) : (
						<Popover
							content={content}
							title={<div style={{ fontWeight: 'bold', color: '#ab5713' }}>{`Báo sự cố: ${title}`}</div>}
							trigger="hover"
							placement="rightTop"
						>
							<Button size="middle" className="btn-issue w-100 mt-2 shadow">
								Báo sự cố
							</Button>
						</Popover>
					)}
				</div>
			)}
		</>
	)
}

export default WarningEvent

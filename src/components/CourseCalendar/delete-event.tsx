import { Button, Input, Popover, Spin } from 'antd'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useWrap } from '~/context/wrap'
import _ from '~/appConfig'
import { CalendarApi } from '~/apiBase/Calendar/calendar'

const { TextArea } = Input
moment.locale('vi')

const DeleteEvent = (props: any) => {
	const { title, ID, getData, Status, teacherChangeData } = props
	const { showNoti, userInformation } = useWrap()

	const [loading, setLoading] = useState<boolean>(false)
	const [errorText, setErrorText] = useState<any>('')
	const [reason, setReason] = useState<any>('')

	useEffect(() => {
		setErrorText('')
	}, [])

	const _deleteEvent = async (Sta: number) => {
		if (Sta == 2 && !reason) {
			setErrorText('Vui lòng nhập lý do')
		} else {
			setLoading(true)
			try {
				const res: any = await CalendarApi.update({ ID: ID, Status: Sta, Reason: reason })
				if (res.status == 200 || res.status == 204) {
					showNoti('success', 'Thành công')
					getData()
					teacherChangeData({ Teacher: userInformation.UserInformationID, ID: ID })
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
					Nhập lý do <span style={{ color: 'red' }}> *</span>
				</div>
				<TextArea onChange={(e: any) => setReason(e.target.value)} className="ant-input" />
				{!!errorText && (
					<div className="mt-2" style={{ color: 'red' }}>
						{errorText || ''}
					</div>
				)}
				<Button onClick={() => _deleteEvent(2)} size="middle" className="btn-primary w-100 mt-2">
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
					{Status == 2 && (
						<Button onClick={() => _deleteEvent(1)} size="middle" className="btn-blue w-100 mt-2">
							Mở lại {loading && <Spin className="ml-2" size="small" />}
						</Button>
					)}

					{Status == 1 && (
						<Popover
							content={content}
							title={<div style={{ fontWeight: 'bold', color: 'red' }}>{`Huỷ lịch: ${title}`}</div>}
							trigger="hover"
							placement="rightTop"
						>
							<Button size="middle" className="btn-cancel w-100 mt-2 shadow">
								Hủy lịch
							</Button>
						</Popover>
					)}
				</div>
			)}
		</>
	)
}

export default DeleteEvent

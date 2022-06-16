import { Button, Input, Popover, Spin } from 'antd'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useWrap } from '~/context/wrap'
import _ from '~/appConfig'
import { CalendarApi } from '~/apiBase/Calendar/calendar'

const { TextArea } = Input
moment.locale('vi')

const BookEvent = (props: any) => {
	const { title, ID, getData, Status, studentChangeData } = props
	const { showNoti, userInformation } = useWrap()

	const [loading, setLoading] = useState<boolean>(false)
	const [errorText, setErrorText] = useState<any>('')
	const [reason, setReason] = useState<any>('')
	const [request, setRequest] = useState<any>('')

	useEffect(() => {
		setErrorText('')
	}, [])

	useEffect(() => {
		setErrorText('')
	}, [reason])

	const _bookEvent = async (Sta: number) => {
		if ((Sta == 3 || Sta == 2) && !reason) {
			setErrorText(`Vui lòng nhập ${Sta == 3 ? 'tiêu đề' : 'lý do'}`)
		} else {
			setLoading(true)
			try {
				const res: any = await (Sta == 3
					? CalendarApi.update({ ID: ID, Status: Sta, Title: reason, StudentRequest: request })
					: CalendarApi.update({ ID: ID, Status: Sta, Reason: reason }))
				if (res.status == 200 || res.status == 204) {
					showNoti('success', 'Thành công')
					getData()
					studentChangeData({ ID: ID })
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
					Nhập tiêu đề <span style={{ color: 'red' }}> *</span>
				</div>
				<TextArea onChange={(e: any) => setReason(e.target.value)} className="ant-input" />

				<div className="mb-2 mt-3">Nhập yêu cầu</div>
				<TextArea onChange={(e: any) => setRequest(e.target.value)} className="ant-input" />

				{!!errorText && (
					<div className="mt-2" style={{ color: 'red' }}>
						{errorText || ''}
					</div>
				)}
				<Button onClick={() => _bookEvent(3)} size="middle" className="btn-primary w-100 mt-2">
					Lưu lại {loading && <Spin className="ml-2" size="small" />}
				</Button>
			</div>
		)
	}

	const contentCancel = () => {
		return (
			<div className="w-100 wrap-calendar-x" style={{ minWidth: 350 }}>
				<div className="mb-2">
					Nhập lý do hủy <span style={{ color: 'red' }}> *</span>
				</div>
				<TextArea onChange={(e: any) => setReason(e.target.value)} className="ant-input" />
				{!!errorText && (
					<div className="mt-2" style={{ color: 'red' }}>
						{errorText || ''}
					</div>
				)}
				<Button onClick={() => _bookEvent(2)} size="middle" className="btn-primary w-100 mt-2">
					Lưu lại {loading && <Spin className="ml-2" size="small" />}
				</Button>
			</div>
		)
	}
	const isTeach = () => {
		return !!userInformation && (userInformation.RoleID == 1 || userInformation.RoleID == 2) ? true : false
	}

	return (
		<div className="wrap-calendar-x" style={{ zIndex: 999 }}>
			{!isTeach() && (
				<>
					{(Status == 1 || Status == 2) && (
						<Popover
							content={content}
							title={<div style={{ fontWeight: 'bold' }}>{`Đặt lịch: ${title}`}</div>}
							trigger="hover"
							placement="rightTop"
						>
							<Button size="middle" className="btn-blue w-100 mt-2 shadow">
								Đặt lịch
							</Button>
						</Popover>
					)}

					{Status == 3 && (
						<Popover
							content={contentCancel}
							title={<div style={{ fontWeight: 'bold' }}>{`Hủy lịch: ${title}`}</div>}
							trigger="hover"
							placement="rightTop"
						>
							<Button size="middle" className="btn-cancel w-100 mt-2 shadow">
								Huỷ bỏ {loading && <Spin className="ml-2" size="small" />}
							</Button>
						</Popover>
					)}
				</>
			)}
		</div>
	)
}

export default BookEvent

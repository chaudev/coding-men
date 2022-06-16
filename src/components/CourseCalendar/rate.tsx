import { Button, Input, Popover, Rate, Spin } from 'antd'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useWrap } from '~/context/wrap'
import _ from '~/appConfig'
import { CalendarApi } from '~/apiBase/Calendar/calendar'

const { TextArea } = Input
moment.locale('vi')

const RateEvent = (props: any) => {
	const { title, ID, getData, Status } = props
	const { showNoti, userInformation } = useWrap()

	const [loading, setLoading] = useState<boolean>(false)
	const [errorText, setErrorText] = useState<any>('')
	const [rate, setRate] = useState<any>(5)
	const [reason, setReason] = useState<any>('')

	const isTeach = () => {
		return !!userInformation && userInformation.RoleID == 2 ? true : false
	}

	useEffect(() => {
		setErrorText('')
	}, [])

	const _bookEvent = async (Sta: number) => {
		setLoading(true)
		if (!reason) {
			setErrorText(`Vui lòng nhập nội dung`)
		} else {
			try {
				const res: any = await (!isTeach()
					? CalendarApi.update({ ID: ID, StarRating: rate, StudentRemark: reason })
					: CalendarApi.update({ ID: ID, TeacherRemark: reason }))
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
				{!isTeach() && <Rate defaultValue={rate} onChange={(e) => setRate(e)} count={5} />}

				<div className="mb-2 mt-3">
					Nhập nội dung<span style={{ color: 'red' }}> *</span>
				</div>

				<TextArea onChange={(e: any) => setReason(e.target.value)} className="ant-input" />

				{!errorText && (
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

	return (
		<div className="wrap-calendar-x" style={{ zIndex: 999 }}>
			<Popover
				content={content}
				title={<div style={{ fontWeight: 'bold' }}>{`Đánh giá: ${title}`}</div>}
				trigger="hover"
				placement="rightTop"
			>
				<Button size="middle" className="btn-blue w-100 mt-2 shadow">
					Đánh giá
				</Button>
			</Popover>
		</div>
	)
}

export default RateEvent

import { Button, Input, Popover, Spin } from 'antd'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useWrap } from '~/context/wrap'
import _ from '~/appConfig'
import { CalendarApi } from '~/apiBase/Calendar/calendar'

const { TextArea } = Input
moment.locale('vi')

const UpdateRequest = (props: any) => {
	const { title, ID, getData, Status, event, studentChangeData } = props
	const { showNoti, userInformation } = useWrap()

	const [loading, setLoading] = useState<boolean>(false)
	const [errorText, setErrorText] = useState<any>('')
	const [reason, setReason] = useState<any>('')
	const [request, setRequest] = useState<any>('')

	useEffect(() => {
		setErrorText('')
		setReason(event?.name)
		getDataDetails()
	}, [])

	const getDataDetails = async () => {
		try {
			const res: any = await CalendarApi.getByID(event?.id)
			if (!!res?.data?.data?.StudentRequest) {
				setRequest(res?.data?.data?.StudentRequest)
			}
		} catch (error) {
			showNoti('danger', error?.message)
		} finally {
			setLoading(false)
		}
	}

	const _bookEvent = async (Sta: number) => {
		setLoading(true)

		try {
			const res: any = await CalendarApi.update({ ID: ID, StudentRequest: request, title: reason })
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

	const content = () => {
		return (
			<div className="w-100 wrap-calendar-x" style={{ minWidth: 350 }}>
				<div className="mb-2">Nhập tiêu đề</div>
				<TextArea value={reason} onChange={(e: any) => setReason(e.target.value)} className="ant-input" />

				<div className="mb-2 mt-3">Nhập yêu cầu</div>
				<TextArea value={request} onChange={(e: any) => setRequest(e.target.value)} className="ant-input" />

				<Button onClick={() => _bookEvent(3)} size="middle" className="btn-primary w-100 mt-3">
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
			{!isTeach() && (
				<div className="wrap-calendar-x" style={{ zIndex: 999 }}>
					{Status == 3 && (
						<Popover
							content={content}
							title={<div style={{ fontWeight: 'bold' }}>{`Cập nhật: ${title}`}</div>}
							trigger="hover"
							placement="rightTop"
						>
							<Button size="middle" className="btn-warning w-100 mt-2 shadow">
								Cập nhật {loading && <Spin className="ml-2" size="small" />}
							</Button>
						</Popover>
					)}
				</div>
			)}
		</>
	)
}

export default UpdateRequest

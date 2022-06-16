import { Card } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useLayoutEffect } from 'react'
import { useState } from 'react'
import { CalendarApi } from '~/apiBase/Calendar/calendar'
import CourseCalendar from '~/components/CourseCalendar'
import FillterCalendar from '~/components/Global/Option/FilterTable/FillterCalendar'
import LayoutBase from '~/components/LayoutBase'
import { useWrap } from '~/context/wrap'
import socketIOClient from 'socket.io-client'

const _HOST = 'ischau.herokuapp.com'

let socketIO: any = ''

const now = new Date()

const getNum = (num) => {
	return num > 9 ? num : '0' + num
}

const todoApiInit = {
	status: null,
	teacherId: null,
	fromDate: moment(now).format('YYYY/MM') + '/01',
	toDate: moment(now).format('YYYY') + '/' + getNum(parseInt(moment(now).format('MM')) + 1) + '/01'
}

const options = {
	status: {
		teacher: [
			{ ID: null, title: 'Tất cả' },
			{ ID: 1, title: 'Đang mở' },
			{ ID: 2, title: 'Đã hủy' },
			{ ID: 3, title: 'Đã đặt lịch' },
			{ ID: 4, title: 'Đã hoàn thành' },
			{ ID: 5, title: 'Đã xác nhận dạy' },
			{ ID: 6, title: 'Sự cố' },
			{ ID: 7, title: 'Đang diễn ra' },
			{ ID: 8, title: 'Đã kết thúc' },
			{ ID: 9, title: 'Đã tạo phòng' }
		],
		student: [
			{ ID: null, title: 'Tất cả' },
			{ ID: 1, title: 'Đang mở' },
			{ ID: 3, title: 'Đã đặt lịch' },
			{ ID: 4, title: 'Đã hoàn thành' },
			{ ID: 5, title: 'Đã xác nhận dạy' },
			{ ID: 6, title: 'Sự cố' },
			{ ID: 7, title: 'Đang diễn ra' },
			{ ID: 8, title: 'Đã kết thúc' },
			{ ID: 9, title: 'Đã tạo phòng' }
		]
	}
}

const CouCalen = () => {
	const { getTitlePage, showNoti, userInformation } = useWrap()

	const [calendarEvents, setEvents] = useState([])
	const [videoCourses, setVideoCourses] = useState([])
	const [todoApi, setTodoApi] = useState<any>(todoApiInit)

	const route = useRouter()

	const query: any = route.query

	const isTeach = () => {
		return !!userInformation && userInformation.RoleID == 2 ? true : false
	}

	const isAdOrTeach = () => {
		return !!userInformation && (userInformation.RoleID == 1 || isTeach()) ? true : false
	}

	const socket = () => {
		if (socketIO !== '') {
			socketIO.disconnect()
		}

		// @ts-ignore
		socketIO = socketIOClient.connect(_HOST)

		socketIO.on('getId', (data) => {
			console.log(data)
		})

		socketIO.on('teacher-change-data', (dataGot) => {
			// console.log('teacher-change-data: ', dataGot)

			if (!isTeach()) {
				let data = dataGot?.data
				if (data?.Teacher == query?.teacher) {
					getTeacherEvents()
				} else {
					for (let i = 0; i < calendarEvents.length; i++) {
						const e = calendarEvents[i]
						if (data?.ID == e?.ID) {
							// console.log('data?.ID == e?.ID')

							getTeacherEvents()
						}
					}
				}
			}
		})

		socketIO.on('student-change-data', (dataGot) => {
			if (isTeach()) {
				let data = dataGot?.data
				for (let i = 0; i < calendarEvents.length; i++) {
					const e = calendarEvents[i]
					if (data?.ID == e?.ID) {
						getTeacherEvents()
					}
				}
			}
		})

		return () => {
			socketIO.disconnect()
		}
	}

	const teacherChangeData = (param: any) => {
		socketIO.emit('teacher-change-data', param)
	}

	const studentChangeData = (param: any) => {
		socketIO.emit('student-change-data', param)
	}

	const callApi = () => {
		isAdOrTeach()
			? setTodoApi({ ...todoApi, teacherId: userInformation?.UserInformationID })
			: !!query?.teacher
			? setTodoApi({ ...todoApi, teacherId: parseInt(query.teacher) })
			: setTodoApi({ ...todoApi, teacherId: 0 })
	}

	const _leave = async () => {
		if (!!query?.ID) {
			try {
				if (isTeach()) {
					const parseID = parseInt(query?.ID.toString())
					await CalendarApi.exitRoom(parseID)
					teacherChangeData({ Teacher: userInformation.UserInformationID, ID: query?.ID })
				}
				callApi()
			} catch (error) {
				callApi()
			}
		} else {
			callApi()
		}
	}

	useLayoutEffect(() => {
		if (!!userInformation) {
			_leave()
		}
	}, [userInformation])

	useLayoutEffect(() => {
		if (!!userInformation) {
			_leave()
		}
	}, [])

	useLayoutEffect(() => {
		todoApi !== todoApiInit && getTeacherEvents()
	}, [todoApi])

	const _getData = () => {
		isAdOrTeach() && getTeacherEvents()
	}

	const getID = () => {
		return isAdOrTeach() ? userInformation?.UserInformationID : !!query?.teacher ? parseInt(query.teacher) : 0
	}

	useLayoutEffect(() => {
		socket()
	}, [calendarEvents])

	const getTeacherEvents = async () => {
		try {
			const res: any = await CalendarApi.getCalendarEvents({ ...todoApi, teacherId: getID() })
			if (res.status == 200) {
				setEvents(res.data.data)
			}
		} catch (error) {
			showNoti('danger', error?.message)
		} finally {
			isTeach() && getVideoCourseCalendar()
		}
	}

	const getVideoCourseCalendar = async () => {
		try {
			const res: any = await CalendarApi.getOpenCalendar()
			res.status == 200 && setVideoCourses(res.data.data)
		} catch (error) {
			showNoti('danger', error?.message)
		}
	}

	const _formatEvents = (param: any) => {
		let temp: any = []
		if (!!param) {
			for (let i = 0; i < param.length; i++) {
				let event = param[i]
				temp.push({
					id: event?.ID,
					name: event?.Title,
					title: event?.sTime + ' - ' + event?.eTime,
					allDay: false,
					start: new Date(event?.sDateTime),
					end: new Date(event?.eDateTime),
					sTime: event?.sTime,
					eTime: event?.eTime,
					OpenDate: event?.OpenDate,
					resource: event
				})
			}
		}
		return temp
	}

	const _reset = () => {
		setTodoApi({ ...todoApiInit, pageIndex: 1 })
	}

	const _filter = (paramFilter: any) => {
		let newTodoApi = { ...todoApiInit, ...paramFilter }
		setTodoApi(newTodoApi)
	}

	return (
		<Card title={<FillterCalendar handleReset={_reset} data={options} handleFilter={(value: any) => _filter(value)} />}>
			{getTitlePage(`Quản lý lịch ${isAdOrTeach() ? 'dạy' : 'học'}`)}
			<CourseCalendar
				onRangeChange={(e: any) => setTodoApi({ ...todoApi, fromDate: e?.fromDate, toDate: e?.toDate })}
				getData={getTeacherEvents}
				events={_formatEvents(calendarEvents)}
				courses={videoCourses}
				teacherChangeData={teacherChangeData}
				studentChangeData={studentChangeData}
			/>
		</Card>
	)
}

CouCalen.layout = LayoutBase
export default CouCalen

import { Avatar, Button, Card, Modal, Popover, Spin, Tooltip } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useCallback } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import CloseZoomRoom from '~/components/Global/ManageZoom/ZoomRoom/CloseZoomRoom'
import ZoomRecordModal from '~/components/Global/ManageZoom/ZoomRoom/ZoomRecordModal'
import { useWrap } from '~/context/wrap'
import ModalCreateEvent from './modal-create-event'
import _ from '~/appConfig'
import DeleteEvent from './delete-event'
import ModalHistory from './modal-history'
import WarningEvent from './warning'
import BookEvent from './book-event'
import UpdateRequest from './update-request'
import { CalendarApi } from '~/apiBase/Calendar/calendar'
import RateEvent from './rate'

moment.locale('vi')

const localizer = momentLocalizer(moment)

const CourseCalendar = (props: any) => {
	const router = useRouter()
	const { getTitlePage, userInformation, showNoti } = useWrap()
	const { getData, events, courses, onRangeChange, teacherChangeData, studentChangeData } = props

	const [modalVisible, setModalVisible] = useState(false)
	const [editVisible, setEditvisible] = useState(false)
	const [loading, setLoading] = useState(false)
	const [dateSelected, setDateSelected] = useState({ slots: '', start: '', end: '' })
	const [eventSelected, setEventSelected] = useState<any>({})

	const handleSelectEvent = useCallback((event) => window.alert(event.title), [])

	const isTeach = () => {
		return !!userInformation && userInformation.RoleID == 2 ? true : false
	}

	const isAdOrTeach = () => {
		return !!userInformation && (userInformation.RoleID == 1 || isTeach()) ? true : false
	}

	const handleSelectSlot = (param: any) => {
		const { slots, start, end } = param
		const date = new Date()
		let checkDate = compare(moment(start).format('YYYY/MM/DD'), moment(date).format('YYYY/MM/DD')) // -1: qua roi, 0: hom nay, 1: chua qua

		if (isTeach() && checkDate != -1) {
			setDateSelected({ slots: slots, start: start, end: end })
			setModalVisible(true)
		}
	}

	const eventPropGetter = (event: any) => {
		let eventStyle: any = {
			style: {
				backgroundColor: 'rgba(0,0,0,0)',
				textAlign: 'center',
				paddingBottom: 0
			}
		}
		return eventStyle
	}

	const dayPropGetter = (date: any) => {
		let now = new Date()
		const isNow = () => {
			return moment(now).format('DD/MM/YYYY') == moment(date).format('DD/MM/YYYY') ? true : false
		}
		return isNow()
			? {
					style: {
						backgroundColor: _.secondColor
					}
			  }
			: null
	}

	useEffect(() => {
		if (!editVisible) {
			setEventSelected({})
		}
	}, [editVisible])

	const compare = (dateTimeA: any, dateTimeB: any) => {
		let tempA = new Date(dateTimeA)
		let tempB = new Date(dateTimeB)
		var momentA = moment(tempA, 'DD/MM/YYYY')
		var momentB = moment(tempB, 'DD/MM/YYYY')
		if (momentA > momentB) return 1
		else if (momentA < momentB) return -1
		else return 0
	}

	const fetchInfoRoomZoom = async (ID) => {
		try {
			const res = await CalendarApi.checkRoom(ID.toString())
			if (res.status === 200) {
				teacherChangeData({ Teacher: userInformation.UserInformationID, ID: ID })
				return true
			}
		} catch (error) {
			console.log('fetchInfoRoomZoom: ', error.message)
			showNoti('danger', error?.message)
			return false
		}
	}

	const styleEvent = ({ event }) => {
		const date = new Date()
		let checkDate = compare(moment(event.start).format('YYYY/MM/DD'), moment(date).format('YYYY/MM/DD')) // -1: qua roi, 0: hom nay, 1: chua qua

		const { ID, OpenDate, Title, eDateTime, eTime, sDateTime, sTime, Status, StatusName, TeacherAvatar } = event.resource

		const _update = async (param: any) => {
			setLoading(true)
			try {
				const res: any = await CalendarApi.update({ ...param, ID: ID })
				if (res.status == 200 || res.status == 204) {
					showNoti('success', 'Th??nh c??ng')
					getData()
					teacherChangeData({ Teacher: userInformation.UserInformationID, ID: ID })
				}
			} catch (error) {
				showNoti('danger', error?.message)
			} finally {
				setLoading(false)
			}
		}

		const _createRoom = async (data) => {
			setLoading(true)
			try {
				const res = await CalendarApi.createRoom(data?.id)
				if (res.status == 200) {
					getData()
					teacherChangeData({ Teacher: userInformation.UserInformationID, ID: data.id })
				}
			} catch (error) {
				showNoti('danger', error?.message)
			} finally {
				setLoading(false)
			}
		}

		const join = async (dataID) => {
			const res = await fetchInfoRoomZoom(dataID)
			res == true && window.open(`/course/zoom-view/${event?.id}/?isVideo=true`)
		}

		const content = (
			<div className="course-dt-event-info" style={{ maxWidth: 300, minWidth: 200 }}>
				<ul>
					<div style={{ width: '100%', flexDirection: 'column', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
						<Avatar
							className="shadow"
							src={!!TeacherAvatar ? TeacherAvatar : '/images/logo-square.png'}
							alt="avt"
							style={{ width: 90, height: 90 }}
						/>
						{event.resource?.TeacherName && (
							<span className="mt-4" style={{ fontWeight: 'bold', fontSize: 16 }}>
								{event.resource?.TeacherName}
							</span>
						)}
					</div>

					<hr style={{ background: 'rgba(0,0,0,0.1)' }} />

					{event?.name && (
						<li>
							<span style={{ fontWeight: 'bold' }}>Ti??u ?????:</span> {event?.name}
						</li>
					)}

					{event.resource?.VideoCourseName && (
						<li className="mb-3">
							<span style={{ fontWeight: 'bold' }}>Kh??a h???c: </span>
							{event.resource?.VideoCourseName}
						</li>
					)}

					{checkDate > -1 && (
						<>
							{Status == 1 && (
								<>
									{isTeach() ? (
										<>
											<Button
												size="middle"
												className="btn-warning w-100 shadow"
												onClick={() => {
													setDateSelected({ slots: '', start: event.start, end: event.end })
													setEventSelected(event)
													setEditvisible(true)
												}}
											>
												C???p nh???t
											</Button>
											<DeleteEvent
												teacherChangeData={teacherChangeData}
												title={event?.title}
												Status={Status}
												ID={event?.id}
												date={event?.start}
												getData={getData}
											/>
										</>
									) : (
										<>
											<BookEvent
												studentChangeData={studentChangeData}
												title={event?.title}
												Status={Status}
												ID={event?.id}
												date={event?.start}
												getData={getData}
											/>
										</>
									)}
								</>
							)}

							{Status == 2 && (
								<>
									{isTeach() ? (
										<>
											<DeleteEvent
												teacherChangeData={teacherChangeData}
												title={event?.title}
												Status={Status}
												ID={event?.id}
												date={event?.start}
												getData={getData}
											/>
										</>
									) : (
										<>
											<BookEvent
												studentChangeData={studentChangeData}
												title={event?.title}
												Status={Status}
												ID={event?.id}
												date={event?.start}
												getData={getData}
											/>
										</>
									)}
								</>
							)}

							{Status == 3 && (
								<>
									{isTeach() ? (
										<>
											<Button
												size="middle"
												className="btn-cancel w-100 mt-2 shadow"
												onClick={() => {
													setEventSelected(event)
													_update({ ID: event?.id, Status: 5 })
												}}
											>
												X??c nh???n d???y
											</Button>
										</>
									) : (
										<>
											<BookEvent
												studentChangeData={studentChangeData}
												title={event?.title}
												Status={Status}
												ID={event?.id}
												date={event?.start}
												getData={getData}
											/>
											<UpdateRequest
												studentChangeData={studentChangeData}
												event={event}
												title={event?.title}
												Status={Status}
												ID={event?.id}
												date={event?.start}
												getData={getData}
											/>
										</>
									)}
								</>
							)}

							{Status == 4 && (
								<>
									<RateEvent title={event?.title} Status={Status} ID={event?.id} date={event?.start} getData={getData} />
								</>
							)}

							{Status == 5 && (
								<div className="wrap-calendar-x">
									{isTeach() && (
										<Button size="middle" className="btn-cancel w-100 mt-2 shadow" onClick={() => _createRoom(event)}>
											T???o ph??ng {loading && <Spin className="ml-2" size="small" />}
										</Button>
									)}
								</div>
							)}

							{Status == 6 && (
								<>{!isTeach() && <RateEvent title={event?.title} Status={Status} ID={event?.id} date={event?.start} getData={getData} />}</>
							)}

							{Status == 7 && (
								<>
									{isTeach() && (
										<Button size="middle" className="btn-dark w-100 mt-2 shadow" onClick={() => _update({ ID: event?.id, Status: 8 })}>
											K???t th??c
										</Button>
									)}

									<Button
										size="middle"
										className="btn-cancel w-100 mt-2 shadow"
										onClick={() => {
											if (!!event?.id) {
												join(event?.id)
											}
										}}
									>
										Tham gia
									</Button>
								</>
							)}

							{Status == 8 && (
								<>
									{isTeach() ? (
										<>
											<div className="wrap-calendar-x">
												{isTeach() && (
													<Button size="middle" className="btn-cancel w-100 mt-2 shadow" onClick={() => _createRoom(event)}>
														T???o ph??ng m???i {loading && <Spin className="ml-2" size="small" />}
													</Button>
												)}
											</div>
											<div className="wrap-calendar-x">
												{isTeach() && (
													<Button
														size="middle"
														className="btn-warning w-100 mt-2 shadow"
														onClick={() => _update({ ID: event?.id, Status: 4 })}
													>
														Ho??n Th??nh {loading && <Spin className="ml-2" size="small" />}
													</Button>
												)}
											</div>
											<WarningEvent title={event?.title} Status={Status} ID={event?.id} date={event?.start} getData={getData} />
										</>
									) : (
										<>
											<RateEvent title={event?.title} Status={Status} ID={event?.id} date={event?.start} getData={getData} />
										</>
									)}
								</>
							)}
						</>
					)}

					{checkDate == 0 && Status == 9 && (
						<>
							{isTeach() ? (
								<Button
									size="middle"
									className="btn-cancel w-100 mt-2 shadow"
									onClick={() => {
										if (!!event?.id) {
											join(event?.id)
										}
									}}
								>
									B???t ?????u
								</Button>
							) : (
								<></>
							)}
						</>
					)}
				</ul>
			</div>
		)

		const getColor = () => {
			let color = ''

			if (Status == 2) {
				color = '#a5a5a5' // ???? H???Y
			} else {
				if (Status == 1) {
					color = _.primaryColor // GI??O VI??N V???A M???
				} else if (Status == 3) {
					color = '#2f7ed4' // ???? BOOK
				} else if (Status == 4) {
					color = '#4AB876' // ???? HO??N TH??NH
				} else if (Status == 5) {
					color = '#EF5DA8' // ???? X??C NH???N D???Y
				} else if (Status == 6) {
					color = '#ab5713' // L???I ?????T XU???T
				} else if (Status == 7) {
					color = '#1ccdcb' // ??ANG ZOOM
				} else if (Status == 8) {
					color = '#495ECA' // ???? K???T TH??C
				} else if (Status == 9) {
					color = '#172B4D' // ???? T???O PH??NG
				} else {
					color = _.primaryColor
				}
			}

			return color
		}

		return (
			<div
				className="calendar-item"
				onClick={(e) => {
					e.stopPropagation()
					e.nativeEvent.stopImmediatePropagation()
				}}
				style={{
					backgroundColor: getColor(),
					height: '100%'
				}}
			>
				<Popover
					zIndex={999}
					title={
						<div className="w-100 popover-title">
							{`${event?.title} ${checkDate == 0 ? ' [H??m nay]' : ''}`}
							<div>
								<ModalHistory ID={event?.id} title={event?.title} />
							</div>
						</div>
					}
					content={content}
					placement="rightTop"
					trigger={window.matchMedia('(max-width: 1199px)').matches ? 'click' : 'hover'}
				>
					<div className="course-dt-event">
						<div className="time in-1-line">{event?.title}</div>
						<div className="time-mobile" />
					</div>
				</Popover>
			</div>
		)
	}

	const _getDate = (range) => {
		const timestamp = Math.floor(!!range && range / 1000)
		var tempDate = new Date((timestamp + 11 * 24 * 60 * 60) * 1000)
		const date = moment(tempDate).format('YYYY/MM/DD')
		return date
	}

	const _RangeChange = useCallback((range) => {
		let start = !!range?.start ? range?.start : range[0]
		let end = !!range?.end ? range?.end : _getDate(range[0])
		!!onRangeChange &&
			onRangeChange({
				fromDate: moment(start).format('YYYY/MM/DD'),
				toDate: moment(end).format('YYYY/MM/DD')
			})
	}, [])

	return (
		<div className="wrap-calendar">
			<Spin spinning={loading} size="large" wrapperClassName="calendar-loading">
				<Calendar
					className="custom-calendar"
					localizer={localizer}
					defaultView="month"
					popup
					selectable
					onSelectEvent={handleSelectEvent}
					onSelectSlot={handleSelectSlot}
					style={{ minHeight: 600 }}
					startAccessor="start"
					endAccessor="end"
					formats={{
						agendaDateFormat: 'DD/MM/YYYY',
						monthHeaderFormat: (date) => moment(date).format('MM/YYYY'),
						dayHeaderFormat: (date) => {
							const dayArr = ['Ch??? Nh???t', 'Th??? 2', 'Th??? 3', 'Th??? 4', 'Th??? 5', 'Th??? 6', 'Th??? 7']
							const dayOffWeek = dayArr[moment(date).day()]
							return `${dayOffWeek} - ${moment(date).format('DD/MM')}`
						},
						dayRangeHeaderFormat: ({ start, end }) => `${moment(start).format('DD/MM')} - ${moment(end).format('DD/MM')}`
					}}
					components={{
						event: styleEvent
					}}
					events={events}
					eventPropGetter={eventPropGetter}
					dayPropGetter={dayPropGetter}
					onRangeChange={_RangeChange}
				/>
			</Spin>

			<div className="row m-0 p-0 pt-4" style={{ alignItems: 'center' }}>
				<div style={{ width: 15, height: 15, backgroundColor: _.primaryColor, marginRight: 10, marginLeft: 10 }} />
				<div>??ang m???</div>
				<div style={{ width: 15, height: 15, backgroundColor: '#a5a5a5', marginRight: 10, marginLeft: 10 }} />
				<div>???? h???y</div>
				<div style={{ width: 15, height: 15, backgroundColor: '#2f7ed4', marginRight: 10, marginLeft: 10 }} />
				<div>???? ?????t l???ch</div>
				<div style={{ width: 15, height: 15, backgroundColor: '#4AB876', marginRight: 10, marginLeft: 10 }} />
				<div>???? ho??n th??nh</div>
				<div style={{ width: 15, height: 15, backgroundColor: '#EF5DA8', marginRight: 10, marginLeft: 10 }} />
				<div>???? x??c nh???n d???y</div>
				<div style={{ width: 15, height: 15, backgroundColor: '#ab5713', marginRight: 10, marginLeft: 10 }} />
				<div>S??? c???</div>
				<div style={{ width: 15, height: 15, backgroundColor: '#1ccdcb', marginRight: 10, marginLeft: 10 }} />
				<div>??ang di???n ra</div>
				<div style={{ width: 15, height: 15, backgroundColor: '#495ECA', marginRight: 10, marginLeft: 10 }} />
				<div>???? k???t th??c</div>
				<div style={{ width: 15, height: 15, backgroundColor: '#172B4D', marginRight: 10, marginLeft: 10 }} />
				<div>???? t???o ph??ng</div>
			</div>

			<ModalCreateEvent
				visible={editVisible}
				event={eventSelected}
				setVisible={setEditvisible}
				getData={getData}
				date={dateSelected}
				courses={courses}
				teacherChangeData={teacherChangeData}
			/>

			<ModalCreateEvent
				teacherChangeData={teacherChangeData}
				visible={modalVisible}
				setVisible={setModalVisible}
				getData={getData}
				date={dateSelected}
				courses={courses}
			/>
		</div>
	)
}

export default CourseCalendar

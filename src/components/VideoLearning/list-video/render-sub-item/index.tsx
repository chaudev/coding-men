import React, { FC, useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import { Button, Tooltip, Dropdown, Menu, Radio } from 'antd'
import { VideoCourses } from '~/apiBase/video-learning'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faFileAlt } from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { useWrap } from '~/context/wrap'
import { VideoCourseOfStudent } from '~/apiBase'

type itemType = {
	ID: string
	Title: string
	TotalSecondLesson: string
	Description: string
	CompleteVsTotalLesson: string
	Second: string
	IsSeen: false
	LinkDocument: string
}

type props = {
	item: itemType
	data: any[]
	onPress: any
	section: any
	videoWatching: any
	fetchData: Function
	subVideos: any
}

const GroupMenu = (props: any) => {
	const { onClick, item, info, section } = props

	// e.stopPropagation()

	const _gotoTest = async () => {
		window.open(`/exam/exam-review/?examID=${info?.ExamTopicID}&lessionID=${info?.ID}&type=video`)
	}

	return (
		<Menu>
			{/* <Menu.Item onClick={() => onClick(0)}>
				<i className="far mr-3 fa-file-video btn-video" />
				Xem ở server 1
			</Menu.Item>

			<Menu.Item onClick={() => onClick(1)}>
				<i className="far mr-3 fa-file-code btn-html" />
				Xem ở server 2
			</Menu.Item> */}

			{!!info?.ExamTopicID && info?.ExamTopicID > 0 && (
				<>
					<Menu.Item onClick={_gotoTest}>
						<FontAwesomeIcon className="ml-1 mr-3" color="#172b4d" icon={faFileAlt as IconProp} size="lg" />
						Làm bài tập
					</Menu.Item>
				</>
			)}

			{!!item?.LinkDocument && (
				<Menu.Item onClick={() => onClick('down')}>
					<Button
						size="small"
						onClick={(e) => e.stopPropagation()}
						className="m-0 p-0 btn-down btn-trans"
						href={item.LinkDocument !== '' ? item.LinkDocument : ''}
						download={item.LinkDocument !== '' ? true : false}
					>
						<i className="far mr-3 fa-download btn-down-main" />
						Tải tài liệu
					</Button>
				</Menu.Item>
			)}
		</Menu>
	)
}

// RENDER SUB ITEM LIST
const RenderItemSub: FC<props> = ({ item, onPress, fetchData, videoWatching, section, subVideos }) => {
	const router = useRouter()
	const { showNoti, userInformation } = useWrap()
	const [type, setType] = useState(0)
	const [lessonDetail, setLessonDetail] = useState({})

	useEffect(() => {
		if (item?.ID == section?.LastLessonID) {
			handleClick(0)
		}
	}, [])

	// HANDLER CLICK ITEM => PLAY VIDEO
	const handleClick = async (e) => {
		await getLessonDetail(e)
	}

	// CALL API GET LESSION DETAIL
	const getLessonDetail = async (e) => {
		const temp = { VideoCourseOfStudentID: router.query.course, LessonID: item.ID }
		try {
			const res = await VideoCourses.LessonDetail(temp)
			res.status == 200 && setLessonDetail(res.data.data), onPress(getJsonData(res.data.data, e))
		} catch (err) {}
	}

	const getJsonData = (param, e) => {
		return {
			ID: param.ID,
			SectionID: section.ID,
			Description: param.Description,
			LinkDocument: param.LinkDocument,
			LinkHtml: param.LinkHtml,
			LinkVideo: param.LinkVideo,
			TimeWatched: param.TimeWatched,
			Second: item.Second,
			Title: item.Title,
			Type: e
		}
	}

	const _clickZero = (e) => {
		setType(0)
		handleClick(0)
		e.stopPropagation()
	}

	const _checkSeen = async (e) => {
		e.stopPropagation()
		const submitData = {
			VideoCourseOfStudentID: router.query.course,
			SectionID: section?.ID,
			LessonID: item?.ID,
			IsSeen: !item?.IsSeen
		}
		try {
			const response = await VideoCourseOfStudent.UpdateSeenAndTimeWatchedVideo(submitData)
			if (response.status == 200) {
				fetchData()
			}
		} catch (error) {
			showNoti('danger', error.message)
		}
	}

	const isStudent = () => {
		if (!!userInformation && userInformation.RoleID == 3) {
			return true
		} else {
			false
		}
	}

	const isFinal = () => {
		let index = subVideos.findIndex((e: any) => e.ID == item.ID)
		return index == subVideos.length - 1 ? true : false
	}

	return (
		<>
			<div
				onClick={_clickZero}
				className={`pt-3 pb-3 wrap-sub-item ${videoWatching == item.ID && 'sub-item-active'}`}
				style={{
					color: videoWatching == item.ID ? 'rgba(9,141,25,1)' : '',
					borderBottomLeftRadius: isFinal() ? 6 : 0,
					borderBottomRightRadius: isFinal() ? 6 : 0
				}}
			>
				<Tooltip title="Đã xem">
					<Radio disabled={!isStudent()} checked={item.IsSeen} onClick={_checkSeen} />
				</Tooltip>

				<div className="content row-center">
					<div className="title none-selection">{item.Title}</div>
					<Dropdown
						overlay={<GroupMenu section={section} info={item} item={lessonDetail} onClick={(e: any) => e.stopPropagation()} />}
						arrow={{ pointAtCenter: true }}
					>
						<FontAwesomeIcon className="icon-menu pl-3 pt-2 pb-1" icon={faEllipsisV as IconProp} />
					</Dropdown>
				</div>
			</div>

			{!isFinal() && <hr className="sub-item-hr" />}
		</>
	)
}

export default RenderItemSub

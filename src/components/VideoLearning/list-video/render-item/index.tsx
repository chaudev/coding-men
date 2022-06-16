import React, { FC, useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import { List, Radio } from 'antd'
import { VideoCourses } from '~/apiBase/video-learning'
import { useRouter } from 'next/router'
import RenderItemSub from '~/components/VideoLearning/list-video/render-sub-item'

type itemType = {
	ID: string
	Title: string
	TotalSecondLesson: string
	Description: string
	CompleteVsTotalLesson: string
	Second: string
	IsSeen: false
	LinkDocument: string
	IsExam: boolean
	ExamTopicID: number
	LastLessonID: number
	TotalLessonComplete: number
	TotalLesson: number
}

type props = {
	item: itemType
	data: any[]
	onPress: any
	watching: any
	playing: number
	setPlaying: Function
}

// RENDER ITEM LIST VIDEOS
const RenderItem: FC<props> = ({ item, onPress, data, watching, playing, setPlaying }) => {
	const router = useRouter()
	const [isShow, setShow] = useState(false)
	const [subVideos, setSubVideos] = useState([])
	const [reRender, setRender] = useState('')

	useEffect(() => {
		if (item.ID == watching) {
			console.log(`%cCurrent Video Section:` + `%c ${item.Title}`, 'color: yellow;', 'color: #00B0FF; font-weight: bold')
			handleClick('first')
		}
	}, [subVideos])

	useEffect(() => {
		setPlaying(item?.LastLessonID)
	}, [])

	// CLICK ITEM TO SHOW SUBITEM
	const handleClick = (type: string) => {
		if (!isShow && subVideos.length == 0) {
			getVideos()
		} else {
			type == 'first' ? setShow(true) : setShow(!isShow)
		}
	}

	// GET INDEXT OF ITEM IN LIST
	const getSectionNumber = () => {
		return data.indexOf(item) + 1
	}

	//GET DATA
	const getVideos = async () => {
		const temp = { SectionID: item.ID, VideoCourseOfStudentID: router.query.course }
		try {
			const res = await VideoCourses.ListLesson(temp)
			res.status == 200 && setSubVideos(res.data.data), setShow(true)
		} catch (err) {}
	}

	const _gotoTest = async () => {
		window.open(`/exam/exam-review/?examID=${item?.ExamTopicID}&sectionID=${item?.ID}&type=video`)
	}

	const _playVideo = (param) => {
		setRender(param.ID)
		onPress(param)
		setPlaying(param.ID)
	}

	const getPercen = () => {
		//
	}

	// RENDER
	return (
		<div className="mb-3 wrap-video-item">
			<div className="p-3 wrap-render-item bottom-borde" onClick={() => handleClick('none')}>
				<Radio disabled={false} checked={item?.TotalLesson == item?.TotalLessonComplete ? true : false} />
				<div className="title none-selection">
					<div className="left mr-2">
						<div className="row m-0 p-0">
							<div style={{ flex: 1 }}>{item.Title}</div>
						</div>
						<div className="row m-0 p-0 date none-selection">
							<div>
								Đã hoàn thành: {item?.TotalLessonComplete}/{item?.TotalLesson}
							</div>
						</div>
					</div>
				</div>
				<i className={`mr-2 ml-2 far ${isShow ? 'fa-chevron-up' : 'fa-chevron-down'} `} />
			</div>
			{isShow && (
				<>
					{!!item && item?.IsExam && item?.ExamTopicID > 0 && (
						<>
							<div className="w-exam">
								<div onClick={_gotoTest} className="text">
									Làm bài kiểm tra
								</div>
							</div>
						</>
					)}
					<List
						itemLayout="horizontal"
						dataSource={subVideos || []}
						renderItem={(i) => (
							<RenderItemSub
								onPress={(p) => _playVideo(p)}
								fetchData={getVideos}
								videoWatching={playing}
								data={data}
								item={i}
								section={item}
								subVideos={subVideos}
							/>
						)}
					/>
				</>
			)}
		</div>
	)
}

export default RenderItem

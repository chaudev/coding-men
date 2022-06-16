import { Card, Drawer, Spin } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { VideoCourseOfStudent, VideoCourses } from '~/apiBase/video-learning'
import HeaderVideo from '~/components/VideoLearning/header'
import VideoList from '~/components/VideoLearning/list-video'
import VideoTabs from '~/components/VideoLearning/tabs'
import { useWrap } from '~/context/wrap'
import { usePageVisibility } from '~/utils/functions'
import Lottie from 'react-lottie-player'
import 'react-circular-progressbar/dist/styles.css'

import empty from '~/components/json/empty-box.json'

let numberRender: number = 1

const useUnload = (fn) => {
	const cb = useRef(fn)

	useEffect(() => {
		cb.current = fn
	}, [fn])

	useEffect(() => {
		const onUnload = (...args) => cb.current?.(...args)
		window.addEventListener('beforeunload', onUnload)
		return () => window.removeEventListener('beforeunload', onUnload)
	}, [])
}

const useBeforeUnload = (fn) => {
	window.onbeforeunload = function () {
		fn()
		return 'Bạn thật sự muốn đóng video đang xem?'
	}
}

const VideoLearning = () => {
	const router = useRouter()
	const { userInformation, showNoti } = useWrap()

	const videoStudy = useRef(null)
	const [currentVideo, setCurrentVideo] = useState(null)
	const [videos, setVideos] = useState([])
	const [currentLession, setCurrentLession] = useState({ ID: '', Title: '', Description: '', Type: 0, SectionID: '', Second: 0 })

	useEffect(() => {
		if (router.query.course !== undefined) {
			getVideos()
		}
	}, [])

	// RELOAD TAB
	useUnload((e) => {
		updateTime()
		e.preventDefault()
		e.returnValue = ''
	})

	// CLOSE WINDOW OR TAB
	if (typeof window !== 'undefined') {
		useBeforeUnload(() => updateTime())
	}

	// HANDLE VISIT PAGE
	const handleVisibilityChange = (visible) => {
		if (videoStudy.current !== null) {
			if (videoStudy.current.currentTime !== 0) {
				updateTime()
			}
		}
	}

	usePageVisibility(handleVisibilityChange)

	const updateTime = async () => {
		if (videoStudy.current !== null) {
			if (videoStudy.current.currentTime !== 0 && currentLession.ID !== '') {
				let temp = {
					VideoCourseOfStudentID: router.query.ID,
					SectionID: currentLession.SectionID,
					LessonID: currentLession.ID,
					IsSeen: videoStudy.current.duration / 2 < videoStudy.current.currentTime ? 'True' : 'False', // True - False: đánh dấu đã xem video
					TimeWatched: videoStudy.current.currentTime // (giây) Thời gian đã xem video
				}
				try {
					const res = await VideoCourseOfStudent.UpdateSeenAndTimeWatchedVideo(temp)
				} catch (error) {}
			}
		}
	}

	// //GET DATA
	const getVideos = async () => {
		try {
			const res = await VideoCourses.ListSection(router.query.course)
			res.status == 200 && setVideos(res.data.data)
		} catch (err) {
			showNoti('danger', err?.message)
		}
	}

	// // DRAWER VIDEO LIST STATE
	const [visible, setVisible] = useState(false)

	function Iframe(props) {
		const { src } = props

		return (
			<>
				{!!src && <iframe id="video__course__iframe" className="responsive-iframe" ref={videoStudy} src={src} allowFullScreen />}{' '}
				{!src && (
					<div className="flex-center responsive-iframe" style={{ background: '#000' }}>
						<Spin size="large" />
					</div>
				)}
			</>
		)
	}

	console.log('--- RENDER: ', numberRender)
	numberRender = numberRender + 1

	// RENDER
	return (
		<div className="w-video-learning custom-scroll-bar">
			<HeaderVideo params={router.query} onClick={() => setVisible(!visible)} />
			<div className="row w-100 m-0 p-0 pt-3 w-main">
				<div className="col-md-9 col-12 scrollable">
					<Card className="card-main box-shadow">
						{!!currentVideo ? (
							<div className="video">
								<Iframe src={currentVideo} />
							</div>
						) : (
							<div className="none-video">
								{/* @ts-ignore */}
								<Lottie loop animationData={empty} play className="inner" />
								<div className="size-16 text">Không có video</div>
							</div>
						)}
						<VideoTabs lession={currentLession} />
					</Card>
				</div>

				<div className="col-md-3 col-12 scrollable">
					<Card className="w-100 card-list box-shadow">
						<VideoList
							onPress={(p) => {
								setCurrentLession(p)
								p.Type === 0 ? setCurrentVideo(p.LinkVideo) : setCurrentVideo(p.LinkHtml)
							}}
							videos={videos}
						/>
					</Card>
				</div>
			</div>

			<Drawer
				title="Nội dung khóa học"
				placement="right"
				onClose={() => setVisible(false)}
				visible={visible}
				className="video-drawer custom-scroll-bar"
				headerStyle={{
					paddingTop: 24,
					paddingBottom: 24,
					background: '#fff'
				}}
			>
				<div className="wrap-menu-drawer ">
					<VideoList
						onPress={(p) => {
							setCurrentLession(p)
							setCurrentVideo(p?.LinkVideo)
						}}
						videos={videos}
					/>
				</div>
			</Drawer>
		</div>
	)
}

export default VideoLearning

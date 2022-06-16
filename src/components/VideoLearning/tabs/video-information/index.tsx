import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import { Descriptions, Spin } from 'antd'
import ReactHtmlParser from 'react-html-parser'
import { useRouter } from 'next/router'
import { VideoCourseDetailApi } from '~/apiBase/video-course-details'

const defaultDetails = {
	VideoCourseName: '',
	Slogan: '',
	CourseForObject: '',
	Requirements: '',
	ResultsAchieved: '',
	Description: ''
}

const VideoInfomation = () => {
	const router = useRouter()
	const [details, setDetails] = useState<any>(defaultDetails)

	useEffect(() => {
		if (!!router.query.course) {
			getCourseDetails()
		}
	}, [])

	const getCourseDetails = async () => {
		try {
			const res = await VideoCourseDetailApi.getDetails(router.query.course)
			res.status == 200 && setDetails(res.data.data)
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className="wrap-infomation">
			<Descriptions className="ml-3 " column={1} title="Thông tin khóa học" bordered>
				{details?.VideoCourseName == '' ? (
					<Spin size="default" />
				) : (
					<>
						<Descriptions.Item label="Tên khóa học">{ReactHtmlParser(details?.VideoCourseName)}</Descriptions.Item>
						<Descriptions.Item label="Slogan">{ReactHtmlParser(details?.Slogan)}</Descriptions.Item>
						<Descriptions.Item label="Đối tượng học">{ReactHtmlParser(details?.CourseForObject)}</Descriptions.Item>
						<Descriptions.Item label="Điều kiện học">{ReactHtmlParser(details?.Requirements.split('xlink:').join(''))}</Descriptions.Item>
						<Descriptions.Item label="Nội dung khóa học">{ReactHtmlParser(details?.ResultsAchieved)}</Descriptions.Item>
						<Descriptions.Item label="Giới thiệu">{ReactHtmlParser(details?.Description)}</Descriptions.Item>
					</>
				)}
			</Descriptions>
		</div>
	)
}

export default VideoInfomation

import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import Link from 'next/link'
import { parseToMoney } from '~/utils/functions'
import { Spin, Input, Avatar, Rate, Anchor, Button } from 'antd'
import { useWrap } from '~/context/wrap'
import ModalUpdateDetail from '~/lib/video-course/modal-update-details'
import ModalUpdateInfo from '~/lib/video-course/modal-update-info'
import RatingStar from '~/components/RatingStar'
import { VideoCourseStoreApi } from '~/apiBase/video-course-store'
import ReactStars from 'react-rating-stars-component'
import { userInfo } from 'os'
import { useRouter } from 'next/router'

// CARD ITEM ON VIDEO COURSE
const RenderItemTeacher = (props) => {
	const { item, loading, router } = props
	const { userInformation, showNoti } = useWrap()
	const [showModalUpdate, setShowModalUpdate] = useState(false)
	const [showModalEdit, setShowModalEdit] = useState(false)
	const [activing, setActiving] = useState(false)
	const [code, setCode] = useState('')

	const route = useRouter()

	const params = {
		Avatar: item?.Avatar,
		FullNameUnicode: item?.FullNameUnicode,
		TotalBooking: item.TotalBooking,
		AverageRating: item.AverageRating,
		TotalFeedback: item.TotalFeedback,
		Introduce: item.Introduce,
		IntroduceByVideo: item.IntroduceByVideo,
		ButtonBooking: item?.ButtonBooking
	}

	return (
		<>
			<div className="teacher-picker">
				<Link href={{ pathname: router, query: params }}>
					<div className="item" style={{ height: 350 }}>
						{userInformation && userInformation.RoleID === 3 && item && item.isBought && (
							<div className="course-paid-icon">
								<img src="/images/paid.png" alt="paid icon" />
							</div>
						)}

						<Avatar className="avatar" src={!!item?.Avatar ? item?.Avatar : '/images/logo-square.png'} alt="avatar" />

						<h4 className="title ml-3 mr-3 in-1-line">{item.FullNameUnicode}</h4>

						{/* <span className="ml-3 mr-3 mt-1 in-1-line">
							{item.TotalBooking} lượt đăng ký - {item.TotalFeedback} lượt đánh giá
						</span> */}

						{/* <Rate className="mt-1 mb-1" disabled count={5} value={item.AverageRating} /> */}

						<span className="ml-3 mr-3 mt-1 in-3-line" style={{ textAlign: 'center' }}>
							{!!item.Introduce && item.Introduce}
						</span>

						<Button
							onClick={(e) => {
								e.stopPropagation()
								route.push({
									pathname: '/course/calendar/',
									query: {
										teacher: item?.UserInformationID
									}
								})
							}}
							disabled={item.ButtonBooking == 'available' ? false : true}
							className="btn btn-primary mt-3 w-100"
						>
							Đặt Lịch Ngay
						</Button>
					</div>
				</Link>
			</div>
		</>
	)
}

export default RenderItemTeacher

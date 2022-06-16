import { Avatar, Button, Card, Input, List, Modal, notification, Rate, Tooltip } from 'antd'
import 'antd/dist/antd.css'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { VideoCourseListApi } from '~/apiBase'
import { teacherApi } from '~/apiBase'
import { CalendarApi } from '~/apiBase/Calendar/calendar'
import { VideoCourseCardApi, VideoCourseStoreApi } from '~/apiBase/video-course-store'
import { VideoCourseCategoryApi } from '~/apiBase/video-course-store/category'
import { VideoCourseCurriculumApi } from '~/apiBase/video-course-store/get-list-curriculum'
import { VideoCourseLevelApi } from '~/apiBase/video-course-store/level'
import { videoTagApi } from '~/apiBase/video-tag'
import FilterVideoCourses from '~/components/Global/Option/FilterTable/FilterVideoCourses'
import LayoutBase from '~/components/LayoutBase'
import RenderItemTeacher from '~/components/VideoCourse/RenderItemTeacher'
import RenderItemCard from '~/components/VideoCourse/RenderItemTeacher'
import { useWrap } from '~/context/wrap'
import ModalCreateVideoCourse from '~/lib/video-course/modal-create-video-course'
import ReactHtmlParser from 'react-html-parser'

const key = 'updatable'
const { Search } = Input

let pageIndex = 1

const TeacherDetails = () => {
	const router: any = useRouter()
	const slug = router.query.slug
	const { userInformation, pageSize, showNoti, handleReloadNoti, getTitlePage } = useWrap()
	const [data, setData] = useState([])
	const [showModal, setShowModal] = useState(false)
	const [rerender, setRender] = useState('')
	const [isLoading, setIsLoading] = useState({ type: 'GET_ALL', status: true })
	const [addToCardLoading, setAddToCardLoading] = useState(false)
	const [totalPage, setTotalPage] = useState(null)
	const listTodoApi = {
		pageSize: 100,
		pageIndex: pageIndex,
		search: null,

		curriculumId: 0
	}
	const [todoApi, setTodoApi] = useState(listTodoApi)
	const [dataCurriculum, setDataCurriculum] = useState([])
	const [dataTeacher, setDataTeacher] = useState([])
	const [category, setCategory] = useState([])
	const [categoryLevel, setCategoryLevel] = useState([])
	const [buyNowLoading, setByNowLoading] = useState(false)

	const openNotification = () => {
		notification.open({
			key,
			message: 'Không thành công',
			description: 'Vui lòng kiểm tra lại!'
		})
		setTimeout(() => {
			notification.open({
				key,
				message: 'Không thành công',
				description: 'Vui lòng kiểm tra lại!'
			})
		}, 1000)
	}

	// FIRST GET DATA
	useEffect(() => {
		if (userInformation !== null) {
			getTeachers()
		}
		getTitlePage('Danh sách giáo viên')
	}, [userInformation])

	//GET DATA
	const getTeachers = async () => {
		// ADMIN & HOC VIEN
		setIsLoading({ type: 'GET_ALL', status: true })

		try {
			// ADMIN
			const res = await CalendarApi.getTeachers(todoApi)
			res.status == 200 && (setData(res.data.data), setTotalPage(res.data.totalRow))

			setRender(res + '')
			setIsLoading({ type: 'GET_ALL', status: false })
		} catch (err) {}
	}

	const [tags, setTags] = useState([])

	// ADD COURSE VIDEO TO CART
	const postAddToCard = async (data, type) => {
		try {
			const res = await VideoCourseCardApi.add(data)
			if (type == 1) {
				res.status == 200 && setShowModal(true)
				res.status !== 200 && openNotification()
				handleReloadNoti()
			} else {
				router.push('/cart/check-out')
			}
		} catch (error) {
		} finally {
			if (type == 1) {
				setAddToCardLoading(false)
				setByNowLoading(false)
			}
		}
	}

	// HANDLE AD TO CARD (STUDENT)
	const addToCard = (p, type) => {
		type == 1 ? setAddToCardLoading(true) : setByNowLoading(true)

		let temp = {
			VideoCourseID: p.ID,
			Quantity: 1
		}
		postAddToCard(temp, type)
	}

	// CREATE NEW COURSE
	const createNewCourse = async (param) => {
		setIsLoading({ type: 'GET_ALL', status: true })
		let temp = {
			CategoryID: param.CategoryID,
			TagArray: param.TagArray,
			LevelID: param.LevelID,
			CurriculumID: param.CurriculumID,
			VideoCourseName: param.VideoCourseName,
			EnglishName: param.EnglishName,
			ChineseName: param.ChineseName,
			ImageThumbnails: param.ImageThumbnails,
			OriginalPrice: param.OriginalPrice,
			SellPrice: param.SellPrice,
			Slogan: param.Slogan,
			Requirements: param.Requirements,
			Description: param.Description,
			ResultsAchieved: param.ResultsAchieved,
			CourseForObject: param.CourseForObject,
			TeacherID: param.TeacherID,
			ExpiryDays: param.ExpiryDays,
			LimitMinutes: param.LimitMinutes,
			LimitBooking: param.LimitBooking,
			RequestPoint: param.RequestPoint
		}

		try {
			const res = await VideoCourseStoreApi.add(temp)
			res.status == 200 && showNoti('success', 'Thêm thành công')
			res.status !== 200 && showNoti('danger', 'Thêm không thành công')
			getTeachers()
		} catch (error) {
			showNoti('danger', 'Thêm không thành công')
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false })
		}
	}

	useEffect(() => {
		if (todoApi !== listTodoApi) {
			getTeachers()
		}
	}, [todoApi])

	// HANDLE SEARCH
	const handleSearch = (e) => {
		let newTodoApi = {
			...listTodoApi,
			pageIndex: 1,
			search: e
		}
		setTodoApi(newTodoApi)
	}

	// RESET FILTER
	const handleReset = () => {
		setTodoApi({
			...listTodoApi,
			pageIndex: 1
		})
	}

	// FILTER
	const handleFilter = (paramFilter: any) => {
		let newTodoApi = {
			...listTodoApi,
			categoryId: paramFilter.Type,
			levelId: paramFilter.Level,
			fromDate: paramFilter.fromDate,
			toDate: paramFilter.toDate
		}
		setTodoApi(newTodoApi)
	}

	// HANDLE CHANGE PAGE
	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber
		setTodoApi({
			...todoApi,
			pageIndex: pageIndex
		})
	}

	const [activeLoading, setActiveLoading] = useState(false)

	// UPDATE COURSE
	const handleActive = async (param) => {
		setActiveLoading(true)
		try {
			const res = await VideoCourseListApi.updateActiveCode(param)
			res.status == 200 && showNoti('success', 'Thành công')
			res.status === 204 && showNoti('danger', 'Thành công')
			getTeachers()
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setActiveLoading(false)
		}
	}

	// CARD EXTRA
	const Extra = () => {
		return (
			<div className="row m-0 vc-store_extra-table">
				<div className="row m-0">
					<div className="row m-0 st-fb-100w ">
						<div>
							<FilterVideoCourses
								handleReset={handleReset}
								dataLevel={categoryLevel}
								dataCategory={category}
								handleFilter={(value: any) => handleFilter(value)}
							/>
						</div>
						<Search
							className="fb-btn-search style-input vc-teach-modal_search"
							size="large"
							placeholder="Tìm kiếm"
							onSearch={(e) => {
								handleSearch(e)
							}}
						/>
					</div>
				</div>
			</div>
		)
	}

	const route = useRouter()

	// RENDER
	return (
		<div className="row details-teacher">
			<div className="col-md-3 col-12 mt-0 mb-3">
				<Card loading={isLoading.status} title={null}>
					<div className="info">
						<Avatar className="avatar" src={!!router?.query?.Avatar ? router?.query?.Avatar : '/images/logo-square.png'} alt="avatar" />
						<div className="name mt-4">{router.query?.FullNameUnicode}</div>
						{/* <span className="mt-2 in-1-line">
							{router.query?.TotalBooking} lượt đăng ký - {router.query?.TotalFeedback} lượt đánh giá
						</span>
						<Rate className="mt-2 mb-3" disabled count={5} value={router.query?.AverageRating} /> */}

						<Button
							onClick={(e) => {
								e.stopPropagation()
								route.push({
									pathname: '/course/calendar/',
									query: {
										teacher: router.query?.UserInformationID
									}
								})
							}}
							disabled={router.query?.ButtonBooking == 'available' ? false : true}
							className="btn btn-primary"
						>
							Đặt Lịch Ngay
						</Button>
					</div>
				</Card>
			</div>

			<div className="col-md-9 col-12 mt-0 mb-0">
				<Card style={{ width: '100%' }} loading={isLoading.status} title={null}>
					<div className="introduce">
						<div className="title mt-1">Giới thiệu</div>
						<hr />
						<p>{router.query?.Introduce}</p>
						{!!router.query?.IntroduceByVideo && (
							<>
								<div className="title mt-3">Video giới thiệu</div>
								<hr />
								{ReactHtmlParser(router.query?.IntroduceByVideo)}
							</>
						)}
					</div>
				</Card>
			</div>
			{/* <Card style={{ width: '100%' }} loading={isLoading.status} title={null}>
				<div className="col-md-4 col-12" style={{ background: 'red', height: 100 }}></div>
				<div className="col-md-8 col-12" style={{ background: 'blue', height: 100 }}></div>
			</Card> */}
		</div>
	)
}

TeacherDetails.layout = LayoutBase
export default TeacherDetails

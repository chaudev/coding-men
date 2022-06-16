import { Card, Input, List, Modal, notification } from 'antd'
import 'antd/dist/antd.css'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { VideoCourseListApi } from '~/apiBase'
import { teacherApi } from '~/apiBase'
import { VideoCourseCardApi, VideoCourseStoreApi } from '~/apiBase/video-course-store'
import { VideoCourseCategoryApi } from '~/apiBase/video-course-store/category'
import { VideoCourseCurriculumApi } from '~/apiBase/video-course-store/get-list-curriculum'
import { VideoCourseLevelApi } from '~/apiBase/video-course-store/level'
import { videoTagApi } from '~/apiBase/video-tag'
import FilterVideoCourses from '~/components/Global/Option/FilterTable/FilterVideoCourses'
import LayoutBase from '~/components/LayoutBase'
import RenderItemCard from '~/components/VideoCourse/RenderItemCourseStudent'
import { useWrap } from '~/context/wrap'
import ModalCreateVideoCourse from '~/lib/video-course/modal-create-video-course'

const key = 'updatable'
const { Search } = Input

let pageIndex = 1

const baseTodo = {
	pageIndex: pageIndex,
	search: null,
	categoryId: null,
	levelId: null,
	fromDate: null,
	toDate: null,
	Category: null,
	Level: null
}

const VideoCourseStore = () => {
	const router = useRouter()
	const { userInformation, pageSize, showNoti, handleReloadNoti, getTitlePage } = useWrap()
	const [data, setData] = useState([])
	const [showModal, setShowModal] = useState(false)
	const [rerender, setRender] = useState('')
	const [isLoading, setIsLoading] = useState({ type: 'GET_ALL', status: true })
	const [addToCardLoading, setAddToCardLoading] = useState(false)
	const [totalPage, setTotalPage] = useState(null)
	const listTodoApi = { ...baseTodo, pageIndex: pageIndex }
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
			// ADMIN & HOC VIEN
			getAllArea()
		}
		getTitlePage('Khóa học video')
	}, [userInformation])

	//GET DATA
	const getAllArea = async () => {
		// ADMIN & HOC VIEN
		setIsLoading({ type: 'GET_ALL', status: true })

		getCategory()

		try {
			if (userInformation?.RoleID == 1 || userInformation?.RoleID == 2 || userInformation?.RoleID == 6) {
				// ADMIN
				const res = await VideoCourseStoreApi.getAll(todoApi)
				res.status == 200 && (setData(res.data.data), setTotalPage(res.data.totalRow))
				if (userInformation?.RoleID != 6) {
					getCurriculum()
					getTeacherOption()
				}
				setRender(res + '')
				setIsLoading({ type: 'GET_ALL', status: false })
			} else {
				// HOC VIEN
				const res = await VideoCourseStoreApi.getAllForStudent({ ...todoApi, pageSize: 10 })
				res.status == 200 && (setData(res.data.data), setTotalPage(res.data.totalRow))
				setRender(res + '')
				setIsLoading({ type: 'GET_ALL', status: false })
			}
		} catch (err) {}
	}

	// GET TEACHER LEVEL
	const getTeacherOption = async () => {
		try {
			const res = await teacherApi.getAll({ pageIndex: 1, pageSize: 9999, search: null })
			res.status == 200 && setDataTeacher(res.data.data)
			setRender(res + '')
		} catch (err) {}
	}

	//GET DATA CURRICULUM LEVEL
	const getCurriculum = async () => {
		try {
			const res = await VideoCourseCurriculumApi.getCurriculum()
			res.status == 200 && setDataCurriculum(res.data.data)
			setRender(res + '')
		} catch (err) {}
	}

	//GET DATA CATEGORY LEVEL
	const getCategory = async () => {
		try {
			const res = await VideoCourseCategoryApi.getAll({ pageIndex: 1, pageSize: 9999, search: null })
			res.status == 200 && setCategory(res.data.data)
			setRender(res + '')
			getCategoryLevel()
		} catch (err) {}
	}

	const [tags, setTags] = useState([])

	//GET DATA CATEGORY LEVEL
	const getCategoryLevel = async () => {
		try {
			const res = await VideoCourseLevelApi.getAll({ pageIndex: 1, pageSize: 9999, search: null })
			res.status == 200 && setCategoryLevel(res.data.data)
			getTags()
			setRender(res + '')
		} catch (err) {}
	}

	const getTags = async () => {
		try {
			const response = await videoTagApi.getAll()
			response.status == 200 && setTags(response.data.data)
		} catch (error) {
			showNoti('danger', 'Không lấy được tag')
		}
	}

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
			getAllArea()
		} catch (error) {
			showNoti('danger', 'Thêm không thành công')
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false })
		}
	}

	useEffect(() => {
		if (todoApi !== listTodoApi) {
			getAllArea()
		}
	}, [todoApi])

	// HANDLE SEARCH
	const handleSearch = (e) => {
		let newTodoApi = { ...listTodoApi, pageIndex: 1, search: e }
		setTodoApi(newTodoApi)
	}

	// RESET FILTER
	const handleReset = () => {
		setTodoApi({ ...listTodoApi, pageIndex: 1 })
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
		setTodoApi({ ...todoApi, pageIndex: pageIndex })
	}

	const [activeLoading, setActiveLoading] = useState(false)

	// UPDATE COURSE
	const handleActive = async (param) => {
		setActiveLoading(true)
		try {
			const res = await VideoCourseListApi.updateActiveCode(param)
			res.status == 200 && showNoti('success', 'Thành công')
			res.status === 204 && showNoti('danger', 'Thành công')
			getAllArea()
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setActiveLoading(false)
		}
	}

	// CARD EXTRA
	const Extra = () => {
		return (
			<div className="row m-0 vc-teach-extra">
				<FilterVideoCourses
					handleReset={handleReset}
					dataLevel={categoryLevel}
					dataCategory={category}
					handleFilter={(value: any) => handleFilter(value)}
				/>

				<Search
					className="fb-btn-search style-input vc-teach-modal_search"
					size="large"
					placeholder="Tìm kiếm"
					onSearch={(e) => handleSearch(e)}
					style={{ flex: 1 }}
				/>
			</div>
		)
	}

	const [miniFilter, setMiniFilter] = useState<any>({})

	const getTop5 = () => {
		let temp = []
		temp.push({ ID: -1, Title: 'Tất cả', Type: 'category' })
		for (let i = 0; i < category.length; i++) {
			const element: any = category[i]
			if (i < 2) {
				temp.push({ ID: element.ID, Title: element.CategoryName, Type: 'category' })
			}
		}
		for (let i = 0; i < categoryLevel.length; i++) {
			const element: any = categoryLevel[i]
			if (i < 2) {
				temp.push({ ID: element.ID, Title: element.LevelName, Type: 'level' })
			}
		}
		return temp
	}

	const _clickMiniFilter = (param: any) => {
		setMiniFilter(param)
		if (param.ID == -1) {
			setTodoApi({ ...todoApi, levelId: null, categoryId: null })
		} else {
			if (param?.Type == 'category') {
				setTodoApi({ ...todoApi, levelId: null, categoryId: param.ID })
			} else {
				setTodoApi({ ...todoApi, categoryId: null, levelId: param.ID })
			}
		}
	}

	// RENDER
	return (
		<div className="">
			{userInformation !== null && (
				<Card
					style={{ width: '100%' }}
					loading={isLoading.status}
					title={<div className="m-2">{Extra()}</div>}
					extra={
						userInformation?.RoleID !== 1 ? null : (
							<div className="vc-teach-modal_header">
								<ModalCreateVideoCourse
									dataTeacher={dataTeacher}
									_onSubmit={(data: any) => createNewCourse(data)}
									dataLevel={categoryLevel}
									dataCategory={category}
									dataCurriculum={dataCurriculum}
									showAdd={false}
									isLoading={false}
									refeshData={() => getAllArea()}
									tags={tags}
									onRefeshTags={() => getTags()}
								/>
							</div>
						)
					}
				>
					<div className="row ml-2 mr-2 w-100">
						{getTop5().map((value: any, index: number) => (
							<div onClick={() => _clickMiniFilter(value)} className="mb-3 btn-recommend none-selection">
								{value?.Title}
							</div>
						))}
					</div>
					{/* <div className="ml-2 size-16">
						Được <span className="bold purple">đặt lịch thực hành luyện tập phát âm, trao đổi trực tiếp với giáo viên</span> trên hệ thống
						phòng học online của
						<span className="bold orange"> IELTS Nguyễn Huyền</span>
					</div> */}
					<>
						<List
							itemLayout="horizontal"
							dataSource={data}
							grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 5 }}
							renderItem={(item) => (
								<RenderItemCard
									loading={addToCardLoading}
									buyNowLoading={buyNowLoading}
									activeLoading={activeLoading}
									addToCard={addToCard}
									item={item}
									dataTeacher={dataTeacher}
									handleActive={handleActive}
									refeshData={() => getAllArea()}
									categoryLevel={categoryLevel}
									dataCategory={category}
									dataCurriculum={dataCurriculum}
									tags={tags}
									onRefeshTags={() => getTags()}
								/>
							)}
							pagination={{
								onChange: getPagination,
								total: totalPage,
								size: 'small',
								current: pageIndex
							}}
						/>

						<Modal
							title="Thêm vào giỏ hàng"
							visible={showModal}
							confirmLoading={false}
							className="vc-store_modal"
							footer={null}
							onCancel={() => setShowModal(false)}
							width={500}
						>
							<div className="m-0 row vc-store-center vc-store-space-beetween">
								<div className="m-0 row vc-store-center">
									<i className="fas fa-check-circle vc-store_modal_icon"></i>
									<span className="vc-store_modal_title">Thêm thành công</span>
								</div>
								<a href="/cart/shopping-cart">
									<button type="button" className="btn btn-primary">
										Đến giỏ hàng
									</button>
								</a>
							</div>
						</Modal>
					</>
				</Card>
			)}
		</div>
	)
}

VideoCourseStore.layout = LayoutBase
export default VideoCourseStore

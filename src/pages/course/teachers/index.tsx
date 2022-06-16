import { Card, Input, List, Modal } from 'antd'
import 'antd/dist/antd.css'
import React, { useEffect, useState } from 'react'
import { CalendarApi } from '~/apiBase/Calendar/calendar'
import FilterTeacher from '~/components/Global/Option/FilterTable/FilterTeacher'
import LayoutBase from '~/components/LayoutBase'
import RenderItemTeacher from '~/components/VideoCourse/RenderItemTeacher'
import { useWrap } from '~/context/wrap'

const { Search } = Input

const listTodoApi = {
	pageSize: 100,
	pageIndex: 1,
	search: null,
	curriculumId: 0
}

const TeacherList = () => {
	const { userInformation, showNoti, getTitlePage } = useWrap()
	const [data, setData] = useState([])
	const [showModal, setShowModal] = useState(false)
	const [isLoading, setIsLoading] = useState({ type: 'GET_ALL', status: true })

	const [todoApi, setTodoApi] = useState(listTodoApi)
	const [options, setOptions] = useState([])

	// FIRST GET DATA
	useEffect(() => {
		!!userInformation && getTeachers()
		getTitlePage('Danh sách giáo viên')
	}, [userInformation])

	//GET DATA
	const getTeachers = async () => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			const res = await CalendarApi.getTeachers(todoApi)
			res.status == 200 && setData(res.data.data)
			setIsLoading({ type: 'GET_ALL', status: false })
		} catch (err) {
			showNoti('danger', err?.message)
		} finally {
			options.length == 0 && getOptions()
		}
	}

	// GET DATA FILTER
	const getOptions = async () => {
		try {
			const res = await CalendarApi.getOptionCurriculum()
			res.status == 200 && setOptions(res.data.data)
		} catch (err) {
			showNoti('danger', err?.message)
		}
	}

	useEffect(() => {
		todoApi !== listTodoApi && getTeachers()
	}, [todoApi])

	// HANDLE SEARCH
	const handleSearch = (e: any) => {
		let newTodoApi = { ...listTodoApi, pageIndex: 1, search: e }
		setTodoApi(newTodoApi)
	}

	// RESET FILTER
	const handleReset = () => {
		setTodoApi({ ...listTodoApi, pageIndex: 1 })
	}

	// FILTER
	const handleFilter = (paramFilter: any) => {
		let newTodoApi = { ...listTodoApi, curriculumId: paramFilter.CurriculumID }
		setTodoApi(newTodoApi)
	}

	// CARD EXTRA
	const Extra = () => {
		return (
			<div className="extra">
				<div>
					<FilterTeacher handleReset={handleReset} data={options} handleFilter={(value: any) => handleFilter(value)} />
				</div>
				<Search
					className="fb-btn-search style-input search"
					size="large"
					placeholder="Tìm kiếm"
					onSearch={(e) => {
						handleSearch(e)
					}}
				/>
			</div>
		)
	}

	// RENDER
	return (
		<div className="wrap-teacher-picker">
			{userInformation !== null && (
				<Card style={{ width: '100%' }} loading={isLoading.status} title={<div className="m-2">{Extra()}</div>}>
					<List
						itemLayout="horizontal"
						dataSource={data}
						grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 3, xxl: 4 }}
						renderItem={(item: any) => (
							<RenderItemTeacher router={`/course/teachers/${item?.UserInformationID}`} loading={isLoading} item={item} />
						)}
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
				</Card>
			)}
		</div>
	)
}

TeacherList.layout = LayoutBase
export default TeacherList

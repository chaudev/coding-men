import { faFileVideo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card, Image, List, Input } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { packageApi, packageStudentApi } from '~/apiBase'
import { VideoCourseStoreApi } from '~/apiBase/video-course-store'
import SearchBox from '~/components/Elements/SearchBox'
import SortBox from '~/components/Elements/SortBox'
import TitlePage from '~/components/Elements/TitlePage'
import { useWrap } from '~/context/wrap'
import { numberWithCommas } from '~/utils/functions'
import TopPackageNewsFeed from '../../NewsFeed/TopPackageNewsFeed'
import PackageStoreFilterForm from './PackageStoreFilterForm/PackageStoreFilterForm'
import PackageStoreForm from './PackageStoreForm/PackageStoreForm'
import ShowMoreText from 'react-show-more-text'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

const { Search } = Input

const PackageStore = () => {
	const router = useRouter()
	const { type } = router.query
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [storePackageList, setStorePackageList] = useState<IPackage[]>([])
	const [totalPage, setTotalPage] = useState(null)
	const { showNoti, userInformation } = useWrap()
	const [courses, setCourse] = useState<any>([])
	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false,
		search: '',

		TeacherID: null,
		Type: null,
		Level: null,
		fromDate: '',
		toDate: ''
	}
	let refValue = useRef({
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false
	})
	const [filters, setFilters] = useState(listFieldInit)
	const typeOptionList = [
		{
			value: 1,
			title: 'Miễn phí'
		},
		{
			value: 2,
			title: 'Cao cấp'
		}
	]
	const levelOptionList = [
		{
			value: 1,
			title: 'HSK 1'
		},
		{
			value: 2,
			title: 'HSK 2'
		},
		{
			value: 3,
			title: 'HSK 3'
		},
		{
			value: 4,
			title: 'HSK 4'
		},
		{
			value: 5,
			title: 'HSK 5'
		},
		{
			value: 6,
			title: 'HSK 6'
		}
	]
	// SORT OPTION
	const sortOptionList = [
		{
			dataSort: {
				sort: 1,
				sortType: true
			},
			value: 3,
			text: 'Giá tăng dần'
		},
		{
			dataSort: {
				sort: 1,
				sortType: false
			},
			value: 4,
			text: 'Giá giảm dần'
		}
	]
	// FILTER
	const onFilter = (obj) => {
		setFilters({
			...listFieldInit,
			...refValue.current,
			pageIndex: 1,
			...obj
		})
	}
	// PAGINATION
	const getPagination = (pageIndex: number, pageSize: number) => {
		if (!pageSize) pageSize = 10
		refValue.current = {
			...refValue.current,
			pageSize,
			pageIndex
		}
		setFilters({ ...filters, ...refValue.current })
	}
	const getVideoCourse = async () => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			const res = await VideoCourseStoreApi.getByPoint(5)
			res.status == 200 && setCourse(res.data.data)
			setIsLoading({ type: 'GET_ALL', status: false })
		} catch (err) {
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false })
		}
	}
	// SORT
	const onSort = (option) => {
		refValue.current = {
			...refValue.current,
			sort: option.title.sort,
			sortType: option.title.sortType
		}
		setFilters({
			...listFieldInit,
			...refValue.current
		})
	}
	// RESET SEARCH
	const onResetSearch = () => {
		setFilters({
			...listFieldInit,
			pageSize: refValue.current.pageSize
		})
	}
	// GET DATA IN FIRST TIME
	const fetchPackageList = async () => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			const res = await packageApi.getAll(filters)
			if (res.status === 200) {
				setStorePackageList(res.data.data)
				setTotalPage(res.data.totalRow)
			}
			if (res.status === 204) {
				setStorePackageList([])
				setTotalPage(0)
				showNoti('danger', 'Cửa hàng trống')
			}
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false })
		}
	}

	useEffect(() => {
		getVideoCourse()
	}, [])

	useEffect(() => {
		fetchPackageList()
	}, [filters])

	useEffect(() => {
		if (type) {
			setFilters({ ...listFieldInit, ...refValue.current, pageIndex: 1, Type: type })
		}
	}, [type])

	const _search = (e: string) => {
		setFilters({ ...listFieldInit, search: e })
	}

	const onSubmit = async (data: { ID: number; Price: string; PaymentMethodsID: number; Note: string }) => {
		setIsLoading({ type: 'ADD_DATA', status: true })
		try {
			const { ID, Price, PaymentMethodsID, Note } = data
			const newPackageStudent = {
				StudentID: userInformation.UserInformationID,
				SetPackageID: ID,
				Paid: Price === 'Miễn phí' ? 0 : parseInt(Price.toString().replace(/\D/g, '')),
				PaymentMethodsID,
				Note
			}
			const res = await packageStudentApi.add(newPackageStudent)
			if (res.status === 200) {
				showNoti('success', res.data.message)
				if (storePackageList.length === 1) {
					filters.pageIndex === 1 && setStorePackageList([])
					return
				}
				fetchPackageList()
			}
			return res
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setIsLoading({ type: 'ADD_DATA', status: false })
		}
	}

	// CARD EXTRA
	const Extra = () => {
		return (
			<div className="row m-0 vc-teach-extra" style={{ justifyContent: 'space-between' }}>
				<div className="extra-table">
					<PackageStoreFilterForm
						handleFilter={onFilter}
						handleResetFilter={onResetSearch}
						optionListForFilter={{
							levelOptionList: levelOptionList,
							typeOptionList: typeOptionList
						}}
					/>
					<SortBox width={150} dataOption={sortOptionList} handleSort={onSort} />
				</div>

				<Search
					className="fb-btn-search style-input vc-teach-modal_search on-mobile"
					size="large"
					placeholder="Tìm kiếm"
					onSearch={(e) => _search(e)}
				/>
			</div>
		)
	}

	return (
		<div className="row package-set package-detail-list">
			<div className="row m-0 p-0">
				<TitlePage title="Cửa hàng" />
				<div className="wrap-table col-md-8 col-12">
					<Card style={{ width: '100%' }} className="package-set-wrap" title={<div className="m-2">{Extra()}</div>}>
						<List
							loading={isLoading?.type === 'GET_ALL' && isLoading?.status}
							pagination={{
								onChange: getPagination,
								total: totalPage,
								size: 'small',
								current: filters.pageIndex
							}}
							itemLayout="horizontal"
							dataSource={storePackageList}
							renderItem={(item: IPackage, idx) => {
								const { ID, Name, Avatar, Level, Type, TypeName, Price, Description } = item
								return (
									<List.Item>
										<div className="wrap-set d-flex">
											{Type === 1 && <div className="tag-free">{TypeName}</div>}
											<div className="wrap-set-avatar">
												<Image
													width="100%"
													height="100%"
													src={Avatar || '/images/logo-square.png'}
													title="Ảnh bìa bộ đề"
													alt="Ảnh bìa bộ đề"
													style={{ objectFit: 'cover' }}
												/>
											</div>
											<div className="wrap-set-content">
												<h6 className="set-title">{Name}</h6>
												<ul className="set-list">
													{!!Price && (
														<li className="price">
															Giá:<span>{numberWithCommas(Price)} VNĐ</span>
														</li>
													)}
													<div className="desc" style={{ fontWeight: 600 }}>
														<ShowMoreText
															className="w-100"
															lines={3}
															more={<div style={{ color: 'blue' }}>Hiện tất cả...</div>}
															less={<div style={{ color: 'red' }}>Ẩn bớt...</div>}
															width={500}
														>
															Mô tả: <span>{Description}</span>
														</ShowMoreText>
													</div>
												</ul>
												<div className="set-btn">
													{userInformation?.RoleID !== 1 &&
														userInformation?.RoleID !== 5 &&
														(Type === 1 ? (
															<PackageStoreForm isAddPackageFree={true} isLoading={isLoading} packageItem={item} handleSubmit={onSubmit} />
														) : (
															<PackageStoreForm isLoading={isLoading} packageItem={item} handleSubmit={onSubmit} />
														))}
												</div>
											</div>
										</div>
									</List.Item>
								)
							}}
						/>
					</Card>
				</div>

				<div className="col-md-4 col-12 m-0 pl-3 pr-3 test-wrapper done-test">
					<Card
						className="table-medium w-100"
						title={
							<div
								className="title-question-bank"
								style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
							>
								<h3 className="title-big" style={{ paddingTop: 8, paddingBottom: 8 }}>
									<FontAwesomeIcon icon={faFileVideo as IconProp} size="lg" />
									Gợi ý khóa học
								</h3>
								<Link href="/video-course">
									<a className="font-weight-black" style={{ width: 100, textAlign: 'right' }}>
										Xem thêm
									</a>
								</Link>
							</div>
						}
					>
						<div className="test-body done-test-card">
							<TopPackageNewsFeed isLoading={isLoading.status} topPackageList={courses} />
						</div>
					</Card>
				</div>
			</div>
		</div>
	)
}

export default PackageStore

import { Button, Card, Drawer } from 'antd'
import Link from 'next/link'
import router from 'next/router'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { MoreHorizontal } from 'react-feather'
import { packageApi, packageStudentApi } from '~/apiBase'
import { VideoCourseStoreApi } from '~/apiBase/video-course-store'
import { useWrap } from '~/context/wrap'
import { optionCommonPropTypes } from '~/utils/proptypes'
import TopPackageNewsFeed from './TopPackageNewsFeed'

SideBarNewsFeed.propTypes = {
	optionList: PropTypes.shape({
		teamOptionList: optionCommonPropTypes,
		groupOptionList: optionCommonPropTypes
	}),
	filtersData: PropTypes.shape({
		name: PropTypes.string,
		idTeam: PropTypes.number,
		idGroup: PropTypes.number
	}),
	handleBack: PropTypes.func,
	handleFilters: PropTypes.func,
	groupFormComponent: PropTypes.element
}
SideBarNewsFeed.defaultProps = {
	optionList: {
		teamOptionList: [],
		groupOptionList: []
	},
	filtersData: {
		name: '',
		idTeam: 0,
		idGroup: 0
	},
	handleBack: null,
	handleFilters: null,
	groupFormComponent: null
}

const listTodoApi = {
	pageSize: 30,
	pageIndex: 1,
	search: null,
	categoryId: null,
	levelId: null,
	fromDate: null,
	toDate: null
}

function SideBarNewsFeed(props) {
	const [visible, setVisible] = useState(false)
	const [isLoading, setIsLoading] = useState({ type: '', status: true })
	const { showNoti, userInformation } = useWrap()
	const [courses, setCourse] = useState<any>([])

	const showSideBar = () => {
		setVisible(true)
	}

	const closeSideBar = () => {
		setVisible(false)
	}

	const getVideoCourse = async () => {
		// ADMIN & HOC VIEN
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			if (userInformation?.RoleID == 1 || userInformation?.RoleID == 2 || userInformation?.RoleID == 6) {
				// ADMIN
				const res = await VideoCourseStoreApi.getAll(listTodoApi)
				res.status == 200 && setCourse(res.data.data)
				setIsLoading({ type: 'GET_ALL', status: false })
			} else {
				// HOC VIEN
				const res = await VideoCourseStoreApi.getAllForStudent({ ...listTodoApi })
				res.status == 200 && setCourse(res.data.data)
				setIsLoading({ type: 'GET_ALL', status: false })
			}
		} catch (err) {
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false })
		}
	}

	useEffect(() => {
		!!userInformation && getVideoCourse()
	}, [userInformation])

	const SideBar = () => (
		<>
			{/* {!!userInformation && userInformation?.RoleID !== 1 && userInformation?.RoleID !== 2 && (
				<Card className="mb-3" bordered={false}>
					<div className="card-newsfeed-wrap__label">
						<Button onClick={() => router.push('/package/package-store/')} className="w-100 btn btn-warning">
							Kiểm Tra Thử Miễn Phí
						</Button>
					</div>
				</Card>
			)} */}

			<Card className="card-newsfeed" bordered={false}>
				<div className="card-newsfeed-wrap__label">
					<p className="card-newsfeed__label font-weight-black mb-1 font-bold">Khóa học video</p>
					<Link href="/video-course">
						<a className="font-weight-black" style={{ width: 100, textAlign: 'right' }}>
							Xem thêm
						</a>
					</Link>
				</div>
				<Card className="" bordered={false}>
					<TopPackageNewsFeed isLoading={isLoading.status} topPackageList={courses} />
				</Card>
			</Card>
		</>
	)

	return (
		<>
			<div className="sidebar-desktop">{SideBar()}</div>
			<div className="sidebar-mobile">
				<button className="btn btn-light" onClick={showSideBar}>
					<MoreHorizontal />
				</button>
				<div className="card-newsfeed-wrap__label" style={{ display: 'flex', flexDirection: 'row' }}>
					<Link href="/video-course">
						<a className="font-weight-black" style={{ textAlign: 'right', marginLeft: 10 }}>
							Khóa học video
						</a>
					</Link>
				</div>
				<Drawer placement="right" closable={false} onClose={closeSideBar} visible={visible} className="drawer-newsfeed">
					{SideBar()}
				</Drawer>
			</div>
		</>
	)
}

export default SideBarNewsFeed

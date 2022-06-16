import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faCalendarPlus,
	faUser,
	faUserClock,
	faUserGraduate,
	faChartLine,
	faHome,
	faCubes,
	faCommentDots,
	faQuestionCircle,
	faBookOpen,
	faVideo
} from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

const SHOW_ICON = true

export const SellerParentMenu = [
	{
		TabName: 'tab-home',
		Title: 'Trang chủ',
		Icon: <FontAwesomeIcon icon={faHome as IconProp} size="lg" />
	},
	{
		TabName: 'tab-course',
		Title: 'Khóa học',
		Icon: <FontAwesomeIcon icon={faBookOpen as IconProp} size="lg" />
	},
	{
		TabName: 'tab-customer',
		Title: 'Khách hàng',
		Icon: <FontAwesomeIcon icon={faUser as IconProp} size="lg" />
	}
]

export const SellerChildMenu = [
	{
		MenuName: 'tab-home',
		MenuTitle: 'Trang chủ',
		MenuKey: '/dashboard',
		MenuItem: [
			{
				TypeItem: 'single',
				Key: '/newsfeed',
				Route: '/newsfeed',
				Icon: !!SHOW_ICON && <FontAwesomeIcon icon={faCubes as IconProp} size="lg" />,
				Text: 'Tin tức'
			},
			{
				ItemType: 'sub-menu',
				Key: 'sub-tab-option-1',
				Icon: !!SHOW_ICON && <FontAwesomeIcon icon={faCommentDots as IconProp} size="lg" />,
				TitleSub: 'Phản hồi',
				SubMenuList: [
					{
						ItemType: 'single',
						Key: '/create-feedback',
						Route: '/create-feedback',
						Text: 'Phản hồi của bạn',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/feedback',
						Route: '/feedback',
						Text: 'Danh sách phản hồi',
						Icon: ''
					}
				]
			},
			{
				ItemType: 'single',
				Key: '/option/faq',
				Route: '/option/faq',
				Text: 'Câu hỏi thường gặp',
				Icon: !!SHOW_ICON && <FontAwesomeIcon style={{ marginRight: -5 }} icon={faQuestionCircle as IconProp} size="lg" />
			}
		]
	},
	{
		MenuName: 'tab-course',
		MenuTitle: 'Khóa học',
		MenuKey: '/course',
		MenuItem: [
			{
				TypeItem: 'single',
				Key: '/video-course',
				Route: '/video-course',
				Icon: !!SHOW_ICON && <FontAwesomeIcon icon={faVideo as IconProp} size="lg" />,
				Text: 'Danh sách'
			}
		]
	},
	{
		MenuName: 'tab-customer',
		MenuTitle: 'Khách hàng',
		MenuKey: '/customer',
		MenuItem: [
			{
				ItemType: 'single',
				Key: '/customer/student/student-advisory',
				Route: '/customer/student/student-advisory',
				Text: 'Khách hàng',
				Icon: !!SHOW_ICON && <FontAwesomeIcon icon={faUser as IconProp} size="lg" />
			},
			{
				ItemType: 'single',
				Key: '/customer/service/service-info-student',
				Route: '/customer/service/service-info-student',
				Text: 'Thêm lịch hẹn test',
				Icon: !!SHOW_ICON && <FontAwesomeIcon icon={faCalendarPlus as IconProp} size="lg" />
			},
			{
				ItemType: 'single',
				Key: '/customer/service/service-appointment-test',
				Route: '/customer/service/service-appointment-test',
				Text: 'Khách hẹn test',
				Icon: !!SHOW_ICON && <FontAwesomeIcon icon={faUserClock as IconProp} size="lg" />
			},
			{
				ItemType: 'single',
				Key: '/customer/student/student-list',
				Route: '/customer/student/student-list',
				Text: 'Dữ liệu học viên',
				Icon: !!SHOW_ICON && <FontAwesomeIcon icon={faUserGraduate as IconProp} size="lg" />
			}
		]
	}
]

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faUser,
	faVideo,
	faFileContract,
	faBook,
	faCircleQuestion,
	faGears,
	faHome,
	faBookOpen,
	faFileSignature,
	faGear,
	faCubes,
	faFile,
	faFileLines,
	faCalendarDays,
	faCircleDollarToSlot
} from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

const SHOW_ICON = true

export const TeacherParentMenu = [
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
		TabName: 'tab-student',
		Title: 'Học viên',
		Icon: <FontAwesomeIcon icon={faUser as IconProp} size="lg" />
	},
	{
		TabName: 'tab-document',
		Title: 'Thư viện tài liệu',
		Icon: <FontAwesomeIcon icon={faBook as IconProp} size="lg" />
	},
	{
		TabName: 'tab-question-bank',
		Title: 'Ngân hàng đề',
		Icon: <FontAwesomeIcon icon={faFileSignature as IconProp} size="lg" />
	}
]

export const TeacherChildMenu = [
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
				TypeItem: 'single',
				Key: '/staff/salary-of-teacher',
				Route: '/staff/salary-of-teacher',
				Icon: !!SHOW_ICON && <FontAwesomeIcon icon={faCircleDollarToSlot as IconProp} size="lg" />,
				Text: 'Bảng lương'
			}
		]
	},
	{
		MenuName: 'tab-course',
		MenuTitle: 'Lịch dạy',
		MenuKey: '/course',
		MenuItem: [
			{
				TypeItem: 'single',
				Key: '/course/calendar',
				Route: '/course/calendar',
				Icon: !!SHOW_ICON && <FontAwesomeIcon icon={faCalendarDays as IconProp} size="lg" />,
				Text: 'Quản lý lịch dạy'
			}
		]
	},
	{
		MenuName: 'tab-student',
		MenuTitle: 'Học viên',
		MenuKey: '/customer',
		MenuItem: [
			{
				ItemType: 'single',
				Key: '/package/package-result-teacher',
				Route: '/package/package-result-teacher',
				Text: 'Chấm đề thi',
				Icon: !!SHOW_ICON && <FontAwesomeIcon icon={faFileContract as IconProp} size="lg" />
			},
			{
				ItemType: 'single',
				Key: '/customer/student/course-exam',
				Route: '/customer/student/course-exam',
				Text: 'Chấm bài kiểm tra',
				Icon: !!SHOW_ICON && <FontAwesomeIcon icon={faFile as IconProp} size="lg" />
			}
		]
	},
	{
		MenuName: 'tab-document',
		MenuTitle: 'Thư viện tài liệu',
		MenuKey: '/document-list',
		MenuItem: [
			{
				ItemType: 'single',
				Key: '/document-list',
				Route: '/document-list',
				Text: 'Danh sách tài liệu',
				Icon: !!SHOW_ICON && <FontAwesomeIcon icon={faBook as IconProp} size="lg" />
			}
		]
	},
	{
		MenuName: 'tab-question-bank',
		MenuTitle: 'Ngân hàng đề thi',
		MenuKey: '/question-bank',
		MenuItem: [
			{
				ItemType: 'single',
				Key: '/question-bank/question-list',
				Route: '/question-bank/question-list',
				Text: 'Danh sách câu hỏi',
				Icon: !!SHOW_ICON && <FontAwesomeIcon icon={faCircleQuestion as IconProp} size="lg" />
			},
			{
				ItemType: 'single',
				Key: '/question-bank/exam-list',
				Route: '/question-bank/exam-list',
				Text: 'Danh sách đề',
				Icon: !!SHOW_ICON && <FontAwesomeIcon icon={faFileLines as IconProp} size="lg" />
			}
		]
	}
]

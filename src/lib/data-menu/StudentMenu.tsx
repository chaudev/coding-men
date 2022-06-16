import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faHouse,
	faFileContract,
	faCubes,
	faInfoCircle,
	faVideo,
	faShoppingCart,
	faCheckCircle,
	faQuestionCircle,
	faComments,
	faStore,
	faFileLines,
	faCalendarCheck,
	faCalendarMinus,
	faUserTie,
	faFileVideo,
	faBook
} from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

const SHOW_ICON = true

export const StudentParentMenu = [
	{
		TabName: 'tab-home',
		Title: 'Trang chủ',
		Icon: <FontAwesomeIcon icon={faHouse as IconProp} size="lg" />
	},
	{
		TabName: '1-1',
		Title: 'Đặt lịch với giáo viên',
		Icon: <FontAwesomeIcon icon={faCalendarMinus as IconProp} size="lg" />
	},
	{
		TabName: 'video',
		Title: 'Khoá video',
		Icon: <FontAwesomeIcon icon={faFileVideo as IconProp} size="lg" />
	},
	{
		TabName: 'tab-package',
		Title: 'Bộ đề',
		Icon: <FontAwesomeIcon icon={faFileContract as IconProp} size="lg" />
	},
	{
		TabName: 'tab-document',
		Title: 'Thư viện tài liệu',
		Icon: <FontAwesomeIcon icon={faBook as IconProp} size="lg" />
	}
]

export const StudentChildMenu = [
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
			// {
			// 	TypeItem: 'single',
			// 	Key: '/customer/service/service-test-student',
			// 	Route: '/customer/service/service-test-student',
			// 	Icon: !!SHOW_ICON && <FontAwesomeIcon icon={faInfoCircle as IconProp} size="lg" />,
			// 	Text: 'Thông tin hẹn test'
			// },
			{
				ItemType: 'single',
				Key: '/option/faq',
				Route: '/option/faq',
				Text: 'Câu hỏi thường gặp',
				Icon: !!SHOW_ICON && <FontAwesomeIcon icon={faQuestionCircle as IconProp} size="lg" />
			}
			// {
			// 	ItemType: 'single',
			// 	Key: '/feedback',
			// 	Route: '/feedback',
			// 	Text: 'Phản hồi',
			// 	Icon: !!SHOW_ICON && <FontAwesomeIcon icon={faComments as IconProp} size="lg" />
			// }
		]
	},
	{
		MenuName: '1-1',
		MenuTitle: 'Đặt lịch với giáo viên',
		MenuKey: '/1-1',
		MenuItem: [
			{
				TypeItem: 'single',
				Key: '/course/teachers',
				Route: '/course/teachers',
				Icon: !!SHOW_ICON && <FontAwesomeIcon icon={faUserTie as IconProp} size="lg" />,
				Text: 'Giáo viên'
			},
			{
				TypeItem: 'single',
				Key: '/course/calendar',
				Route: '/course/calendar',
				Icon: !!SHOW_ICON && <FontAwesomeIcon icon={faCalendarCheck as IconProp} size="lg" />,
				Text: 'Lịch của tôi'
			}
		]
	},
	{
		MenuName: 'video',
		MenuTitle: 'Khóa video',
		MenuKey: '/video',
		MenuItem: [
			{
				ItemType: 'single',
				Key: '/video-course',
				Route: '/video-course',
				Text: 'Danh sách khóa học',
				Icon: !!SHOW_ICON && <FontAwesomeIcon icon={faVideo as IconProp} size="lg" />
			},
			{
				ItemType: 'single',
				Key: '/video-course-student',
				Route: '/video-course-student',
				Text: 'Danh sách đơn hàng',
				Icon: !!SHOW_ICON && <FontAwesomeIcon icon={faShoppingCart as IconProp} size="lg" />
			},
			{
				ItemType: 'single',
				Key: '/video-course-list',
				Route: '/video-course-list',
				Text: 'Khóa học đã sở hữu',
				Icon: !!SHOW_ICON && <FontAwesomeIcon icon={faCheckCircle as IconProp} size="lg" />
			}
		]
	},
	{
		MenuName: 'tab-package',
		MenuTitle: 'Bộ đề thi',
		MenuKey: '/package',
		MenuItem: [
			{
				ItemType: 'single',
				Key: '/package/package-student',
				Route: '/package/package-student',
				Text: 'Bộ đề của tôi',
				Icon: !!SHOW_ICON && <FontAwesomeIcon icon={faFileContract as IconProp} size="lg" />
			},
			{
				ItemType: 'single',
				Key: '/package/package-store',
				Route: '/package/package-store',
				Text: 'Cửa hàng',
				Icon: !!SHOW_ICON && <FontAwesomeIcon icon={faStore as IconProp} size="lg" />
			},
			{
				ItemType: 'single',
				Key: '/package/package-result-student',
				Route: '/package/package-result-student',
				Text: 'Kết quả đã làm bài',
				Icon: !!SHOW_ICON && <FontAwesomeIcon icon={faFileLines as IconProp} size="lg" />
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
	}
]

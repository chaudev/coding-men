import React from 'react'
import 'antd/dist/antd.css'
import { Tabs } from 'antd'
import VideoQuestion from '~/components/VideoLearning/tabs/question'
import VideoInfomation from '~/components/VideoLearning/tabs/video-information'
import VocabularyTab from '~/components/VideoLearning/tabs/vocabulary'
import NotificationTab from './notification'
import { useWrap } from '~/context/wrap'
import TestResult from './test-result'
import PackageResultStudent from '~/pages/package/package-result-student'
import Information from './infomation'

const { TabPane } = Tabs

const titlePages = {
	page1: 'Giới thiệu',
	page2: 'Nội dung',
	page3: 'Luyện tập',
	page4: 'Hỏi và đáp',
	page5: 'Ghi chú',
	page6: 'Thông báo',
	page7: 'Lịch sử làm bài'
}

const VideoTabs = (props: any) => {
	const { lession } = props
	const { userInformation } = useWrap()

	return (
		<Tabs className="" tabBarStyle={{ paddingLeft: 20, paddingRight: 20 }}>
			<TabPane tab={titlePages.page2} key="2">
				<Information lesson={lession} />
			</TabPane>

			<TabPane tab={titlePages.page1} key="1">
				<VideoInfomation />
			</TabPane>

			{!!userInformation && userInformation.RoleID == 3 && (
				<>
					<TabPane tab={titlePages.page5} key="3">
						<VocabularyTab lession={lession} />
					</TabPane>
					<TabPane tab={titlePages.page7} key="7">
						<PackageResultStudent lession={lession} />
					</TabPane>
				</>
			)}

			{/* <TabPane tab={titlePages.page4} key="5">
				<VideoQuestion lession={lession} />
			</TabPane> */}

			<TabPane tab={titlePages.page6} key="6">
				<NotificationTab lession={lession} />
			</TabPane>
		</Tabs>
	)
}

export default VideoTabs

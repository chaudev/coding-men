import React, { FC, useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import { List } from 'antd'
import RenderItem from '~/components/VideoLearning/list-video/render-item'

type IProps = {
	videos: any[]
	onPress: any
}

// LIST VIDEOS
const VideoList: FC<IProps> = ({ videos, onPress }) => {
	const [watching, setWatching] = useState(0)
	const [playing, setPlaying] = useState<any>('')

	useEffect(() => {
		if (!!videos) {
			getWatchingVideo()
		}
	}, [videos])

	const getWatchingVideo = () => {
		const indexAPI = videos.findIndex((item: any) => item?.IsWatching == true)
		if (indexAPI > -1) {
			setWatching(videos[indexAPI].ID)
		} else {
			let flag = 0
			for (let i = 0; i < videos.length; i++) {
				const item = videos[i]
				if (item?.CompleteVsTotalLesson != '0/0') {
					flag == 0 && setWatching(item?.ID)
					flag = 1
				}
			}
		}
	}

	const _playVideo = (param) => {
		onPress(param)
		setPlaying(param.ID)
	}

	return (
		<>
			<h4 className="none-selection on-desktop">Nội dung khóa học</h4>
			<hr className="on-desktop" />

			{watching !== 0 && (
				<List
					itemLayout="horizontal"
					dataSource={videos}
					className="w-100"
					renderItem={(item: any) => (
						<RenderItem
							playing={playing}
							setPlaying={(e: number) => setPlaying(e)}
							watching={watching}
							data={videos}
							item={item}
							onPress={_playVideo}
						/>
					)}
				/>
			)}
		</>
	)
}

export default VideoList

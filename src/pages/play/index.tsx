import { useRouter } from 'next/router'
import React from 'react'
import 'react-circular-progressbar/dist/styles.css'

const VideoPlayer = () => {
	const router = useRouter()

	// RENDER
	return (
		<div className="play-screen">
			<div className="video">
				{!!router.query?.url && (
					<iframe id="video__course__iframe" className="responsive-iframe" src={router.query?.url.toString()} allowFullScreen />
				)}
			</div>
		</div>
	)
}

export default VideoPlayer

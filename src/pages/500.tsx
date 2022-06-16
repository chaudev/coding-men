import React from 'react'
import Lottie from 'react-lottie-player'

import loader from '~/components/json/server-error.json'

export default function Custom500() {
	return (
		<div className="wrap-404">
			{/* @ts-ignore */}
			<Lottie loop animationData={loader} play className="inner" />
		</div>
	)
}

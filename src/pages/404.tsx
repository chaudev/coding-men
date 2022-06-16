import React from 'react'
import Lottie from 'react-lottie-player'

import loader from '~/components/json/404-page-not-found.json'

export default function Custom404() {
	return (
		<div className="wrap-404">
			{/* @ts-ignore */}
			<Lottie loop animationData={loader} play className="inner" />
		</div>
	)
}

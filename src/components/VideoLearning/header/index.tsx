import React, { FC } from 'react'
import Link from 'next/link'
import 'react-circular-progressbar/dist/styles.css'

type hProps = {
	params: any
	onClick: any
}

const HeaderVideo: FC<hProps> = ({ params, onClick }): JSX.Element => {
	return (
		<div className="row video-header pl-5 pr-5 video-shadow">
			<Link href="/">
				<img className="logo-img" src="/images/logo.png" />
			</Link>

			<div className="video-header__video-title in-2-line ml-5">{params.name}</div>

			<div className="row p-0 video-header__header-right">
				<div className="row video-header__progress">
					<span className="video-header__video-title">Hoàn thành {params.complete}</span>
				</div>
				<div onClick={onClick} className="ml-3 video-header__playlist">
					<i className="fas fa-list-ul " />
				</div>
			</div>
		</div>
	)
}

export default HeaderVideo

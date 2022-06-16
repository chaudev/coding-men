import { Spin } from 'antd'
import { signIn, useSession } from 'next-auth/client'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { scheduleZoomApi } from '~/apiBase'
import { CalendarApi } from '~/apiBase/Calendar/calendar'
import { useWrap } from '~/context/wrap'

function ZoomView() {
	const router = useRouter()
	const { slug: ScheduleID } = router.query
	const [session, loading] = useSession()
	let path: string = router.pathname

	const [dataZoom, setDataZoom] = useState<{
		apiKey: string
		signature: string
		meetingNumber: string
		passWord: string
		userName: string
	}>(null)

	const { userInformation, showNoti } = useWrap()

	const fetchInfoRoomZoom = async () => {
		try {
			if (!userInformation) return
			const parseID = parseInt(ScheduleID.toString())
			const res = await (!!router.query?.isVideo ? CalendarApi.joinRoom(parseID) : scheduleZoomApi.getById(parseID))
			if (res.status === 200) {
				if (!!router.query?.isVideo) {
					const { ZoomID, ZoomPassword, Signature, ApiKey } = res.data.data
					setDataZoom({
						apiKey: ApiKey,
						signature: Signature,
						meetingNumber: ZoomID,
						passWord: ZoomPassword,
						userName: userInformation.FullNameUnicode
					})
				} else {
					const { ZoomRoomID, ZoomRoomPass, SignatureTeacher, SignatureStudent, ApiKey } = res.data.data
					setDataZoom({
						apiKey: ApiKey,
						signature: SignatureTeacher && SignatureStudent ? (userInformation?.RoleID === 2 ? SignatureTeacher : SignatureStudent) : '',
						meetingNumber: ZoomRoomID,
						passWord: ZoomRoomPass,
						userName: userInformation.FullNameUnicode
					})
				}
			}
		} catch (error) {
			console.log('fetchInfoRoomZoom', error.message)
			showNoti('danger', error?.message)
		}
	}

	const _leave = async () => {
		try {
			const parseID = parseInt(ScheduleID.toString())
			await CalendarApi.exitRoom(parseID)
		} catch (error) {}
	}

	useEffect(() => {
		fetchInfoRoomZoom()
	}, [userInformation])

	useEffect(() => {
		if (typeof session !== 'undefined') {
			if (session == null) {
				if (path.search('signin') < 0) {
					signIn()
				}
			}
		}
	}, [session])

	if (typeof window !== 'undefined') {
		const cac = window.location.origin + '/course/calendar'
	}

	const initZoom = async () => {
		if (!dataZoom) return

		const module = await import('@zoomus/websdk')

		// DECLARE MODULE
		const { ZoomMtg } = module

		ZoomMtg.setZoomJSLib('https://source.zoom.us/2.2.0/lib', '/av')
		ZoomMtg.preLoadWasm()
		ZoomMtg.prepareWebSDK()

		// SHOW LAYOUT ZOOM
		document.getElementById('zmmtg-root')?.setAttribute('style', 'display:block;')
		let leaveUrl = 'http://localhost:3003/course/calendar/?ID=' + ScheduleID.toString()
		if (typeof window !== 'undefined') {
			leaveUrl = window.location.origin + '/course/calendar/?ID=' + ScheduleID.toString()
		}
		// INIT MEETING
		ZoomMtg.init({
			leaveUrl,
			isSupportAV: true,
			screenShare: true,
			success: (success) => {
				// JOIN MEETING
				console.log('ZoomMtg.init - success:', success)
				ZoomMtg.join({
					...dataZoom,
					success: (success) => {
						console.log('ZoomMtg.join - success: ', success)
					},
					error: (error) => {
						console.log('ZoomMtg.join - error: ', error)
					}
				})
			},
			error: (error) => {
				console.log('ZoomMtg.init - error: ', error)
			}
		})
	}

	useEffect(() => {
		initZoom()
	}, [dataZoom])

	return (
		<>
			<Head>
				<link type="text/css" rel="stylesheet" href="https://source.zoom.us/2.2.0/css/bootstrap.css" />
				<link type="text/css" rel="stylesheet" href="https://source.zoom.us/2.2.0/css/react-select.css" />
			</Head>
			<div className="zoom-view" style={{ height: '100vh', width: '100vw', position: 'relative' }}>
				<Spin size="large" />
			</div>
		</>
	)
}
export default ZoomView

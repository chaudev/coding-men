import { Provider as AuthProvider } from 'next-auth/client'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { WrapProvider } from '~/context/wrap'
import OneSignal from 'react-onesignal'
import { config } from '@fortawesome/fontawesome-svg-core'

// import css
import '@fortawesome/fontawesome-svg-core/styles.css'
import 'antd/dist/antd.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import '~/styles/global.scss'

// import config
import _ from '~/appConfig'

config.autoAddCss = false

const codingDescription =
	"A community where 'tay-ngang' and 'non-tay-ngang' connect. As an IT group built with love, we create a better life, better career path for individuals"

export default function App({ Component, pageProps }) {
	const router = useRouter()

	useEffect(() => {
		console.log('NODE_ENV: ', process.env.NODE_ENV)
	}, [])

	useEffect(() => {
		// OneSignal.setSubscription(true)
		// OneSignal.init({ appId: _.oneSignalKey }).then(() => {
		// 	OneSignal.showSlidedownPrompt()
		// })
		// OneSignal.on('popoverShown', function () {})
		// const handleRouteChangeError = (err: any, url: any) => {}
		// router.events.on('routeChangeError', handleRouteChangeError)
		// return () => {
		// 	router.events.off('routeChangeError', handleRouteChangeError)
		// }
	}, [])

	const Layout = Component.layout || ((props) => <>{props.children}</>)

	return (
		<>
			<Head>
				<title>{_.chromeTitle}</title>

				<meta name="viewport" content="initial-scale=1.0, width=device-width, maximum-scale=1" />
				<meta name="robots" content="noindex" />
				<meta name="description" content={_.description} />
				<meta name="twitter:card" content="summary_large_image" />

				<meta property="og:site_name" content="Coding Mentor" />
				<meta property="og:title" content="Coding Mentor - Tay ngang học code" />
				<meta property="og:url" content="" />
				<meta property="og:type" content="website" />
				<meta property="og:image" content="https://codingmentor.com.au/images/CM_logo_transparent.png" />
				<meta property="og:image:width" content="504" />
				<meta property="og:image:height" content="504" />
				<meta property="og:description" content={codingDescription} />

				<link rel="icon" href="/logo.png" />
			</Head>

			<AuthProvider session={pageProps.session}>
				<WrapProvider>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</WrapProvider>
			</AuthProvider>
		</>
	)
}

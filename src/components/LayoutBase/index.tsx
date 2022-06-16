import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Layout from './layout'
import LoadingLayout from './LoadingLayout'

const LayoutBase = ({ children }) => {
	const router = useRouter()
	const [session, loading] = useSession()

	useEffect(() => {
		if (loading || !session) return
		let checkNewUser = localStorage.getItem('isNewUser')
		checkNewUser != undefined && checkNewUser == 'true' && router.push('/change-password')
	}, [loading, session])

	if (loading) {
		return <LoadingLayout />
	}

	if (!session) {
		signIn()
		return <LoadingLayout />
	}

	return <Layout>{children}</Layout>
}

export default LayoutBase

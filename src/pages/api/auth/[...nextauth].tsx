import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { SocialLogin, login, loginByDev } from '~/services/auth'

const options = {
	providers: [
		Providers.Credentials({
			id: 'credentials-signin',
			name: 'Tài khoản',
			authorize: async (credentials: any) => {
				try {
					const rs: any = credentials?.isSocial ? await SocialLogin(credentials) : await login(credentials)
					return credentials?.isSocial ? Promise.resolve(rs) : Promise.resolve(rs.data)
				} catch (error) {
					return Promise.reject(new Error(encodeURIComponent(JSON.stringify(error))))
				}
			}
		}),
		Providers.Credentials({
			id: 'credentials-dev-signin',
			name: 'Dev signin',
			authorize: async (credentials: any) => {
				try {
					const rs: any = await loginByDev(credentials)
					return Promise.resolve(rs.data)
				} catch (error) {
					return Promise.reject(new Error(encodeURIComponent(JSON.stringify(error))))
				}
			}
		})
	],

	session: {
		jwt: true
	},

	jwt: {
		secret: 'YzQzYzg0MzljNzE5ODk0ZDQwZGQ0NGNhOGI5MmU4OThlNmVlODZlYTc0M2Y5MjFjNDdmYWI2ZmJmZjFjNjBjMQ==',
		encryption: true
	},

	callbacks: {
		signIn: async (user, account, profile) => {
			return Promise.resolve(true)
		},
		session: async (session, token) => {
			if (token) {
				session.accessToken = token.token
				session.user = { ...token.data }
			}
			return Promise.resolve(session)
		},
		jwt: async (token, user, account, profile, isNewUser) => {
			const isSignIn = user ? true : false
			if (isSignIn) {
				token.auth_time = Math.floor(Date.now() / 1000)
			}
			if (account?.type === 'credentials') {
				const newToken = {
					...token,
					...user,
					isNewUser
				}
				return Promise.resolve(newToken)
			}
			return Promise.resolve(token)
		},
		redirect: async (url, baseUrl) => {
			return url.startsWith(baseUrl) ? Promise.resolve(baseUrl) : Promise.resolve(baseUrl)
		}
	},

	pages: {
		signIn: '/auth/signin',
		signOut: '/auth/signin',
		error: '/auth/signin',
		newUser: null
	},

	debug: true
}

const Auth = (req, res) => NextAuth(req, res, options)

export default Auth

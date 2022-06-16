import React, { useEffect, useState } from 'react'
import { Popover } from 'antd'
import { useWrap } from '~/context/wrap'
import { signIn, signOut, useSession } from 'next-auth/client'
import Link from 'next/link'
import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	UserOutlined,
	LogoutOutlined,
	LoginOutlined,
	FormOutlined,
	RedoOutlined
} from '@ant-design/icons'
import { User } from 'react-feather'
import TitlePageHeader from '../Elements/TitlePageHeader'
import Notifiaction from './notification'
import Cart from './cart'

let countOpen = 0
export default function Header(props: any) {
	const { isOpenMenu, isOpen, funcMenuMobile, openMenuMobile } = props
	const { titlePage, userInformation } = useWrap()
	const [session] = useSession()
	const [dataUser, setDataUser] = useState<IUser>()

	const moveToLogin = () => {
		signIn()
	}

	const contentLogout = (
		<ul className="user-function">
			<li>
				<Link href="/profile">
					<a href="">
						<span className="icon">
							<UserOutlined />
						</span>
						<span className="function-name">Trang cá nhân</span>
					</a>
				</Link>
			</li>
			<li>
				<Link href="/change-password">
					<a href="#">
						<span className="icon inbox">
							<RedoOutlined />
						</span>
						<span className="function-name">Đổi mật khẩu</span>
					</a>
				</Link>
			</li>
			<li>
				<a href="#" onClick={() => (signOut(), localStorage.removeItem('dataUserEchinese'))}>
					<span className="icon logout">
						<LogoutOutlined />
					</span>
					<span className="function-name">Log out</span>
				</a>
			</li>
		</ul>
	)

	const contentLogin = (
		<ul className="user-function">
			<li>
				<a href="#" onClick={moveToLogin}>
					<span className="icon">
						<LoginOutlined />
					</span>
					<span className="function-name">Đăng nhập</span>
				</a>
			</li>
			<li>
				<a href="#">
					<span className="icon inbox">
						<FormOutlined />
					</span>
					<span className="function-name">Đăng kí</span>
				</a>
			</li>
		</ul>
	)

	let visibleUser: {
		visible: Boolean
	}

	visibleUser = {
		visible: false
	}

	if (!isOpen) {
		countOpen++
	}

	function parseJwt(token: any) {
		var base64Url: any = token.split('.')[1]
		var base64: any = base64Url.replace(/-/g, '+').replace(/_/g, '/')
		var jsonPayload: any = decodeURIComponent(
			atob(base64)
				.split('')
				.map(function (c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
				})
				.join('')
		)
		return JSON.parse(jsonPayload)
	}

	useEffect(() => {
		if (!!session) {
			let token: any = session.accessToken
			!!userInformation ? setDataUser(userInformation) : setDataUser(parseJwt(token))
		}
	}, [userInformation])

	return (
		<header className={`app-header ${openMenuMobile ? 'mobile' : ''}`}>
			<div className={`app-header-logo ${!isOpen ? 'close-app' : countOpen > 0 ? 'open' : 'open-no-ani'}`}>
				<Link href="/">
					<a href="#">
						<img className="logo-img" src="/images/logo.png"></img>
					</a>
				</Link>
				<p style={{ display: !isOpen ? 'block' : 'none' }}></p>
			</div>
			<div className={`app-header-inner ${!isOpen && 'close-app'}`}>
				<div className="right">
					<div className="col-button" onClick={() => isOpenMenu()}>
						<div className="box-menu">
							<div className="icon-action">{!isOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</div>
						</div>
					</div>
					<div className="col-button mobile" onClick={() => funcMenuMobile()}>
						<div className="box-menu">
							<div className="icon-action">{!openMenuMobile ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</div>
						</div>
					</div>
					<div className="col-title-page">
						<TitlePageHeader title={titlePage} />
					</div>
				</div>
				<div className="col-setting">
					<ul className="col-setting-list">
						{userInformation?.RoleID !== undefined &&
							userInformation?.RoleID !== 1 &&
							userInformation?.RoleID !== 2 &&
							userInformation?.RoleID !== 4 &&
							userInformation?.RoleID !== 5 &&
							userInformation?.RoleID !== 6 &&
							userInformation?.RoleID !== 10 && (
								<li className="notification" style={{ marginRight: -10 }}>
									<Cart />
								</li>
							)}
						<li className="notification">
							<Notifiaction />
						</li>
						<li className="user" style={{ paddingRight: 20 }}>
							<Popover content={!session ? contentLogin : contentLogout} trigger="click" title="">
								<div className="user-wrap">
									<div className="user-info">
										{session?.user ? (
											<div className="user-name-desktop">
												<div className="user-img">
													<img src={dataUser?.Avatar && dataUser?.Avatar !== '' ? dataUser.Avatar : '/images/user.png'} alt="" />
												</div>
												<div className="user-info">
													<p className="user-name">{dataUser?.FullNameUnicode}</p>
													<p className="user-position">{dataUser?.RoleName}</p>
												</div>
											</div>
										) : (
											<p>Tài khoản</p>
										)}
										<div className="user-name-mobile">
											<User />
										</div>
									</div>
								</div>
							</Popover>
						</li>
					</ul>
				</div>
			</div>
		</header>
	)
}

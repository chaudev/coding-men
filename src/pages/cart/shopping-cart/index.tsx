import {
	EllipsisOutlined,
	FormOutlined,
	LoginOutlined,
	LogoutOutlined,
	RedoOutlined,
	SearchOutlined,
	UserOutlined
} from '@ant-design/icons'
import { Avatar, Dropdown, Input, Popover, Skeleton, Tooltip } from 'antd'
import { signIn, signOut, useSession } from 'next-auth/client'
import Link from 'next/link'
import router from 'next/router'
import React, { useEffect, useState } from 'react'
import { shoppingCartApi } from '~/apiBase/shopping-cart/shopping-cart'
import QuantityOfItems from '~/components/Global/Option/shopping-cart/QuantityOfItems'
import { useWrap } from '~/context/wrap'
import { numberWithCommas } from '~/utils/functions'
import DeleteItem from './../../../components/Tables/DeleteItem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import _ from '~/appConfig'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

const ShoppingCart = () => {
	const [session] = useSession()
	const { userInformation } = useWrap()
	const [dataUser, setDataUser] = useState<IUser>()
	const [cartItems, setCartItems] = useState<IShoppingCart[]>([])
	const [dropDownVisible, setDropDownVisible] = useState(false)
	const [isLoading, setIsLoading] = useState({ status: '', loading: false })

	const { Search } = Input

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

	function parseJwt(token) {
		var base64Url = token.split('.')[1]
		var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
		var jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map(function (c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
				})
				.join('')
		)
		return JSON.parse(jsonPayload)
	}

	const getShoppingCartData = async () => {
		setIsLoading({ status: 'GET_CART_DATA', loading: true })
		try {
			let res = await shoppingCartApi.getAll()
			if (res.status == 200) {
				setCartItems(res.data.data)
			}
		} catch (error) {
		} finally {
			setIsLoading({ status: 'GET_CART_DATA', loading: false })
		}
	}

	const getShoppingCartDataNoLoading = async () => {
		try {
			let res: any = await shoppingCartApi.getAll()
			if (res.status == 200) {
				setCartItems(res.data.data)
			}
		} catch (error) {}
	}

	const deleteItem = async (id) => {
		setIsLoading({ status: 'loading', loading: true })
		try {
			let res = await shoppingCartApi.update({ ID: id, Enable: false })
			if (res.status == 200) {
				getShoppingCartData()
			}
		} catch (error) {
		} finally {
			setIsLoading({ status: 'loading', loading: false })
		}
	}

	const increseItem = async (id, quantity) => {
		setIsLoading({ status: 'CHANGE_QUANTITY', loading: true })
		try {
			let res = await shoppingCartApi.update({ ID: id, Quantity: quantity + 1, Enable: true })
			if (res.status == 200) {
				getShoppingCartDataNoLoading()
			}
		} catch (error) {
		} finally {
			setIsLoading({
				status: 'CHANGE_QUANTITY',
				loading: false
			})
		}
	}

	const decreseItem = async (id, quantity) => {
		setIsLoading({ status: 'CHANGE_QUANTITY', loading: true })
		try {
			let res = await shoppingCartApi.update(quantity == 1 ? { ID: id, Enable: false } : { ID: id, Quantity: quantity - 1, Enable: true })
			if (res.status == 200) {
				getShoppingCartDataNoLoading()
			}
		} catch (error) {
		} finally {
			setIsLoading({ status: 'CHANGE_QUANTITY', loading: false })
		}
	}

	const renderCartItems = () => {
		return (
			<div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
				<div className="d-flex justify-content-between">
					<h2 className="mb-4" style={{ color: _.primaryColor }}>
						<FontAwesomeIcon icon={faCartShopping as IconProp} /> <span className="ml-3">Giỏ hàng</span>
					</h2>
				</div>

				{cartItems?.map((item, index) => (
					<div className="cart__item d-flex justify-content-between align-items-center row " key={index}>
						<div
							onClick={() =>
								router.push({
									pathname: '/video-course/[slug]',
									query: { slug: item.VideoCourseID, Thum: item.ImageThumbnails, Sell: item.Price }
								})
							}
							style={{ cursor: 'pointer' }}
						>
							<Avatar
								style={{ width: 80, height: 80, padding: 0, margin: 0 }}
								src={item.ImageThumbnails && item.ImageThumbnails.length ? item.ImageThumbnails : '/images/logo-square.png'}
							/>
						</div>

						<Tooltip title={item.VideoCourseName}>
							<div className="cart__item-detail d-none d-sm-inline-block mt-sm-0 mb-sm-0">
								<h5 className="limit-text-two-line">{item.VideoCourseName}</h5>
							</div>
						</Tooltip>

						<div className="cart__item-detail d-none d-sm-inline-block mt-sm-0 mb-sm-0">
							<h5 style={{ fontSize: 14 }}>Hạn: {item.ExpiryDays} ngày</h5>
						</div>

						<div className="cart__item-action d-none d-sm-inline-block d-none d-sm-inline-block col-sm-2">
							<QuantityOfItems item={item} index={index} decreseItem={decreseItem} increseItem={increseItem} />
						</div>

						<div className="price d-none d-sm-inline-block">
							<p className="font-weight-primary">{numberWithCommas(item.Price * item.Quantity)} VND</p>
						</div>

						<div className="cart__item-remove d-none d-sm-inline-block col-sm-1">
							<DeleteItem onDelete={() => deleteItem(item.ID)} />
						</div>

						<div className="col-8 d-sm-none">
							<div className="cart__item-detail col-12 col-sm-3 mt-3  mt-sm-0 mb-sm-0 limit-text-two-line">
								<h5>{item.VideoCourseName}</h5>
							</div>

							<div className="cart__item-detail col-12 col-sm-3 mt-3  mt-sm-0 mb-sm-0">
								<h5 style={{ fontSize: 14 }}>Hạn: {item.ExpiryDays} ngày</h5>
							</div>

							<div className="cart__item-price">
								<p className="font-weight-primary">{numberWithCommas(item.Price * item.Quantity)} VND</p>
							</div>

							<div className="row mt-3">
								<div className="cart__item-action pl-3 pl-md-5  col-8 col-sm-2">
									<QuantityOfItems item={item} index={index} decreseItem={decreseItem} increseItem={increseItem} />
								</div>
								<div className="cart__item-remove col-4 col-sm-1">
									<DeleteItem onDelete={() => deleteItem(item.ID)} />
								</div>
							</div>
						</div>
					</div>
				))}
				<div style={{ flex: 1 }} />
				<button
					className="btn btn-primary mt-5"
					onClick={() => {
						router.push('/video-course')
					}}
				>
					Mua thêm khóa học
				</button>
			</div>
		)
	}

	const menuDropdown = () => {
		return (
			<>
				<div className="menu__dropdown d-inline-block d-md-none" style={{ width: 300 }}>
					<div className="d-inline-block d-md-none ">
						<Search
							onChange={(event) => {}}
							name="CourseSearch"
							placeholder="Tìm khóa học"
							className="style-input mb-3"
							allowClear
							enterButton={<SearchOutlined />}
							size="large"
						/>
						<Popover content={!session ? contentLogin : contentLogout} trigger="click" title="">
							<div className="user-wrap">
								<div className="user-info">
									{session?.user ? (
										<div className="user-wrap">
											<div className="user-img">
												<img src={dataUser?.Avatar ? dataUser.Avatar : '/images/user.png'} alt="" />
											</div>
											<div className="user-info">
												<p className="user-name">{dataUser?.FullNameUnicode}</p>
												<p className="user-position">{dataUser?.RoleName}</p>
											</div>
										</div>
									) : (
										<p>Tài khoản</p>
									)}
								</div>
							</div>
						</Popover>
					</div>
				</div>
			</>
		)
	}

	useEffect(() => {
		if (session !== undefined) {
			let token = session.accessToken
			if (userInformation) {
				setDataUser(userInformation)
			} else {
				setDataUser(parseJwt(token))
			}
		}
	}, [userInformation])

	useEffect(() => {
		getShoppingCartData()
	}, [])

	return (
		<div className="shopping-wrap-all-content">
			<header>
				<div className="shopping__cart-header justify-content-between align-items-center row">
					<div className="header__logo col-6 col-md-3">
						<Link href="/">
							<a href="#">
								<img className="logo-img" src="/images/logo-square.png" alt="logo branch"></img>
							</a>
						</Link>
					</div>

					<div className="header__profile col-2 col-md-3">
						<div className="col-setting">
							<ul className="col-setting-list">
								<li className="user">
									<div className="d-inline-block d-md-none  w-25 ">
										<Dropdown overlay={menuDropdown} trigger={['click']} visible={dropDownVisible}>
											<a
												className="ant-dropdown-link"
												onClick={(e) => {
													e.preventDefault()
													setDropDownVisible(!dropDownVisible)
												}}
											>
												<EllipsisOutlined />
											</a>
										</Dropdown>
									</div>

									<div className="d-none d-md-inline-block ">
										<Popover content={!session ? contentLogin : contentLogout} trigger="click" title="">
											<div className="user-wrap">
												<div className="user-info">
													{session?.user ? (
														<div className="user-wrap">
															<div className="user-img">
																<img src={dataUser?.Avatar ? dataUser.Avatar : '/images/user.png'} alt="" />
															</div>
															<div className="user-info">
																<p className="user-name">{dataUser?.FullNameUnicode}</p>
																<p className="user-position">{dataUser?.RoleName}</p>
															</div>
														</div>
													) : (
														<p>Tài khoản</p>
													)}
												</div>
											</div>
										</Popover>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</header>

			<div className="shopping__cart-body">
				{isLoading.loading && isLoading.status == 'GET_CART_DATA' ? (
					<Skeleton active />
				) : (
					<div className="shopping__cart-content row m-0 p-0">
						<div className="shopping__cart-items" style={{ marginLeft: 10, marginRight: -10 }}>
							{renderCartItems()}
						</div>

						<div className="shopping__cart-total">
							<div className="row">
								<h5 className="col-4 pr-0">Tổng cộng: </h5>
								<h5 className="font-weight-primary col-8">
									{numberWithCommas(cartItems?.reduce((a, b) => Number(a) + Number(b.Price * b.Quantity), 0))}
									<span className="ml-2">VND</span>
								</h5>
							</div>
							<Link href="/cart/check-out">
								<button disabled={!!cartItems && cartItems.length == 0 ? true : false} className="btn btn-primary w-100">
									Thanh toán
								</button>
							</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default ShoppingCart

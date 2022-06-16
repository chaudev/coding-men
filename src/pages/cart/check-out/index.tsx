import { FormOutlined, LockOutlined, LoginOutlined, LogoutOutlined, RedoOutlined, UserOutlined } from '@ant-design/icons'
import { Form, Input, Popover, Radio, Skeleton, Spin, Select, Card, Button, Avatar, Modal, List } from 'antd'
import { signIn, signOut, useSession } from 'next-auth/client'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { paymentConfig } from '~/apiBase/shopping-cart/payment-config'
import { shoppingCartApi } from '~/apiBase/shopping-cart/shopping-cart'
import { numberWithCommas, parseToMoney } from '~/utils/functions'
import { useWrap } from './../../../context/wrap'
import { discountApi } from './../../../apiBase/options/discount'
import RenderItemTicket from './render-item-ticket'

const CheckOut = () => {
	const { showNoti } = useWrap()
	const router = useRouter()
	const [session] = useSession()
	const [dataUser, setDataUser] = useState<IUser>()
	const [cartItems, setCartItems] = useState<IShoppingCart[]>()
	const [paymentMethods, setPaymentMethods] = useState([])
	const [method, setMethod] = useState<{ PaymentCode: string; transferpayment: string }>({ PaymentCode: '', transferpayment: '' })
	const [discount, setDiscount] = useState([])
	const [promo, setPromo] = useState(null)
	const [isLoading, setIsLoading] = useState({ status: '', loading: false })
	const { userInformation, pageSize } = useWrap()
	const [form] = Form.useForm()
	const [dataOrder, setDataOrder] = useState<{ Note: string; OrderDetailModels: Array<any>; OrderID: number; TotalPayment: number }>(null)
	const [cartID, setCartID] = useState(null)

	const [showDiscount, setShowDiscount] = useState(false)
	const [discountSelected, setDiscountSelected] = useState<any>('')

	const renderPaymentMethodDetail = () => {
		const isOnePay = () => {
			if (method.PaymentCode.toLowerCase().includes('onepay') || method.PaymentCode.toLowerCase().includes('one-pay')) {
				return true
			} else {
				return false
			}
		}

		const isMomo = () => {
			if (method.PaymentCode.toLowerCase().includes('momo') || method.PaymentCode.toLowerCase().includes('mo-mo')) {
				return true
			} else {
				return false
			}
		}

		const isPaypal = () => {
			if (method.PaymentCode.toLowerCase().includes('paypal') || method.PaymentCode.toLowerCase().includes('pay-pal')) {
				return true
			} else {
				return false
			}
		}

		return (
			<>
				{isMomo() && (
					<div className="paypal-info">
						<div className="content">Vui lòng nhấn vào nút thanh toán để chuyển đến trang thanh toán Momo</div>
						<div className="row m-0 p-0 ml-2">
							<LockOutlined className="lock" />
							<div className="ml-2 text">Bảo mật</div>
						</div>
					</div>
				)}

				{isPaypal() && (
					<div className="paypal-info">
						<div className="content">Vui lòng nhấn vào nút thanh toán để chuyển đến trang thanh toán Paypal</div>
						<div className="row m-0 p-0 ml-2">
							<LockOutlined className="lock" />
							<div className="ml-2 text">Bảo mật</div>
						</div>
					</div>
				)}

				{isOnePay() && (
					<div className="paypal-info">
						<div className="content">Vui lòng nhấn vào nút thanh toán để chuyển đến trang thanh toán Onepay</div>
						<div className="row m-0 p-0 ml-2">
							<LockOutlined className="lock" />
							<div className="ml-2 text">Bảo mật</div>
						</div>
					</div>
				)}

				{method.PaymentCode == 'transferpayment' && (
					<div className="paypal-info">
						<div>{ReactHtmlParser(paymentMethods.filter((item) => item.transferpayment.length > 0)[0].transferpayment)}</div>
					</div>
				)}

				{method.PaymentCode.toLowerCase().includes('cash') && (
					<div className="paypal-info">
						<div className="content">Quý khách vui lòng đến trung tâm đã đăng kí để hoàn tất thanh toán</div>
						<div className="row m-0 p-0 ml-2">
							<LockOutlined className="lock" />
							<div className="ml-2 text">Bảo mật</div>
						</div>
					</div>
				)}
			</>
		)
	}

	const handleCheckout = async () => {
		setIsLoading({ status: 'CHECKOUT', loading: true })
		let res = null
		try {
			switch (method.PaymentCode) {
				case 'momo':
					res = await shoppingCartApi.checkoutMomo({ OrderID: dataOrder.OrderID, type: method.PaymentCode })
					break
				case 'momo_test':
					res = await shoppingCartApi.checkoutMomo({ OrderID: dataOrder.OrderID, type: method.PaymentCode })
					break
				case 'paypal':
					res = await shoppingCartApi.checkoutPaypal({ OrderID: dataOrder.OrderID, type: method.PaymentCode })
					break
				case 'paypal_test':
					res = await shoppingCartApi.checkoutPaypal({ OrderID: dataOrder.OrderID, type: method.PaymentCode })
					break
				case 'onepayinternational':
					res = await shoppingCartApi.checkoutPaymentWithOnePay({ OrderID: dataOrder.OrderID, type: method.PaymentCode })
					break
				case 'onepayinternational_test':
					res = await shoppingCartApi.checkoutPaymentWithOnePay({ OrderID: dataOrder.OrderID, type: method.PaymentCode })
					break
				case 'onepaydomestic':
					res = await shoppingCartApi.checkoutPaymentWithOnePay({ OrderID: dataOrder.OrderID, type: method.PaymentCode })
					break
				case 'cashpayment':
					res = await shoppingCartApi.checkoutCash({ cartID: cartID, type: method.PaymentCode })
					break
				case 'transferpayment':
					res = await shoppingCartApi.checkoutTransferPayment({ cartID: cartID, type: method.PaymentCode })
					break
				default:
					break
			}

			if (res.status == 200) {
				switch (method.PaymentCode) {
					case 'momo':
						router.push(res.data.payUrl)
						break
					case 'momo_test':
						router.push(res.data.payUrl)
						break
					case 'paypal':
						router.push(res.data.payUrl)
						break
					case 'paypal_test':
						router.push(res.data.payUrl)
						break
					case 'onepayinternational':
						router.push(res.data.payUrl)
						break
					case 'onepayinternational_test':
						router.push(res.data.payUrl)
						break
					case 'onepaydomestic':
						router.push(res.data.payUrl)
						break
					case 'onepaydomestic_test':
						router.push(res.data.payUrl)
						break
					case 'cashpayment':
						router.push({
							pathname: '/cart/success',
							query: { type: 'cashpayment' }
						})
						break
					case 'transferpayment':
						router.push({
							pathname: '/cart/success',
							query: { type: 'transferpayment' }
						})
						break
					default:
						break
				}
			}
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setIsLoading({
				status: 'CHECKOUT',
				loading: false
			})
		}
	}

	const getShoppingCartData = async () => {
		setIsLoading({ status: 'loading', loading: true })
		try {
			let res: any = await shoppingCartApi.getAll()
			if (res.status == 200) {
				setCartItems(res.data.data)
				getOrderID(res.data.cartId)
				setCartID(res.data.cartId)
			}
			if (res.status == 204) {
				setCartItems([])
			}
		} catch (error) {
			console.log(error)
		} finally {
			setIsLoading({ status: 'loading', loading: false })
		}
	}

	const renderCartItems = () => {
		return cartItems?.map((item, index) => (
			<div className="item d-flex justify-content-between align-items-center row" key={index}>
				<Link
					href={{
						pathname: '/video-course/[slug]',
						query: { slug: item.VideoCourseID, Thum: item.ImageThumbnails, Sell: item.Price }
					}}
				>
					<Avatar
						className="avatar"
						src={item.ImageThumbnails.length ? item.ImageThumbnails : '/images/logo-thumnail.jpg'}
						alt="img course"
					/>
				</Link>
				<h5>{item.VideoCourseName}</h5>
				<span className="quantity font-weight-green">{item.Quantity}</span>
				<p className="font-weight-green">{numberWithCommas(item.Price * item.Quantity)} vnd</p>
			</div>
		))
	}

	const getDiscount = async () => {
		try {
			let res = await discountApi.getSuggest(dataOrder.OrderID)
			res.status === 200 && setDiscount(res.data.data)
		} catch (error) {
			console.log(error)
		}
	}

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
		let base64Url = token.split('.')[1]
		let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
		let jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map(function (c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
				})
				.join('')
		)
		return JSON.parse(jsonPayload)
	}

	const applyDiscount = async (param: any) => {
		try {
			let res = await shoppingCartApi.applyDiscount({ OrderID: dataOrder.OrderID, DiscountCode: param?.DiscountCode })
			if (res.status == 200) {
				showNoti('success', 'Thêm mã khuyến mãi thành công!')
				setShowDiscount(false)
				setPromo(res.data.data)
				setDiscountSelected(param)
			}
		} catch (error) {
			setPromo(undefined)
			setDiscountSelected(undefined)
			showNoti('danger', error.message)
		}
	}

	const getPaymentMethod = async () => {
		setIsLoading({ status: 'GET_ALL', loading: true })
		try {
			let res = await paymentConfig.getAll()
			if (res.status == 200) {
				setPaymentMethods(res.data.data)
				setMethod({ ...method, PaymentCode: res.data.data[0].PaymentCode })
			}
		} catch (error) {
			console.log(error)
		} finally {
			setIsLoading({ status: 'GET_ALL', loading: false })
		}
	}

	const getOrderID = async (cartId) => {
		try {
			let res = await shoppingCartApi.getOrderID({ cartId: cartId })
			res.status == 200 && setDataOrder(res.data.data)
		} catch (error) {
			console.log(error)
		}
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
		getPaymentMethod()
	}, [])

	useEffect(() => {
		if (showDiscount) {
			getDiscount()
		}
	}, [showDiscount])

	const onChangeRadio = (event) => {
		setMethod({ PaymentCode: event.target.value, transferpayment: '' })
	}

	const _changeDiscount = (param: any) => {
		applyDiscount(param)
	}

	const [inputDiscount, setInputDiscount] = useState<string>('')

	return (
		<div style={{ backgroundColor: '#fff' }}>
			<header>
				<div className="shopping__cart-header justify-content-between align-items-center row">
					<div className="header__logo col-6 col-md-3">
						<Link href="/">
							<a href="#">
								<img className="logo-img" src="/images/logo-square.png" alt="logo branch"></img>
							</a>
						</Link>
					</div>
					<div className="header__profile col-2">
						<div className="col-setting">
							<ul className="col-setting-list">
								<li className="user">
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

			<div className="container checkout">
				<div className="title">
					<h2>Thanh toán</h2>
					<Link href="/cart/shopping-cart">
						<Button className="btn btn-cancel">Quay lại giỏ hàng</Button>
					</Link>
				</div>

				<div className="row m-0 p-0">
					<div className="col-12 col-md-8 content mb-4">
						<Card className="card">
							<Radio.Group onChange={onChangeRadio} value={method.PaymentCode} className="radio">
								{paymentMethods &&
									paymentMethods.map((item, index) => {
										return (
											<div className="payment-card type-checkout" key={index}>
												<Radio value={item.PaymentCode} key={index}>
													<div className="logo-branch p-1 d-flex justify-content-between align-items-center">
														<p className="mb-0">{item.PaymentName}</p>
														<div>
															<img src={item.PaymentLogo} alt="img branch cc"></img>
														</div>
													</div>
												</Radio>
											</div>
										)
									})}
							</Radio.Group>

							<div className="payment-method">{renderPaymentMethodDetail()}</div>

							<div className="order-detail mt-4">
								<h4>Chi tiết mua hàng</h4>
								{isLoading.loading ? <Skeleton active /> : renderCartItems()}
							</div>
						</Card>
					</div>

					<div className="sumary content col-12 col-md-4">
						<Card className="card">
							<h4>Khuyến mãi</h4>

							<Form form={form}>
								<div className="mb-4 w-100">
									<Button onClick={() => setShowDiscount(true)} className="btn btn-light w-100">
										Chọn mã khuyến mãi
									</Button>
									{!!discountSelected && <div className="mt-2">Đã chọn: {discountSelected?.DiscountCode}</div>}
								</div>
							</Form>

							<h4>Tổng thanh toán</h4>
							<div className="row">
								<div className="col-6">
									<h6>Giá gốc</h6>
								</div>
								<div className="col-6" style={{ textAlign: 'right' }}>
									{parseToMoney(dataOrder?.TotalPayment)} VND
								</div>
							</div>

							{!!promo && (
								<div className="row sumary__price">
									<div className="col-6">
										<h6>Khuyến mãi</h6>
									</div>
									<div className="col-6" style={{ textAlign: 'right' }}>
										- {parseToMoney(promo.DiscountPrice)} VND
									</div>
								</div>
							)}

							<div className="row">
								<p className="bold col-6">Tổng cộng:</p>
								<div className="col-6 bold" style={{ textAlign: 'right' }}>
									{!!promo?.DiscountPrice
										? parseToMoney(dataOrder?.TotalPayment - promo?.DiscountPrice)
										: parseToMoney(dataOrder?.TotalPayment)}
									VND
								</div>
							</div>

							<button className="btn btn-primary w-100" onClick={handleCheckout}>
								Thanh toán
								{isLoading.status == 'CHECKOUT' && isLoading.loading && <Spin className="loading-base" />}
							</button>
						</Card>
					</div>
				</div>
			</div>

			<>
				<Modal
					className="custom-scroll-bar"
					title="Khuyến mãi"
					centered
					visible={showDiscount}
					onCancel={() => setShowDiscount(false)}
					footer={null}
				>
					<div className="scrollable w-discount">
						<div className="input-discount row-center">
							<Input className="style-input" placeholder="Nhập mã khuyến mãi" onChange={(e) => setInputDiscount(e.target.value)} />
							<Button onClick={() => _changeDiscount({ DiscountCode: inputDiscount })} className="btn btn-primary ml-3">
								Áp dụng
							</Button>
						</div>
						<List
							itemLayout="horizontal"
							dataSource={discount}
							renderItem={(item) => (
								<RenderItemTicket
									Total={dataOrder?.TotalPayment}
									onClick={(item: any) => _changeDiscount(item)}
									item={item}
									selected={discountSelected}
								/>
							)}
						/>
					</div>
				</Modal>
			</>
		</div>
	)
}

export default CheckOut

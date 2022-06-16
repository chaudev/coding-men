import Modal from 'antd/lib/modal/Modal'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { paymentConfig } from '~/apiBase/shopping-cart/payment-config'
import ReactHtmlParser from 'react-html-parser'
import _ from '~/appConfig'

PaymentMethodsContent.propTypes = {
	paymentMethodsType: PropTypes.number
}
PaymentMethodsContent.defaultProps = {
	paymentMethodsType: 0
}

function PaymentMethodsContent(props) {
	const { paymentMethodsType } = props
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [paymentMethods, setPaymentMethods] = useState([])

	useEffect(() => {
		getPaymentMethod()
	}, [])

	const getPaymentMethod = async () => {
		try {
			let res: any = await paymentConfig.getAll()
			if (res.status == 200) {
				setPaymentMethods(res.data.data)
			}
		} catch (error) {
		} finally {
		}
	}

	const _getPaymentDetail = () => {
		let result = ''
		for (let i = 0; i < paymentMethods.length; i++) {
			const e = paymentMethods[i]

			if (paymentMethodsType == 1) {
				let temp = e?.PaymentName
				if (!!temp && (temp.toLowerCase() == 'tiền mặt' || temp.toLowerCase() == 'tien mat')) {
					result = e?.transferpayment
				}
			} else {
				let temp = e?.PaymentName
				if (!!temp && (temp.toLowerCase() == 'chuyển khoản' || temp.toLowerCase() == 'chuyen khoan')) {
					result = e?.transferpayment
				}
			}
		}
		return result
	}

	return (
		<>
			<a href="#" onClick={() => setIsModalVisible(true)} style={{ fontStyle: 'italic', fontWeight: 500, color: 'red' }}>
				{paymentMethodsType === 1 ? 'Quy trình thanh toán tiền mặt' : paymentMethodsType === 2 ? 'Quy trình thanh toán chuyển khoản' : null}
			</a>
			<Modal
				style={{ top: 40 }}
				title="Thông tin thanh toán"
				visible={isModalVisible}
				width={800}
				onCancel={() => setIsModalVisible(false)}
				footer={
					<button className="btn btn-secondary" onClick={() => setIsModalVisible(false)}>
						Tôi đã hiểu
					</button>
				}
				centered
			>
				{!!_getPaymentDetail() ? (
					ReactHtmlParser(_getPaymentDetail())
				) : (
					<div style={{ color: _.primaryColor, fontSize: 16 }}>Chưa có thông tin</div>
				)}
			</Modal>
		</>
	)
}

export default PaymentMethodsContent

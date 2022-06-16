import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Modal, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import EditorField from '~/components/FormControl/EditorField'
import InputTextField from '~/components/FormControl/InputTextField'
import RadioField from '~/components/FormControl/RadioField'
import { numberWithCommas } from '~/utils/functions'
import PackageStorePaymentMethods from '../PaymentMethodsContent/PaymentMethodsContent'
import Link from 'next/link'

PackageStoreForm.propTypes = {
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	isAddPackageFree: PropTypes.bool,
	packageItem: PropTypes.object,
	handleSubmit: PropTypes.func
}

PackageStoreForm.defaultProps = {
	isLoading: { type: '', status: false },
	isAddPackageFree: false,
	packageItem: {},
	handleSubmit: null
}

function PackageStoreForm(props) {
	const { isAddPackageFree, isLoading, packageItem, handleSubmit } = props
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [showPaymentMethods, setShowPaymentMethods] = useState(true)
	const [paymentMethodsType, setPaymentMethodsType] = useState(2)

	const openModal = () => setIsModalVisible(true)
	const closeModal = () => setIsModalVisible(false)

	const schema = yup.object().shape({
		Name: yup.string().required('Bạn không được để trống'),
		Level: yup.string().required('Bạn không được để trống'),
		Price: yup.string().required('Bạn không được để trống'),
		PaymentMethodsID: yup
			.number()
			.notRequired()
			.when('Price', (Price, schema) => {
				if (parseInt(Price)) {
					return yup.number().oneOf([1, 2], 'Bạn không được để trống').required('Bạn không được để trống')
				}
				return yup.number().notRequired()
			}),
		Note: yup.string()
	})
	const defaultValuesInit = {
		Name: '',
		Level: 1,
		Price: '',
		PaymentMethodsID: 0,
		Note: ''
	}
	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	})

	useEffect(() => {
		if (packageItem) {
			const { Price } = packageItem
			form.reset({
				...packageItem,
				Price: Price ? numberWithCommas(Price) : 'Miễn phí',
				PaymentMethodsID: 0,
				Note: ''
			})
			if (Price) {
				setShowPaymentMethods(true)
			} else {
				setShowPaymentMethods(false)
			}
		}
	}, [packageItem])

	const checkHandleSubmit = () => {
		let data = {
			...packageItem,
			Name: form.getValues('Name'),
			Level: form.getValues('Level'),
			PaymentMethodsID: form.getValues('PaymentMethodsID'),
			Price: form.getValues('Price'),
			Note: form.getValues('Note')
		}

		if (!handleSubmit) return
		handleSubmit(data).then((res) => {
			if (res?.status === 200) {
				closeModal()
				setPaymentMethodsType(0)
				form.reset({
					...packageItem,
					Price: packageItem.Price ? numberWithCommas(packageItem.Price) : 'Miễn phí',
					PaymentMethodsID: 0,
					Note: ''
				})
			}
		})
	}

	return (
		<>
			{packageItem?.ButtonAddPackage == 'unavailable' ? (
				<>
					{isAddPackageFree ? (
						<button type="button" className="btn btn-warning" onClick={openModal}>
							Thêm bộ đề
						</button>
					) : (
						<button type="button" className="btn btn-primary" onClick={openModal}>
							Mua bộ đề
						</button>
					)}
				</>
			) : (
				<Link
					href={{
						pathname: '/package/package-student/package-student-detail/[slug]',
						query: { slug: packageItem?.ID }
					}}
				>
					<button type="button" className="btn btn-blue">
						Chi tiết bộ đề
					</button>
				</Link>
			)}

			<Modal
				style={{ top: 40 }}
				title={isAddPackageFree ? 'Thêm bộ đề miễn phí' : 'Xác nhận mua bộ đề'}
				visible={isModalVisible}
				footer={null}
				onCancel={closeModal}
			>
				<div className="wrap-form">
					<Form layout="vertical" onFinish={form.handleSubmit(checkHandleSubmit)}>
						<div className="row">
							<div className="col-md-12 col-12">
								<InputTextField isRequired={false} form={form} name="Name" label="Tên bộ đề" placeholder="Nhập tên bộ đề" disabled={true} />
							</div>
							<div className="col-md-12 col-12">
								<InputTextField
									form={form}
									isRequired={false}
									name="Price"
									label="Giá"
									placeholder="Nhập giá"
									handleFormatCurrency={numberWithCommas}
									disabled={true}
								/>
							</div>
							{showPaymentMethods && (
								<>
									<div className="col-md-12 col-12" style={{ marginBottom: 12 }}>
										<RadioField
											form={form}
											name="PaymentMethodsID"
											label="Hình thức thanh toán"
											style={{ marginBottom: 4 }}
											radioList={[{ label: 'Chuyển khoản', value: 2 }]}
											handleChange={(PaymentMethodsID: number) => {
												setPaymentMethodsType(PaymentMethodsID)
											}}
										/>
										<PackageStorePaymentMethods paymentMethodsType={paymentMethodsType} />
									</div>
									<div className="col-md-12 col-12">
										<EditorField form={form} name="Note" label="Ghi chú" height={100} />
									</div>
								</>
							)}
							<div className="col-md-12 col-12 mt-3 " style={{ textAlign: 'center' }}>
								<button
									onClick={() => checkHandleSubmit()}
									className="btn btn-primary"
									disabled={isLoading.type == 'ADD_DATA' && isLoading.status}
								>
									{isAddPackageFree ? 'Xác nhận' : 'Thanh toán'}
									{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
}

export default PackageStoreForm

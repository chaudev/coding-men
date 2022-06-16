import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Modal, Spin, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import InputTextField from '~/components/FormControl/InputTextField'
import RadioField from '~/components/FormControl/RadioField'
import TextAreaField from '~/components/FormControl/TextAreaField'
import UploadAvatarField from '~/components/FormControl/UploadAvatarField'
import { numberWithCommas } from '~/utils/functions'
import PriceField from '~/components/FormControl/PriceField'

const defaultValuesInit = {
	Name: '',
	Avatar: '',
	Price: '',
	Description: ''
}

type ISubmitData = {
	Name: string
	Level: number
	Type: number
	Avatar: string
	Price: string
	Description: string
}

type IPropTypes = {
	isUpdate: boolean
	updateObj: any
	isLoading: { type: string; status: boolean }
	handleCreatePackage: Function
	handleUpdatePackage: Function
	paymentMethodOptionList: any
}

function PackageForm(props: IPropTypes) {
	const { isUpdate, isLoading, updateObj, handleCreatePackage, handleUpdatePackage, paymentMethodOptionList } = props
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [showMoreField, setShowMoreField] = useState(false)

	const openModal = () => setIsModalVisible(true)
	const closeModal = () => setIsModalVisible(false)

	const schema = yup.object().shape({
		Name: yup.string().required('Bạn không được để trống'),
		Price: yup
			.string()
			.notRequired()
			.when('Type', (Type, schema) => {
				if (parseInt(Type) === 2) {
					return yup.string().required('Bạn không được để trống')
				}
				return yup.string().notRequired()
			})
	})

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	})

	useEffect(() => {
		if (isUpdate && updateObj) {
			if (updateObj.Type === 2) setShowMoreField(true)
			form.reset({ ...updateObj, Price: !updateObj.Price ? '' : numberWithCommas(updateObj.Price) })
		}
	}, [updateObj])

	const packageListSwitchFunc = (data: ISubmitData) => {
		switch (isUpdate) {
			case true:
				if (!handleUpdatePackage) return
				handleUpdatePackage(data).then((res) => {
					if (res && res.status === 200) {
						closeModal()
					}
				})
				break
			case false:
				if (!handleCreatePackage) return
				handleCreatePackage(data).then((res) => {
					if (res && res.status === 200) {
						closeModal()
						form.reset({ ...defaultValuesInit })
					}
				})
				break
			default:
				break
		}
	}
	return (
		<>
			{isUpdate ? (
				<button className="btn btn-icon edit" onClick={openModal}>
					<Tooltip title="Cập nhật">
						<i className="fas fa-edit" style={{ color: '#34c4a4', fontSize: 16, marginBottom: -1 }}></i>
					</Tooltip>
				</button>
			) : (
				<button className="btn btn-warning add-new" onClick={openModal}>
					Tạo bộ đề mới
				</button>
			)}

			<Modal
				style={{ top: 50 }}
				title={isUpdate ? 'Cập nhật bộ đề' : 'Tạo bộ đề mới'}
				visible={isModalVisible}
				footer={null}
				onCancel={closeModal}
			>
				<div className="wrap-form">
					<Form layout="vertical" onFinish={form.handleSubmit(packageListSwitchFunc)}>
						<div className="row">
							<div className="col-md-12 col-12">
								<InputTextField
									handleChange={(text: any) => form.setValue('Name', text)}
									isRequired
									form={form}
									name="Name"
									label="Tên bộ đề"
									placeholder="Nhập tên bộ đề"
								/>
							</div>

							<div className="col-md-6 col-12">
								<UploadAvatarField form={form} name="Avatar" label="Thumbnail" />{' '}
								<div className="mb-4">
									<p className="font-weight-primary" style={{ color: 'red' }}>
										*Lưu ý: Upload tối đa 100Mb
									</p>
								</div>
							</div>

							<div className="col-md-6 col-12">
								<RadioField
									form={form}
									name="Type"
									label="Chọn loại"
									radioList={paymentMethodOptionList}
									handleChange={(typeID: number) => {
										typeID === 2 ? setShowMoreField(true) : setShowMoreField(false)
									}}
								/>
								{showMoreField && <PriceField isRequired form={form} name="Price" label="Giá" />}
							</div>

							<div className="col-md-12 col-12 mb-5">
								<TextAreaField form={form} name="Description" label="Mô tả" placeholder="Nhập mô tả" rows={5} />
							</div>

							<div className="col-md-12 col-12 mt-3 " style={{ textAlign: 'center' }}>
								<button type="submit" className="btn btn-primary" disabled={isLoading.type == 'ADD_DATA' && isLoading.status}>
									{isUpdate ? 'Cập nhật' : 'Khởi tạo'}
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

PackageForm.defaultProps = {
	isUpdate: false,
	updateObj: {},
	isLoading: { type: '', status: false },
	handleCreatePackage: null,
	handleUpdatePackage: null,
	paymentMethodOptionList: []
}

export default PackageForm

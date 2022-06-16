import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Switch, Tooltip, Select, DatePicker, Spin, Upload, Button, Image } from 'antd'
import { useForm } from 'react-hook-form'
import moment from 'moment'
import { parseToMoney } from '~/utils/functions'
import NumberFormat from 'react-number-format'
import { UploadOutlined } from '@ant-design/icons'
import { newsFeedApi } from '~/apiBase'
import { useWrap } from '~/context/wrap'

const dateFormat = 'YYYY/MM/DD'

const DiscountForm = (props) => {
	const { Option } = Select
	const { TextArea } = Input
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [form] = Form.useForm()
	const status = [
		{
			id: 1,
			text: 'Chưa kích hoạt'
		},
		{
			id: 2,
			text: 'Đã kích hoạt'
		},
		{
			id: 3,
			text: 'Hết hạn'
		}
	]
	const packages = [
		{
			id: 1,
			text: 'Đơn hàng lẻ'
		},
		{
			id: 2,
			text: 'Đơn hàng combo'
		},
		{
			id: 3,
			text: 'Không điều kiện'
		}
	]

	const { showNoti } = useWrap()

	const { handleSubmit, setValue } = useForm()
	const [percent, setPercent] = useState(false)
	const [loading, setLoading] = useState(false)

	const [imageSelected, setImageSelected] = useState({ name: '' })
	const [previewImage, setPreviewImage] = useState('')

	const onChange = () => {
		setPercent(!percent)
	}

	const replaceDot = (param: string) => {
		return !!param ? param.toString().replace(',', '').replace(',', '').replace(',', '').replace(',', '') : ''
	}

	const onSubmit = handleSubmit(async (data: any) => {
		setLoading(true)
		let temp = ''
		if (!!imageSelected?.name) {
			temp = await uploadFile(imageSelected)
		}
		if (!props.rowData) {
			if (percent) {
				data.DiscountType = 2
			} else {
				data.DiscountType = 1
			}
		}
		let res = await props._onSubmit({
			...data,
			Discount: replaceDot(data?.Discount),
			MinimumOrder: replaceDot(data?.MinimumOrder),
			Images: !!temp ? temp : !!props?.rowData?.Images ? props.rowData.Images : '',
			MaxDiscountPrice: !!data?.MaxDiscount ? replaceDot(data?.MaxDiscount) : null,
			MaxDiscount: !!data?.MaxDiscount ? replaceDot(data?.MaxDiscount) : null
		})
		if (res !== null) {
			setIsModalVisible(false)
			form.resetFields()
		} else {
			setLoading(false)
		}
	})

	const uploadFile = async (file) => {
		try {
			let res = await newsFeedApi.uploadFile(file.originFileObj)
			if (res.status == 200 || res.status == 204) {
				return res.data.data
			}
		} catch (error) {
			showNoti('danger', error.message)
		}
	}

	useEffect(() => {
		if (isModalVisible) {
			if (!!props.rowData) {
				setValue('ID', props.rowData.ID)
				setValue('Discount', props.rowData.Discount)
				setValue('DiscountType', props.rowData.DiscountType)
				setValue('Status', props.rowData.Status)
				setValue('Note', props.rowData.Note)
				setValue('DeadLine', props.rowData.DeadLine)
				setValue('Quantity', props.rowData.Quantity)
				setValue('Style', props.rowData.Style)
				setValue('MinimumOrder', props.rowData.MinimumOrder)
				setPreviewImage(props.rowData.Images)
			}
		}
	}, [isModalVisible])

	useEffect(() => {
		if (!props.showAdd) {
			setPercent(props.rowData.DiscountType == 2 ? true : false)
		}
	}, [props.showAdd])

	const handleUploadFile = async (info) => {
		setImageSelected(info.file)
		setPreviewImage(URL.createObjectURL(info.file.originFileObj))
	}

	// Handle delete image
	const handleDeleteImage = () => {
		setImageSelected({ name: '' })
		setPreviewImage('')
	}

	return (
		<>
			{props.showIcon && (
				<button className="btn btn-icon edit" onClick={() => setIsModalVisible(true)}>
					<Tooltip title="Cập nhật">
						<i className="fas fa-edit" style={{ color: '#34c4a4', fontSize: 16, marginBottom: -1 }}></i>
					</Tooltip>
				</button>
			)}
			{props.showAdd && (
				<button className="btn btn-warning add-new" onClick={() => setIsModalVisible(true)}>
					Thêm mới
				</button>
			)}

			<Modal
				title={<>{props.showAdd ? 'Thêm mã khuyến mãi' : 'Cập nhật mã khuyến mãi'}</>}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<div className="row">
							<div className="col-6">
								<Form.Item
									label="Mã khuyến mãi"
									name="DiscountCode"
									rules={[{ required: true, message: 'Bạn không được bỏ trống' }]}
									initialValue={props.showAdd ? '' : props.rowData?.DiscountCode}
								>
									<Input
										onChange={(value) => setValue('DiscountCode', value.target.value)}
										placeholder="Mã khuyến mãi"
										className="style-input"
									/>
								</Form.Item>
							</div>

							<div className="col-6">
								<Form.Item
									label="Đơn hàng tối thiểu"
									name="MinimumOrder"
									rules={[{ required: false, message: 'Bạn không được bỏ trống' }]}
									initialValue={props.showAdd ? '' : props.rowData?.MinimumOrder}
								>
									<NumberFormat
										className="ant-input style-input w-100"
										onChange={(e: any) => setValue('MinimumOrder', e.target.value)}
										thousandSeparator={true}
									/>
								</Form.Item>
							</div>

							<div className="col-6">
								{percent ? (
									<>
										<Form.Item
											label="Khuyến mãi %"
											name="Discount"
											rules={[{ required: true, message: 'Bạn không được bỏ trống' }]}
											initialValue={props.showAdd ? '' : props.rowData?.Discount}
										>
											<NumberFormat
												className="ant-input style-input w-100"
												onChange={(e: any) => setValue('Discount', e.target.value)}
												thousandSeparator={true}
											/>
										</Form.Item>
										<Form.Item
											label="Khuyến mãi tối đa"
											name="MaxDiscount"
											rules={[{ required: true, message: 'Bạn không được bỏ trống' }]}
											initialValue={props.showAdd ? '' : props.rowData?.MaxDiscountPrice}
										>
											<NumberFormat
												className="ant-input style-input w-100"
												onChange={(e: any) => setValue('MaxDiscount', e.target.value)}
												thousandSeparator={true}
											/>
										</Form.Item>
									</>
								) : (
									<Form.Item
										label="Giá trị khuyến mãi"
										name="Discount"
										rules={[{ required: true, message: 'Bạn không được bỏ trống' }]}
										initialValue={props.showAdd ? '' : parseToMoney(props.rowData?.Discount)}
									>
										<NumberFormat
											className="ant-input style-input w-100"
											onChange={(e: any) => setValue('Discount', e.target.value)}
											thousandSeparator={true}
										/>
									</Form.Item>
								)}
							</div>

							<div className="col-6 d-flex">
								<Form.Item label="Phần trăm">
									<Switch checked={percent} onChange={onChange} />
								</Form.Item>
							</div>
						</div>

						{/*  */}
						<div className="row">
							<div className="col-6">
								<Form.Item
									label="Số lượng"
									name="Quantity"
									rules={[{ required: true, message: 'Bạn không được bỏ trống' }]}
									initialValue={props.rowData?.Quantity}
								>
									<Input placeholder="" className="style-input" type="number" onChange={(e) => setValue('Quantity', e.target.value)} />
								</Form.Item>
							</div>
							<div className="col-6">
								<Form.Item
									label="Thời hạn"
									name="DeadLine"
									rules={[{ required: true, message: 'Bạn không được bỏ trống' }]}
									initialValue={props.showAdd ? '' : moment(`${props.rowData?.DeadLine}`, dateFormat)}
								>
									<DatePicker
										placeholder="Chọn ngày"
										className="style-input"
										format={dateFormat}
										onChange={(date, dateSting) => setValue('DeadLine', dateSting)}
									/>
								</Form.Item>
							</div>
						</div>
						{/*  */}
						<div className="row">
							<div className="col-6">
								<Form.Item
									label="Trạng thái"
									name="Status"
									rules={[{ required: true, message: 'Bạn không được bỏ trống' }]}
									initialValue={props.rowData?.StatusName}
								>
									<Select className="style-input" allowClear={true} onChange={(value) => setValue('Status', value)}>
										{status.map((row) => (
											<Option key={row.id} value={row.id}>
												{row.text}
											</Option>
										))}
									</Select>
								</Form.Item>
							</div>
							<div className="col-6">
								<Form.Item
									label="Áp dụng cho"
									name="Packages"
									rules={[{ required: true, message: 'Bạn không được bỏ trống' }]}
									initialValue={props.showAdd ? '' : props.rowData?.Style}
								>
									<Select className="style-input" allowClear={true} onChange={(value) => setValue('Style', value)}>
										{packages.map((row) => (
											<Option key={row.id} value={row.id}>
												{row.text}
											</Option>
										))}
									</Select>
								</Form.Item>
							</div>
						</div>

						<div className="row">
							<div className="col-md-6 col-12">
								<Form.Item name="Image" label="Hình ảnh thu nhỏ">
									<Upload style={{ width: 800 }} className="vc-e-upload" onChange={(e) => handleUploadFile(e)} showUploadList={false}>
										<Button className="vc-e-upload" icon={<UploadOutlined style={{ marginTop: -2 }} />}>
											Bấm để tải hình ảnh
										</Button>
									</Upload>
									{imageSelected.name !== undefined && imageSelected.name !== '' && (
										<div className="row m-0 mt-3 vc-store-center">
											<Button danger onClick={() => handleDeleteImage()}>
												Xoá hình ảnh
											</Button>
										</div>
									)}
								</Form.Item>
							</div>
							{previewImage !== '' && (
								<div className="col-md-6 col-12">
									<Image className="img-preview" src={previewImage} />
								</div>
							)}
						</div>

						<div className="row">
							<div className="col-12">
								<Form.Item name="Note" label="Ghi chú" initialValue={props.rowData?.Note}>
									<TextArea placeholder="" rows={2} allowClear={true} onChange={(e) => setValue('Note', e.target.value)} />
								</Form.Item>
							</div>
						</div>
						{/*  */}
						<div className="row mt-5">
							<div className="col-12 mt-3">
								<button type="submit" className="btn btn-primary w-100">
									Lưu
									{loading && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
}

export default DiscountForm

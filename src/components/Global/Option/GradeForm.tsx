import { Form, Input, Modal, Spin, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useWrap } from '~/context/wrap'

const GradeForm = React.memo((props: any) => {
	const [isModalVisible, setIsModalVisible] = useState(false)
	const { isLoading, rowID, _onSubmit, getIndex, index, rowData } = props
	const {
		register,
		handleSubmit,
		setValue,
		formState: { isSubmitting, errors, isSubmitted }
	} = useForm()
	const { showNoti } = useWrap()
	const [form] = Form.useForm()

	// SUBMI FORM
	const onSubmit = handleSubmit((data: any, e) => {
		let res = _onSubmit(data)

		res.then(function (rs: any) {
			rs && rs.status == 200 && (setIsModalVisible(false), form.resetFields())
		})
	})

	useEffect(() => {
		if (isModalVisible) {
			if (rowID) {
				getIndex()
				// Cập nhật giá trị khi show form update
				Object.keys(rowData).forEach(function (key) {
					setValue(key, rowData[key])
				})
				form.setFieldsValue(rowData)
			}
		}
	}, [isModalVisible])

	return (
		<>
			{rowID ? (
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setIsModalVisible(true)
					}}
				>
					<Tooltip title="Cập nhật">
						<i className="fas fa-edit" style={{ color: '#34c4a4', fontSize: 16, marginBottom: -1 }}></i>
					</Tooltip>
				</button>
			) : (
				<button
					className="btn btn-warning add-new"
					onClick={() => {
						setIsModalVisible(true)
					}}
				>
					Thêm mới
				</button>
			)}

			{/*  */}
			<Modal
				title={rowID ? 'Sửa khối học' : 'Thêm khối học'}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<div className="row">
							<div className="col-12">
								<Form.Item name="GradeCode" label="Mã khối" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
									<Input placeholder="" className="style-input" onChange={(e) => setValue('GradeCode', e.target.value)} allowClear={true} />
								</Form.Item>
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<Form.Item name="GradeName" label="Tên khối" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
									<Input placeholder="" className="style-input" onChange={(e) => setValue('GradeName', e.target.value)} allowClear={true} />
								</Form.Item>
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<Form.Item name="Description" label="Mô Tả" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
									<Input
										placeholder=""
										className="style-input"
										onChange={(e) => setValue('Description', e.target.value)}
										allowClear={true}
									/>
								</Form.Item>
							</div>
						</div>
						<div className="row ">
							<div className="col-12">
								<button type="submit" className="btn btn-primary w-100">
									Lưu
									{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
})

export default GradeForm

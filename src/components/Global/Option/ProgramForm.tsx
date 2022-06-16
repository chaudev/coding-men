import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Spin, Tooltip, Select, InputNumber } from 'antd'
import { RotateCcw } from 'react-feather'
import { useForm } from 'react-hook-form'
import EditorSimple from '~/components/Elements/EditorSimple'
import { numberWithCommas, parsePriceStrToNumber } from '~/utils/functions'

const ProgramForm = React.memo((props: any) => {
	const [isModalVisible, setIsModalVisible] = useState(false)
	const { isLoading, rowData, dataGrade, _onSubmit, programID, getIndex } = props

	const { handleSubmit, setValue } = useForm()
	const { Option } = Select
	const [form] = Form.useForm()

	// HANDLE SUBMIT
	const onSubmit = handleSubmit((data: any) => {
		console.log('data submit: ', data)
		let res = _onSubmit(data)

		res.then(function (rs: any) {
			rs && rs.status == 200 && (setIsModalVisible(false), form.resetFields())
		})
	})

	// FORMAT NUMBER
	const formatNumber = (e) => {
		let value = e.target.value

		value = parseInt(value.replace(/\,/g, ''), 10)

		if (!isNaN(value)) {
			form.setFieldsValue({ Price: numberWithCommas(value) })
			setValue('Price', value)
		} else {
			form.setFieldsValue({ Price: '' })
			setValue('Price', '')
		}
	}

	// HANDLE SELECT
	const onChangeSelect = (name: any) => (value: any) => {
		setValue(name, value)
		console.log('Value: ', value)
	}

	// IS VISIBLE MODAL
	useEffect(() => {
		if (isModalVisible) {
			if (programID) {
				getIndex()
				Object.keys(rowData).forEach(function (key) {
					setValue(key, rowData[key])
				})
				form.setFieldsValue(rowData)
			}
		}
	}, [isModalVisible])

	return (
		<>
			{programID ? (
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

			<Modal
				title={`${programID ? 'Sửa' : 'Tạo'} chương trình học`}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<div className="row">
							<div className="col-md-6 col-12">
								<Form.Item name="GradeID" label="Khối học" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
									<Select
										style={{ width: '100%' }}
										className="style-input"
										showSearch
										placeholder="Chọn khối học"
										optionFilterProp="children"
										onChange={onChangeSelect('GradeID')}
									>
										{dataGrade?.length > 0 ? (
											dataGrade?.map((item: any, index: number) => (
												<Option key={index} value={item.ID}>
													{item.GradeName}
												</Option>
											))
										) : (
											<Option value={'none'}>Không có dữ liệu</Option>
										)}
									</Select>
								</Form.Item>
							</div>

							<div className="col-md-6 col-12">
								<Form.Item name="ProgramCode" label="Mã chương trình học" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
									<Input placeholder="" className="style-input" onChange={(e) => setValue('ProgramCode', e.target.value)} />
								</Form.Item>
							</div>

							<div className="col-md-12 col-12">
								<Form.Item name="ProgramName" label="Tên chương trình học" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
									<Input placeholder="" className="style-input" onChange={(e) => setValue('ProgramName', e.target.value)} />
								</Form.Item>
							</div>

							<div className="col-md-6 col-12">
								<Form.Item name="Type" label="Loại" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
									<Select
										style={{ width: '100%' }}
										className="style-input"
										showSearch
										placeholder="Select..."
										optionFilterProp="children"
										onChange={onChangeSelect('Type')}
									>
										<Option key={1} value={1}>
											Offline
										</Option>
										<Option key={2} value={2}>
											Zoom
										</Option>
										<Option key={3} value={3}>
											Video
										</Option>
										<Option key={4} value={4}>
											1 - 1
										</Option>
									</Select>
								</Form.Item>
							</div>

							<div className="col-md-6 col-12">
								<Form.Item name="Level" label="Level" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
									<InputNumber
										placeholder=""
										className="style-input"
										onChange={(e) => {
											setValue('Level', parsePriceStrToNumber(e))
										}}
									/>
								</Form.Item>
							</div>
							
							<div className="col-12">
								<Form.Item name="Description" label="Mô tả">
									<EditorSimple
										defaultValue=""
										isSimpleTool={true}
										handleChange={(value) => setValue('Description', value)}
										isTranslate={false}
										height={80}
									/>
								</Form.Item>
							</div>
						</div>

						<div className="row ">
							<div className=" col-12 text-center">
								<button type="submit" className="btn btn-primary ">
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

export default ProgramForm

import { Form, Input, InputNumber, Modal, Select, Spin, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { userInformationApi } from '~/apiBase'
import { useWrap } from '~/context/wrap'
import NumberFormat from 'react-number-format'

const StaffSalaryForm = (props) => {
	const { Option } = Select
	const { pageSize, showNoti } = useWrap()
	const [form] = Form.useForm()
	const { handleSubmit, setValue } = useForm()

	const [isModalVisible, setIsModalVisible] = useState(false)
	const [dataStaff, setDataStaff] = useState([])
	const [isLoading, setIsLoading] = useState({ status: '', loading: false })

	const setValueStaff = (value, data) => {
		setValue('UserInformationID', value)
	}

	const onSubmit = handleSubmit((data: any) => {
		let note = form.getFieldValue('Note')

		if (typeof data.Salary == 'string') {
			data.Salary = Number(data.Salary.replace(/\$\s?|(,*)/g, ''))
		}
		if (props.dataStaff && props.dataStaff.length > 0) {
			let res = props._onSubmit({ ...data, Role: 2, Style: 3, Note: !!note ? note : null })
			res.then(function (rs: any) {
				rs && rs.status == 200 && setIsModalVisible(false), form.resetFields()
			})
		} else {
			let res = props._onSubmitStaff({ ...data, Role: 2, Style: 3, Note: !!note ? note : null })
			res.then(function (rs: any) {
				rs && rs.status == 200 && setIsModalVisible(false), form.resetFields()
			})
		}
	})

	const getDataStaff = async () => {
		setIsLoading({ status: 'GET_ALL', loading: true })
		try {
			let res = await userInformationApi.getAllParams({ RoleID: 2, pageSize: 999 })
			res.status == 200 && setDataStaff(res.data.data)
			if (res.status == 204) {
				setDataStaff([])
			}
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setIsLoading({ status: 'GET_ALL', loading: false })
		}
	}

	const getSearchDataStaff = async (name) => {
		setIsLoading({ status: 'GET_ALL', loading: true })
		try {
			let res = await userInformationApi.getName({ pageIndex: 1, pageSize: pageSize, FullNameUnicode: name })
			res.status == 200 && setDataStaff(res.data.data)
			res?.status == 204 && setDataStaff([])
			res.status == 204 && setDataStaff([])
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setIsLoading({ status: 'GET_ALL', loading: false })
		}
	}

	useEffect(() => {
		if (!!isModalVisible) {
			getDataStaff()
			if (props.rowData) {
				Object.keys(props.rowData).forEach(function (key) {
					setValue(key, props.rowData[key])
				})
			}
		}
	}, [isModalVisible])

	// Select search
	function onSearch(val) {
		if (val.length == 0) {
			getDataStaff()
		} else {
			getSearchDataStaff(val)
		}
	}

	useEffect(() => {
		if (props.dataIDStaff && props.dataStaff.length === 1) {
			form.setFieldsValue({
				Staff: props.dataStaff[0].FullNameUnicode
			})
			setValue('UserInformationID', props.dataIDStaff)
		}
	}, [props.dataIDStaff])

	return (
		<>
			{props.showIcon && (
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setIsModalVisible(true)
						props.setUpdateSalary({ type: 'update', SalaryID: props.rowData.SalaryID })
					}}
				>
					<Tooltip title="Cập nhật">
						<i className="fas fa-edit" style={{ color: '#34c4a4', fontSize: 16, marginBottom: -1 }}></i>
					</Tooltip>
				</button>
			)}

			{props.showAdd && (
				<button
					className="btn btn-warning add-new"
					onClick={() => {
						setIsModalVisible(true)
						props.setUpdateSalary({ type: 'add', SalaryID: null })
					}}
				>
					Thêm mới
				</button>
			)}

			<Modal
				title={<>{props.showAdd ? 'Thêm lương nhân viên' : 'Cập nhật lương nhân viên'}</>}
				visible={props.isOpenModalFromOutSide ? props.isOpenModalFromOutSide : isModalVisible}
				onCancel={() => (props.openModalFromOutSide ? props.openModalFromOutSide() : setIsModalVisible(false))}
				footer={null}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<div className="row">
							<div className="col-12">
								{props.showAdd || props.showInTeacherView ? (
									<>
										<Form.Item
											label="Nhân viên"
											name="Staff"
											rules={[{ required: true, message: 'Bạn không được để trống' }]}
											initialValue={props.dataStaff && props.dataStaff.length > 0 && props.dataStaff[0].FullNameUnicode}
										>
											<Select
												className="style-input"
												placeholder="Chọn nhân viên"
												onChange={(value, role) => setValueStaff(value, role)}
												onSearch={onSearch}
												optionFilterProp="children"
												showSearch
												filterOption={(input: any, option: any) =>
													!isLoading.loading && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
												}
											>
												{props.dataStaff && props.dataStaff.length > 0 ? (
													props.dataStaff && (
														<Option value={props.dataStaff[0].UserInformationID}>{props.dataStaff[0].FullNameUnicode}</Option>
													)
												) : isLoading.loading ? (
													<Option value="" className="spin-center">
														<Spin />
													</Option>
												) : (
													dataStaff &&
													dataStaff.map((row) => (
														<Option key={row.UserInformationID} value={row.UserInformationID} role={row.RoleID}>
															{row.FullNameUnicode}
														</Option>
													))
												)}
											</Select>
										</Form.Item>
									</>
								) : (
									<Form.Item required label="Ghi chú" name="Note">
										<Input placeholder="Nhập ghi chú" className="style-input" allowClear={true} />
									</Form.Item>
								)}
							</div>
						</div>

						<div className="row">
							<div className="col-12">
								<Form.Item
									label="Mức Lương"
									name="Salary Const"
									rules={[{ required: true, message: 'Bạn không được để trống' }]}
									initialValue={props.rowData?.Salary}
								>
									<NumberFormat
										placeholder=""
										className="ant-input style-input w-100"
										onChange={(e) => setValue('Salary', e.target.value)}
										thousandSeparator
									/>
								</Form.Item>
							</div>
						</div>

						<div className="row ">
							<div className="col-12">
								<button
									type="submit"
									className="btn btn-primary w-100"
									disabled={props.isLoading.type == 'ADD_DATA' && props.isLoading.status}
								>
									Lưu
									{props.isLoading.type == 'ADD_DATA' && props.isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
}

export default StaffSalaryForm

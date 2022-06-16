import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Modal, Spin, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import InputTextField from '~/components/FormControl/InputTextField'
import SelectField from '~/components/FormControl/SelectField'
import { useWrap } from '~/context/wrap'

let returnSchema = {}
let schema = null

const StudentChangeCourseForm = React.memo((props: any) => {
	const [isModalVisible, setIsModalVisible] = useState(false)
	const { isLoading, rowID, _onSubmit, getIndex, index, rowData, listData } = props

	const { showNoti } = useWrap()

	// -----  HANDLE ALL IN FORM -------------
	const defaultValuesInit = {
		CourseOfStudentID: null, //int ID
		CourseIDAfter: null, //int ID khóa học mới
		Paid: null, //số tiền thanh toán thêm
		Note: null,
		Commitment: null
	}

	;(function returnSchemaFunc() {
		returnSchema = { ...defaultValuesInit }
		Object.keys(returnSchema).forEach(function (key) {
			switch (key) {
				case 'Email':
					returnSchema[key] = yup.string().email('Email nhập sai cú pháp').required('Bạn không được để trống')
					break

				default:
					returnSchema[key] = yup.mixed().required('Bạn không được để trống')
					break
			}
		})

		schema = yup.object().shape(returnSchema)
	})()

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	})

	// SUBMI FORM
	const onSubmit = (data: any, e) => {
		let res = _onSubmit(data)

		res.then(function (rs: any) {
			rs && rs.status == 200 && (setIsModalVisible(false), form.reset(defaultValuesInit))
		})
	}

	useEffect(() => {
		if (isModalVisible) {
			if (rowData) {
				form.reset(rowData)
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
						getIndex(index)
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
				title={rowID ? 'Sửa học viên cần tư vấn' : 'Thêm học viên cần tư vấn'}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="container-fluid">
					<Form layout="vertical" onFinish={form.handleSubmit(onSubmit)}>
						<div className="row">
							<div className="col-12">
								<SelectField form={form} name="AreaID" label="Tỉnh/TP" optionList={listData.Area} />
							</div>
						</div>
						<div className="row">
							<div className="col-md-6 col-12">
								<InputTextField form={form} name="CustomerName" label="Họ tên" />
							</div>
							<div className="col-md-6 col-12">
								<InputTextField form={form} name="Number" label="Số điện thoại" />
							</div>
						</div>
						<div className="row">
							<div className="col-md-6 col-12">
								<InputTextField form={form} name="Email" label="Email" />
							</div>
							<div className="col-md-6 col-12">
								<SelectField form={form} name="SourceInformationID" label="Nguồn khách" optionList={listData.SourceInformation} />
							</div>
						</div>
						<div className="row mt-3">
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

export default StudentChangeCourseForm

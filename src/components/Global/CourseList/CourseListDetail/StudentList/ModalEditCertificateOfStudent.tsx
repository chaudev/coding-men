import { Modal, Tooltip, Form } from 'antd'
import React, { useState, useEffect } from 'react'
import { studentCertificateApi } from '~/apiBase/student-certificate/student-certificate'
import { useWrap } from '~/context/wrap'
import { FormOutlined } from '@ant-design/icons'
import EditorField from '~/components/FormControl/EditorField'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

export default function ModalEditCertificateOfStudent(props) {
	const { data } = props
	const [isVisible, setIsVisible] = useState(false)
	const { showNoti } = useWrap()
	const [loading, setLoading] = useState(false)

	const schema = yup.object().shape({
		Content: yup.string().required('Bạn không được để trống')
	})
	const defaultValuesInit = {
		Content: ''
	}

	useEffect(() => {
		if (data) {
			const { Content } = data
			form.reset({
				Content
			})
		}
	}, [data])

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	})

	const editDegreeForStudent = async (info) => {
		setLoading(true)
		try {
			let res = await studentCertificateApi.update({ ID: data.ID, Content: info.Content })
			if (res.status === 200) {
				showNoti('success', res.data.message)
				setIsVisible(false)
			}
		} catch (error) {
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<Tooltip title="Cập nhật chứng chỉ">
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setIsVisible(true)
					}}
				>
					<FormOutlined />
				</button>
			</Tooltip>
			<Modal
				title={'Cấp chứng chỉ cho học viên'}
				visible={isVisible}
				footer={false}
				onCancel={() => {
					setIsVisible(false)
				}}
				width={1000}
			>
				<Form onFinish={form.handleSubmit(editDegreeForStudent)} layout="vertical">
					<div className="row">
						<div className="col-12">
							<EditorField form={form} name="Content" label="Nội dung" height={400} />
						</div>

						<div className="col-12">
							<button className="btn btn-primary w-100" disabled={loading}>
								Xác nhận
							</button>
						</div>
					</div>
				</Form>
			</Modal>
		</>
	)
}

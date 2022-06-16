import { Modal, Tooltip } from 'antd'
import React, { useState, useEffect } from 'react'
import { studentCertificateApi } from '~/apiBase/student-certificate/student-certificate'
import { useWrap } from '~/context/wrap'

export default function ModalDegreeForStudent(props) {
	const { data } = props
	const [isVisible, setIsVisible] = useState(false)
	const { showNoti } = useWrap()
	const [loading, setLoading] = useState(false)

	const degreeForStudent = async () => {
		setLoading(true)
		try {
			let res = await studentCertificateApi.add({ CourseOfStudentID: data.ID })
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
			<Tooltip title="Cấp chưng chỉ">
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setIsVisible(true)
					}}
				>
					<img src="/images/icons/certificate.svg" />
				</button>
			</Tooltip>
			<Modal
				title={'Cấp chứng chỉ cho học viên'}
				visible={isVisible}
				footer={false}
				onCancel={() => {
					setIsVisible(false)
				}}
			>
				<h4 className="mb-4 text-center">Xác nhận cấp chứng chỉ cho học viên</h4>
				<button className="btn btn-primary w-100" disabled={loading} onClick={() => degreeForStudent()}>
					Xác nhận
				</button>
			</Modal>
		</>
	)
}

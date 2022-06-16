import { Form, Modal, Spin, Tooltip } from 'antd'
import React, { useState } from 'react'
import { teacherSalaryApi } from '~/apiBase/staff-manage/teacher-salary'
import { useWrap } from '~/context/wrap'

const ConfirmForm = ({ record, setParams, params }) => {
	const [isVisible, setIsVisible] = useState(false)
	const [form] = Form.useForm()
	const { showNoti } = useWrap()
	const [submitLoading, setSubmitLoading] = useState({ type: '', loading: false })

	const dataForm = {
		ID: record.ID,
		AdvanceSalary: record.AdvanceSalary,
		Bonus: record.Bonus,
		NoteBonus: record.NoteBonus,
		isClosing: true,
		StatusID: record.StatusID,
		isDonePaid: record.isDonePaid
	}

	const _onSubmit = async () => {
		setSubmitLoading({ type: 'UPLOADING', loading: true })
		try {
			let res = await teacherSalaryApi.update({ ...dataForm, StatusID: record.StatusID == 3 ? 4 : 5 })
			if (res.status == 200) {
				form.resetFields()
				params && setParams({ ...params })
				setIsVisible(false)
			}
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setSubmitLoading({ type: 'UPLOADING', loading: false })
			console.log(dataForm)
		}
	}

	const _getText = () => {
		return record.StatusID == 3 ? 'Xác Nhận Lương Của Bạn Là Chính Xác' : 'Xác Nhận Đã Thanh Toán Lương'
	}

	return (
		<>
			{record.StatusID == 1 && <p className="font-weight-primary">Chưa xác nhận lương</p>}
			{record.StatusID == 3 && (
				<button className="btn btn-icon edit" onClick={() => setIsVisible(true)}>
					<Tooltip title="Cập nhật">
						<i className="fas fa-edit" style={{ color: '#34c4a4', fontSize: 16, marginBottom: -1 }}></i>
					</Tooltip>
				</button>
			)}
			{record.StatusID == 4 && <p className="font-weight-primary">Đã xác nhận</p>}
			{record.StatusID == 5 && <p className="font-weight-primary">Đã nhận lương</p>}
			<Modal centered title={'Xác Nhận Lương'} onCancel={() => setIsVisible(false)} visible={isVisible} footer={false}>
				<Form form={form} layout="vertical" onFinish={_onSubmit}>
					<div className="row">
						<div className="col-12 mb-2 justify-content-center">
							<div className="text-center blue bold" style={{ fontSize: 20 }}>
								{_getText()}
							</div>
						</div>
						<div className="col-12 mt-3">
							<button type="submit" className="btn btn-primary w-100">
								Xác nhận
								{submitLoading.type == 'UPLOADING' && submitLoading.loading && <Spin className="loading-base" />}
							</button>
						</div>
					</div>
				</Form>
			</Modal>
		</>
	)
}
export default ConfirmForm

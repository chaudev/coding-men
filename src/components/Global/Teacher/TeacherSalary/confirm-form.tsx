import { Form, Input, Modal, Select, Spin, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { teacherSalaryApi } from '~/apiBase/staff-manage/teacher-salary'
import { useWrap } from '~/context/wrap'
import { numberWithCommas, parsePriceStrToNumber } from '~/utils/functions'

const { TextArea } = Input
const { Option } = Select

const initDataForm = {
	ID: '',
	AdvanceSalary: '',
	Bonus: '',
	NoteBonus: '',
	isClosing: false,
	StatusID: 0,
	isDonePaid: false
}

const ConfirmForm = ({ record, setParams, params }) => {
	const { showNoti } = useWrap()
	const [form] = Form.useForm()

	const [isVisible, setIsVisible] = useState(false)
	const [submitLoading, setSubmitLoading] = useState({ type: '', loading: false })
	const [dataForm, setDataForm] = useState<any>(initDataForm)
	const [reConfirm, setReConfirm] = useState({ type: false, StatusID: record.StatusID })

	useEffect(() => {
		if (isVisible) {
			setDataForm({
				ID: record.ID,
				AdvanceSalary: record.AdvanceSalary,
				Bonus: record.Bonus,
				NoteBonus: record.NoteBonus,
				isClosing: true,
				StatusID: 3,
				isDonePaid: record.isDonePaid
			})
		}
	}, [isVisible])

	const _onSubmit = async () => {
		setSubmitLoading({ type: 'UPLOADING', loading: true })
		try {
			let res = await teacherSalaryApi.update({ ...dataForm, StatusID: reConfirm.StatusID == 1 ? 3 : reConfirm.StatusID == 3 ? 3 : 5 })
			if (res.status == 200) {
				form.resetFields()
				params && setParams({ ...params })
				setIsVisible(false)
			}
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setSubmitLoading({ type: 'UPLOADING', loading: false })
		}
	}

	const onChangeReConfirm = () => {
		if (reConfirm.StatusID == 3) {
			setReConfirm({ type: false, StatusID: 4 })
		}
		if (reConfirm.StatusID == 4) {
			setReConfirm({ type: true, StatusID: 3 })
		}
	}

	const getStatus = () => {
		let temp = ''
		if (reConfirm?.StatusID == 1 || reConfirm?.StatusID == 3) {
			temp = 'Yêu cầu xác nhận'
		} else if (reConfirm?.StatusID == 4) {
			temp = 'Đã xác nhận'
		} else if (reConfirm?.StatusID == 5) {
			temp = 'Đã thanh toán'
		} else {
			temp = 'Không xác định'
		}
		return temp
	}

	return (
		<>
			{record.StatusID == 5 ? (
				<p className="font-weight-primary">Đã nhận lương</p>
			) : (
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setIsVisible(true)
					}}
				>
					{record.StatusID == 1 && (
						<Tooltip title="Cập nhật lương">
							<i className="fas fa-edit" style={{ color: '#34c4a4', fontSize: 16, marginBottom: -1 }}></i>
						</Tooltip>
					)}
					{record.StatusID == 3 && (
						<Tooltip title="Cập nhật lại lương">
							<i className="fas fa-edit" style={{ color: '#34c4a4', fontSize: 16, marginBottom: -1 }}></i>
						</Tooltip>
					)}
					{record.StatusID == 4 && (
						<Tooltip title="Gửi yêu cầu xác nhận lại">
							<i className="fas fa-edit" style={{ color: '#34c4a4', fontSize: 16, marginBottom: -1 }}></i>
						</Tooltip>
					)}
				</button>
			)}

			<Modal title={'Cập nhật lương'} onCancel={() => setIsVisible(false)} visible={isVisible} footer={false}>
				<Form form={form} layout="vertical" onFinish={_onSubmit}>
					<div className="row">
						{record.StatusID == 4 ? (
							<div className="col-12 mb-3">
								<h4 className="font-weight-primary blue">Xác nhận thanh toán lương cho giáo viên!</h4>
							</div>
						) : (
							<>
								<div className="col-12">
									<Form.Item label="Trừ tạm ứng" name="AdvanceSalary">
										<Input
											onChange={(event) => setDataForm({ ...dataForm, AdvanceSalary: parsePriceStrToNumber(event.target.value) })}
											name="AdvanceSalary"
											placeholder="Trừ  lương tạm ứng"
											className="style-input"
											value={numberWithCommas(dataForm.AdvanceSalary)}
											defaultValue={numberWithCommas(dataForm.AdvanceSalary)}
										/>
									</Form.Item>
								</div>
								<div className="col-12">
									<Form.Item label="Thưởng" name="Bonus">
										<Input
											onChange={(event) => setDataForm({ ...dataForm, Bonus: parsePriceStrToNumber(event.target.value) })}
											name="Bonus"
											placeholder="Thêm tiền thưởng"
											className="style-input"
											value={numberWithCommas(dataForm.Bonus)}
											defaultValue={numberWithCommas(dataForm.Bonus)}
										/>
									</Form.Item>
								</div>
								<div className="col-12">
									<Form.Item label="Ghi Chú " name="NoteBonus">
										<TextArea
											rows={4}
											onChange={(event) => setDataForm({ ...dataForm, NoteBonus: event.target.value })}
											name="NoteBonus"
											placeholder="Thêm ghi chú"
											defaultValue={numberWithCommas(dataForm.NoteBonus)}
										/>
									</Form.Item>
								</div>

								<div className="col-12">
									<Form.Item label="Trạng Thái" name="StatusName">
										<Select disabled={true} className="style-input w-100" defaultValue={getStatus()}>
											<Option value={getStatus()}>{getStatus()}</Option>
										</Select>
									</Form.Item>
								</div>

								<div className="col-12">
									<Form.Item label="Trạng Thái Thanh Toán" name="isDonePaid">
										<Select
											disabled={true}
											className="style-input w-100"
											defaultValue={record?.isDonePaid ? 'Đã Thanh Toán' : 'Chưa Thanh Toán'}
										>
											<Option value={record?.isDonePaid}>{record?.isDonePaid ? 'Đã Thanh Toán' : 'Chưa Thanh Toán'}</Option>
										</Select>
									</Form.Item>
								</div>
							</>
						)}

						{record.StatusID == 4 &&
							(reConfirm.StatusID == 3 ? (
								<div className="col-12 ">
									<a className="font-weight-primary" onClick={onChangeReConfirm}>
										Hủy gửi yêu cầu xác nhận lại
									</a>
								</div>
							) : (
								<div className="col-12 ">
									<a className="font-weight-primary red" onClick={onChangeReConfirm}>
										Gửi yêu cầu xác nhận lại
									</a>
								</div>
							))}
						<div className="col-12 mt-3">
							<button type="submit" className="btn btn-primary w-100">
								Lưu
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

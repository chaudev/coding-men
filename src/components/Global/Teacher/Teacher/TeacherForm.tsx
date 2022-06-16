import { DeploymentUnitOutlined, MailOutlined, WhatsAppOutlined } from '@ant-design/icons'
import { yupResolver } from '@hookform/resolvers/yup'
import { Divider, Form, Modal, Spin, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import UploadFile from '~/components/Elements/UploadFile/UploadFile'
import DateField from '~/components/FormControl/DateField'
import InputPassField from '~/components/FormControl/InputPassField'
import InputPreventText from '~/components/FormControl/InputPreventText'
import InputTextField from '~/components/FormControl/InputTextField'
import SelectField from '~/components/FormControl/SelectField'
import UploadAvatarField from '~/components/FormControl/UploadAvatarField'
import { useWrap } from '~/context/wrap'

const defaultValuesInit = {
	AreaID: null,
	Branch: undefined,
	FullNameUnicode: '',
	ChineseName: '',
	LinkFaceBook: '',
	Jobdate: '',
	Email: '',
	Mobile: '',
	Address: '',
	DistrictID: null,
	WardID: null,
	HouseNumber: '',
	Avatar: '',
	DOB: '',
	Gender: 0,
	CMND: '',
	CMNDDate: '',
	CMNDRegister: '',
	Extension: '',
	StatusID: 1,
	Password: '',
	ContractOfStaff: null,
	DegreeOfStaff: null,
	BankAccountNumber: null,
	BankAccountHolderName: null,
	BankBranch: null,
	UserName: null
}

type ITeacherForm = {
	handleCreateTeacher: Function
	isUpdate: boolean
	handleUpdateTeacher: Function
	updateObj: any
	isLoading: { type: string; status: boolean }
	isClearForm: boolean
	indexUpdateObj: number
	optionGenderList: any
	optionAreaSystemList: { areaList: any; districtList: any; wardList: any }
	handleFetchDistrict: Function
	handleFetchWard: Function
	optionBranchList: any
	handleFetchBranch: Function
}

const optionStatusList = [
	{ title: 'Hoạt động', value: 0 },
	{ title: 'Khóa', value: 1 }
]

const TeacherForm = (props: ITeacherForm) => {
	const { handleCreateTeacher, isClearForm, isUpdate, handleUpdateTeacher } = props
	const { updateObj, isLoading, optionAreaSystemList, handleFetchDistrict, handleFetchWard, indexUpdateObj } = props
	const { optionGenderList, optionBranchList, handleFetchBranch } = props
	const { areaList, districtList, wardList } = optionAreaSystemList
	const [isModalVisible, setIsModalVisible] = useState(false)
	const { userInformation } = useWrap()

	const openModal = () => {
		if (isUpdate && !!updateObj) {
			form.setValue('StatusID', updateObj?.StatusID)
		}

		setIsModalVisible(true)
		if (isUpdate && updateObj && updateObj.AreaID) {
			!!handleFetchBranch && handleFetchBranch(updateObj.AreaID)
			!!handleFetchDistrict && handleFetchDistrict(updateObj.AreaID)
			!!handleFetchWard && updateObj.DistrictID && handleFetchWard(updateObj.DistrictID)
		}
	}

	const closeModal = () => setIsModalVisible(false)

	const schemaBase = yup.object().shape({
		FullNameUnicode: yup.string().required('Bạn không được để trống'),
		Email: yup.string().email('Email không đúng định dạng').required('Bạn không được để trống')
	})

	const schemaUpdate = yup.object().shape({
		DistrictID: yup.number().nullable(),
		WardID: yup.number().nullable(),
		HouseNumber: yup.string().nullable(),
		Avatar: yup.string().nullable(),
		DOB: yup.string().nullable(),
		Gender: yup.number().nullable().oneOf([0, 1, 2]),
		CMND: yup.string().nullable(),
		CMNDDate: yup.string().nullable(),
		CMNDRegister: yup.string().nullable(),
		Extension: yup.string().nullable(),
		StatusID: yup.number().nullable().oneOf([0, 1]),
		Password: yup.string().nullable()
	})

	const schema = isUpdate ? schemaBase.concat(schemaUpdate) : schemaBase

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	})

	// Get file
	const getFile = (file, type) => {
		switch (type) {
			case 'contract':
				form.setValue('ContractOfStaff', file)
				break
			case 'degree':
				form.setValue('DegreeOfStaff', file)
				break
			default:
				break
		}
	}

	useEffect(() => {
		isUpdate && updateObj && form.reset({ ...updateObj, Branch: updateObj.Branch.map((obj) => obj.ID) })
	}, [updateObj])

	useEffect(() => {
		isClearForm && form.reset({ ...defaultValuesInit })
	}, [isClearForm])

	const checkHandleFetchBranch = (value) => {
		if (!handleFetchBranch) return
		form.setValue('DistrictID', null)
		form.setValue('WardID', null)
		handleFetchBranch(value)
	}
	const checkHandleFetchDistrict = (value) => {
		if (!handleFetchDistrict) return
		handleFetchDistrict(value)
	}
	const checkHandleFetchWard = (value) => {
		if (!handleFetchWard) return
		form.setValue('WardID', null)
		handleFetchWard(value)
	}

	const teacherSwitchFunc = (data) => {
		switch (isUpdate) {
			case true:
				if (!handleUpdateTeacher) return
				handleUpdateTeacher(data, indexUpdateObj).then((res) => {
					if (res && res.status === 200) {
						closeModal()
						form.reset()
					}
				})
				break
			case false:
				if (!handleCreateTeacher) return
				handleCreateTeacher(data).then((res) => {
					if (res && res.status === 200) {
						closeModal()
						form.reset()
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
					Thêm mới
				</button>
			)}
			<Modal
				style={{ top: isUpdate ? 20 : 100 }}
				title={isUpdate ? 'Cập nhật giáo viên' : 'Thêm giáo viên'}
				visible={isModalVisible}
				onCancel={closeModal}
				footer={
					isUpdate ? (
						<div className="row">
							<div className="col-12 d-flex justify-content-center">
								<button
									type="submit"
									className="btn btn-primary w-100"
									onClick={form.handleSubmit(teacherSwitchFunc)}
									disabled={isLoading.type == 'ADD_DATA' && isLoading.status}
								>
									Cập nhật
									{isLoading.type === 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					) : null
				}
				className={`${isUpdate && 'modal-scroll'} modal-50`}
			>
				<div className="box-form">
					<Form layout="vertical" onFinish={form.handleSubmit(teacherSwitchFunc)}>
						{isUpdate ? (
							<div className="row">
								<div className="col-12">
									<div className="info-modal">
										<div className="info-modal-avatar">
											<UploadAvatarField style={{ marginBottom: 0 }} form={form} name="Avatar" />
										</div>
										<div className="info-modal-content">
											{isUpdate && (
												<div className="box-info-modal">
													<p className="name">{updateObj.FullNameUnicode}</p>
													<p className="detail">
														<span className="icon role">
															<DeploymentUnitOutlined />
														</span>
														<span className="text">{updateObj.Branch.map((b) => b.BranchName).join(', ')}</span>
													</p>
													<p className="detail">
														<span className="icon mobile">
															<WhatsAppOutlined />
														</span>
														<span className="text">{updateObj.Mobile}</span>
													</p>
													<p className="detail">
														<span className="icon email">
															<MailOutlined />
														</span>
														<span className="text">{updateObj.Email}</span>
													</p>
												</div>
											)}
										</div>
									</div>
								</div>
								<div className="col-12">
									<Divider orientation="center">Thông tin cơ bản</Divider>
								</div>
								<div className="col-12">
									<InputTextField form={form} name="UserName" label="Tên đăng nhập" disabled={true} />
								</div>
								<div className="col-md-6 col-12">
									<InputTextField form={form} name="Email" label="Email" placeholder="Nhập email" isRequired={true} />
								</div>
								<div className="col-md-6 col-12">
									<InputTextField form={form} name="FullNameUnicode" label="Họ và tên" placeholder="Nhập họ và tên" isRequired={true} />
								</div>
								<div className="col-md-6 col-12">
									<InputPreventText form={form} name="Mobile" label="Số điện thoại" placeholder="Nhập số điện thoại" />
								</div>
								<div className="col-md-6 col-12">
									<DateField form={form} name="DOB" label="Ngày sinh" placeholder="Chọn ngày sinh" />
								</div>
								<div className="col-md-6 col-12">
									<InputPreventText form={form} name="CMND" label="Số CMND" placeholder="Nhập số CMND" />
								</div>
								<div className="col-md-6 col-12">
									<InputTextField form={form} name="CMNDRegister" label="Nơi cấp CMND" placeholder="Nhập nơi cấp CMND" />
								</div>
								<div className="col-md-6 col-12">
									<DateField form={form} name="CMNDDate" label="Ngày cấp CMND" placeholder="Chọn ngày cấp CMND" />
								</div>
								<div className="col-md-6 col-12">
									<SelectField form={form} name="Gender" label="Giới tính" optionList={optionGenderList} placeholder="Chọn giới tính" />
								</div>
								<div className="col-md-6 col-12">
									<SelectField
										form={form}
										disabled={userInformation?.RoleID === 1 ? false : true}
										name="StatusID"
										label="Trạng thái hoạt động"
										optionList={optionStatusList}
										placeholder="Chọn trạng thái hoạt động"
									/>
								</div>
								<div className="col-md-6 col-12">
									<InputPassField form={form} name="Password" label="Mật khẩu" placeholder="Nhập mật khẩu" />
								</div>
								<div className="col-12">
									<Divider orientation="center">Địa chỉ</Divider>
								</div>
								<div className="col-md-6 col-12">
									<SelectField
										form={form}
										isRequired={false}
										name="AreaID"
										label="Tỉnh/Thành phố"
										optionList={areaList}
										onChangeSelect={(value) => {
											checkHandleFetchBranch(value)
											checkHandleFetchDistrict(value)
										}}
										placeholder="Chọn tỉnh/thành phố"
									/>
								</div>
								<div className="col-md-6 col-12">
									<SelectField
										form={form}
										name="DistrictID"
										label="Quận/Huyện"
										optionList={districtList}
										onChangeSelect={checkHandleFetchWard}
										isLoading={isLoading.type === 'FETCH_DATA_BY_AREA' && isLoading.status}
										placeholder="Chọn quận/huyện"
									/>
								</div>
								<div className="col-md-6 col-12">
									<SelectField
										form={form}
										name="WardID"
										label="Phường/Xã"
										optionList={wardList}
										isLoading={isLoading.type === 'FETCH_WARD_BY_DISTRICT' && isLoading.status}
										placeholder="Chọn phường/xã"
									/>
								</div>
								<div className="col-md-6 col-12">
									<InputTextField form={form} name="Extension" label="Mô tả thêm" placeholder="Nhập mô tả thêm" />
								</div>
								<div className="col-12">
									<InputTextField form={form} name="HouseNumber" label="Số nhà/Tên đường" placeholder="Nhập số nhà/tên đường" />
								</div>
								<div className="col-12">
									<Divider orientation="center">Khác</Divider>
								</div>
								<div className="col-md-6 col-12">
									<Form.Item label="Hợp đồng">
										<UploadFile getFile={(file) => getFile(file, 'contract')} />
										{updateObj?.ContractOfStaff && (
											<a href={updateObj?.ContractOfStaff} className="link-upload">
												File hợp đồng
											</a>
										)}
									</Form.Item>
								</div>
								<div className="col-md-6 col-12">
									<Form.Item label="Bằng cấp">
										<UploadFile url={updateObj?.DegreeOfStaff} getFile={(file) => getFile(file, 'degree')} />
										{updateObj?.ContractOfStaff && (
											<a href={updateObj?.ContractOfStaff} className="link-upload">
												File hợp đồng
											</a>
										)}
									</Form.Item>
								</div>
								<div className="col-12 mb-4">
									<p className="font-weight-primary" style={{ color: 'red' }}>
										*Lưu ý: Upload tối đa 100Mb
									</p>
								</div>
								<div className="col-md-6 col-12">
									<SelectField
										form={form}
										name="Branch"
										label="Trung tâm"
										mode="multiple"
										optionList={optionBranchList}
										isLoading={isLoading.type === 'FETCH_DATA_BY_AREA' && isLoading.status}
										placeholder="Chọn trung tâm"
									/>
								</div>

								<div className="col-md-6 col-12">
									<DateField isRequired={false} form={form} name="Jobdate" label="Ngày nhận việc" placeholder="Chọn ngày nhận việc" />
								</div>
								<div className="col-md-6 col-12">
									<InputTextField form={form} name="LinkFaceBook" label="Link Facebook" placeholder="Nhập link facebook" />
								</div>
								<div className="col-12">
									<InputTextField form={form} name="Address" label="Địa chỉ" placeholder="Nhập địa chỉ" />
								</div>

								{/** ==== Thông tin ngân hàng  ====*/}
								<div className="col-12">
									<Divider orientation="center">Thông tin ngân hàng</Divider>
								</div>
								<div className="col-md-12 col-12">
									<InputTextField form={form} name="Bank" label="Tên ngân hàng" />
								</div>
								<div className="col-md-6 col-12">
									<InputTextField form={form} name="BankAccountHolderName" label="Tên chủ thẻ" />
								</div>
								<div className="col-md-6 col-12">
									<InputTextField form={form} name="BankAccountNumber" label="Số tài khoản" />
								</div>
								<div className="col-md-12 col-12">
									<InputTextField form={form} name="BankBranch" label="Chi nhánh ngân hàng" />
								</div>
							</div>
						) : (
							<div className="row">
								<div className="col-md-6 col-12">
									<SelectField
										form={form}
										name="AreaID"
										label="Tỉnh/thành phố"
										optionList={areaList}
										onChangeSelect={checkHandleFetchBranch}
										placeholder="Chọn tỉnh/thành phố"
										isRequired={true}
									/>
									<InputTextField form={form} name="FullNameUnicode" label="Họ và tên" placeholder="Nhập họ và tên" isRequired={true} />
									<InputTextField form={form} name="Email" label="Email" placeholder="Nhập email" isRequired={true} />
									<DateField form={form} name="Jobdate" label="Ngày nhận việc" placeholder="Chọn ngày nhận việc" isRequired={true} />
								</div>
								<div className="col-md-6 col-12">
									<SelectField
										form={form}
										name="Branch"
										label="Trung tâm"
										mode="multiple"
										optionList={optionBranchList}
										isLoading={isLoading.type === 'FETCH_DATA_BY_AREA' && isLoading.status}
										placeholder="Chọn trung tâm"
										isRequired={true}
									/>
									<InputPreventText form={form} name="Mobile" label="Số điện thoại" placeholder="Nhập số điện thoại" isRequired={true} />
									<InputTextField form={form} name="LinkFaceBook" label="Link Facebook" placeholder="Nhập link faebook" />
								</div>
								<div className="col-12">
									<InputTextField form={form} name="Address" label="Địa chỉ" placeholder="Nhập địa chỉ" />
								</div>
								<div className="col-md-6 col-12">
									<Form.Item label="Hợp đồng">
										<UploadFile getFile={(file) => getFile(file, 'contract')} />
										{updateObj?.ContractOfStaff && (
											<a href={updateObj?.ContractOfStaff} className="link-upload">
												File hợp đồng
											</a>
										)}
									</Form.Item>
								</div>
								<div className="col-md-6 col-12">
									<Form.Item label="Bằng cấp">
										<UploadFile url={updateObj?.DegreeOfStaff} getFile={(file) => getFile(file, 'degree')} />
										{updateObj?.ContractOfStaff && (
											<a href={updateObj?.ContractOfStaff} className="link-upload">
												File hợp đồng
											</a>
										)}
									</Form.Item>
								</div>{' '}
								<div className="col-12 mb-4">
									<p className="font-weight-primary" style={{ color: 'red' }}>
										*Lưu ý: Upload tối đa 100Mb
									</p>
								</div>
								{/** ==== Thông tin ngân hàng  ====*/}
								<div className="col-12">
									<Divider orientation="center">Thông tin ngân hàng</Divider>
								</div>
								<div className="col-md-12 col-12">
									<InputTextField form={form} name="Bank" label="Tên ngân hàng" />
								</div>
								<div className="col-md-6 col-12">
									<InputTextField form={form} name="BankAccountHolderName" label="Tên chủ thẻ" />
								</div>
								<div className="col-md-6 col-12">
									<InputTextField form={form} name="BankAccountNumber" label="Số tài khoản" />
								</div>
								<div className="col-md-12 col-12">
									<InputTextField form={form} name="BankBranch" label="Chi nhánh ngân hàng" />
								</div>
								<div className="col-12 mt-3">
									<button type="submit" className="btn btn-primary w-100" disabled={isLoading.type === 'ADD_DATA' && isLoading.status}>
										Thêm mới
										{isLoading.type === 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
									</button>
								</div>
							</div>
						)}
					</Form>
				</div>
			</Modal>
		</>
	)
}

TeacherForm.defaultProps = {
	handleCreateTeacher: null,
	isUpdate: false,
	handleUpdateTeacher: null,
	updateObj: {},
	isLoading: { type: '', status: false },
	isClearForm: false,
	indexUpdateObj: -1,
	optionStatusList: [],
	optionGenderList: [],
	optionAreaSystemList: { areaList: [], districtList: [], wardList: [] },
	handleFetchDistrict: null,
	handleFetchWard: null,
	optionBranchList: [],
	handleFetchBranch: null
}

export default TeacherForm

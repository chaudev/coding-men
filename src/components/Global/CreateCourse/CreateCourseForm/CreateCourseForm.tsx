import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Modal, Spin } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { MinusCircle, PlusCircle } from 'react-feather'
import { useFieldArray, useForm } from 'react-hook-form'
import * as yup from 'yup'
import DateField from '~/components/FormControl/DateField'
import InputMoneyField from '~/components/FormControl/InputMoneyField'
import InputTextField from '~/components/FormControl/InputTextField'
import SelectField from '~/components/FormControl/SelectField'
import { useWrap } from '~/context/wrap'
import { numberWithCommas } from '~/utils/functions'
import { optionCommonPropTypes } from '~/utils/proptypes'

const CreateCourseOfflineForm = (props) => {
	const {
		isUpdate,
		isLoading,
		optionListForForm,
		handleGetCourse,
		handleFetchProgramByGrade,
		handleGetValueBeforeFetchCurriculum,
		handleGetValueBeforeFetchTeacher
	} = props
	const [isModalVisible, setIsModalVisible] = useState(false)
	const openModal = () => setIsModalVisible(true)
	const { userInformation } = useWrap()
	const closeModal = () => {
		setIsModalVisible(false)
		//form.reset()
	}

	const schema = yup.object().shape({
		BranchID: yup.number().nullable().required('Bạn không được để trống'),
		GradeID: yup.number().nullable().required('Bạn không được để trống'),
		ProgramID: yup.number().nullable().required('Bạn không được để trống'),
		TeacherID: yup.number().nullable().required('Bạn không được để trống'),
		CurriculumID: yup.number().nullable().required('Bạn không được để trống'),
		StartDay: yup.string().required('Bạn không được để trống'),
		Price: yup.string().nullable().required('Bạn không được để trống'),
		CourseName: yup.string(),
		TimeCourse: yup.array().of(
			yup.object().shape({
				DaySelected: yup.number().nullable().required('Bạn không được để trống'),
				StudyTimeID: yup.number().nullable().required('Bạn không được để trống')
			})
		)
	})
	const defaultValuesInit = {
		BranchID: null,
		GradeID: null,
		ProgramID: null,
		TeacherID: null,
		CurriculumID: null,
		StartDay: moment().format('YYYY/MM/DD'),
		Price: '',
		CourseName: '',
		TimeCourse: [{ DaySelected: null, StudyTimeID: null }]
	}

	useEffect(() => {
		if (optionListForForm && optionListForForm.teacherList.length === 1) {
			form.setValue('TeacherID', optionListForForm.teacherList[0].value)
		} else {
			form.setValue('TeacherID', null)
		}
	}, [optionListForForm])

	const form = useForm<ICOCreateForm>({ defaultValues: defaultValuesInit, resolver: yupResolver(schema) })
	const { fields, append, remove } = useFieldArray({ control: form.control, name: 'TimeCourse' })

	const createCourseSwitchFunc = async (data: any) => {
		switch (isUpdate) {
			case false:
				if (!handleGetCourse) return
				const res: any = await handleGetCourse(data)
				if (res) {
					closeModal()
					// form.reset({ ...defaultValuesInit })
				}
				break
			default:
				break
		}
	}
	// ONCHANGE OF GRADE FIELD
	const checkHandleFetchProgramByGrade = async (value) => {
		if (!handleFetchProgramByGrade) return
		form.setValue('ProgramID', undefined)
		var data = await handleFetchProgramByGrade(value)
	}
	// ONCHANGE STUDY TIME AND PROGRAM
	const checkHandleGetValueBeforeFetchCurriculum = (key: string, value: number) => {
		if (!handleGetValueBeforeFetchCurriculum) return
		form.setValue('CurriculumID', undefined)
		handleGetValueBeforeFetchCurriculum(key, value)
	}
	// ONCHANGE Curriculum AND BRANCH
	const checkHandleGetValueBeforeFetchTeacher = (key: string, value: number) => {
		if (!handleGetValueBeforeFetchTeacher) return
		form.setValue('TeacherID', undefined)
		handleGetValueBeforeFetchTeacher(key, value)
	}

	return (
		<>
			<button type="button" className="btn btn-warning" onClick={openModal}>
				Thêm khóa học tự động
			</button>
			<Modal style={{ top: 25 }} title="Thông tin khóa học mới" visible={isModalVisible} footer={null} width={800} onCancel={closeModal}>
				<div className="wrap-form">
					<Form layout="vertical" onFinish={form.handleSubmit(createCourseSwitchFunc)}>
						<div className="row">
							<div className="col-12">
								<SelectField
									form={form}
									name="BranchID"
									label="Trung Tâm"
									placeholder="Chọn trung tâm"
									isRequired
									optionList={optionListForForm.branchList}
									isLoading={isLoading.type === 'FETCH_DATA' && isLoading.status}
									onChangeSelect={(value) => checkHandleGetValueBeforeFetchTeacher('BranchID', value)}
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="GradeID"
									label="Khối học"
									isRequired
									placeholder="Chọn khối học"
									isLoading={isLoading.type === 'FETCH_DATA' && isLoading.status}
									optionList={optionListForForm.gradeList}
									onChangeSelect={checkHandleFetchProgramByGrade}
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="RoomID"
									mode={'multiple'}
									label="Phòng học"
									isRequired
									placeholder="Chọn phòng học"
									isLoading={isLoading.type === 'RoomID' && isLoading.status}
									optionList={optionListForForm.roomList}
								/>
							</div>

							<div className="col-12">
								<div className="more-revenue">
									<PlusCircle
										size="20px"
										className="add"
										onClick={() => append({ DaySelected: null, StudyTimeID: null })}
										style={{ right: 0 }}
									/>
									<Form.Item label="Khung thời gian" required>
										<div className="more-revenue-list" style={{ maxHeight: 'inherit' }}>
											{fields.map((item, index) => {
												const timeCourse = form.watch('TimeCourse')
												const disabledDaySelectedList = timeCourse.map((obj) => obj.DaySelected).filter(Boolean)
												const time =
													timeCourse[0]?.StudyTimeID &&
													optionListForForm.studyTimeList.find((opt) => opt.value === timeCourse[0]?.StudyTimeID)?.options.Time
												let disabledStudyTimeList =
													time && timeCourse.length >= 2
														? optionListForForm.studyTimeList.filter((opt) => opt.options.Time !== time).map((opt) => opt.value)
														: []
												let tempTimes = optionListForForm.studyTimeList
												if (timeCourse.length > 1) {
													for (let i = 0; i < timeCourse.length; i++) {
														if (i !== index) {
															if (timeCourse[i]?.DaySelected === timeCourse[index]?.DaySelected) {
																let timeIndex = tempTimes.findIndex((e: any) => e.value == timeCourse[i]?.StudyTimeID)
																let temp = []
																if (timeIndex !== -1) {
																	for (let j = 0; j < tempTimes.length; j++) {
																		const x: any = parseInt(tempTimes[timeIndex].options.TimeEnd.replace(':', ''))
																		const y: any = parseInt(tempTimes[j].options.TimeStart.replace(':', ''))

																		const z: any = parseInt(tempTimes[timeIndex].options.TimeStart.replace(':', ''))
																		const t: any = parseInt(tempTimes[j].options.TimeEnd.replace(':', ''))
																		if (x > y && z < t) {
																			temp.push(tempTimes[j].value)
																		}
																	}
																}
																disabledStudyTimeList = [...disabledStudyTimeList, timeCourse[i]?.StudyTimeID, ...temp]
															}
														}
													}
												}

												return (
													<div className="more-revenue-item" key={item.id}>
														<div className="row">
															<div className="col-md-6 col-12">
																<SelectField
																	form={form}
																	name={`TimeCourse.${index}.DaySelected`}
																	isRequired
																	label="Thứ"
																	placeholder="Chọn thứ"
																	optionList={optionListForForm.dayOfWeek}
																	// optionDisabledList={disabledDaySelectedList}
																	isDynamicField
																/>
															</div>

															<div className="col-md-6 col-12">
																<SelectField
																	form={form}
																	name={`TimeCourse.${index}.StudyTimeID`}
																	isRequired
																	label="Ca"
																	placeholder="Chọn ca học"
																	isLoading={isLoading.type === 'FETCH_DATA' && isLoading.status}
																	optionList={optionListForForm.studyTimeList}
																	onChangeSelect={(value) => checkHandleGetValueBeforeFetchCurriculum('StudyTimeID', value)}
																	optionDisabledList={disabledStudyTimeList}
																	isDynamicField
																/>
															</div>
														</div>
														<MinusCircle size="20px" className="remove" onClick={() => remove(index)} />
													</div>
												)
											})}
										</div>
									</Form.Item>
								</div>
							</div>

							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="ProgramID"
									isRequired
									label="Chương trình học"
									isLoading={isLoading.type === 'GradeID' && isLoading.status}
									placeholder="Chọn chương trình học"
									optionList={optionListForForm.programList}
									onChangeSelect={(value) => {
										console.log(optionListForForm.programList)
										const price = 0 //optionListForForm.programList.find((p) => p.value === value)?.options.Price || 0
										form.setValue('Price', numberWithCommas(price))
										checkHandleGetValueBeforeFetchCurriculum('ProgramID', value)
									}}
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="CurriculumID"
									label="Giáo trình"
									isRequired
									isLoading={isLoading.type === 'ProgramID' && isLoading.status}
									placeholder="Chọn giáo trình"
									optionList={optionListForForm.curriculumList}
									onChangeSelect={(value) => {
										checkHandleGetValueBeforeFetchTeacher('ProgramID', value)
									}}
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									disabled={userInformation && userInformation.RoleID === 2}
									name="TeacherID"
									label="Giáo viên"
									isRequired
									isLoading={isLoading.type === 'ProgramID' && isLoading.status}
									placeholder="Chọn giáo viên"
									optionList={optionListForForm.teacherList}
								/>
							</div>
							<div className="col-md-6 col-12">
								<InputMoneyField form={form} name="SalaryOfLesson" label="Lương/buổi" isRequired placeholder="Nhập lương/buổi học" />
							</div>
							<div className="col-md-6 col-12">
								<DateField form={form} name="StartDay" label="Ngày mở" isRequired placeholder="Chọn ngày mở" />
							</div>
							<div className="col-md-6 col-12">
								<InputMoneyField form={form} name="Price" label="Giá khóa học" placeholder="Nhập giá khóa học" isRequired />
							</div>
							<div className="col-6">
								<InputTextField
									form={form}
									name="MaximumStudent"
									label="Số học viên tối đa (mặc định 20)"
									placeholder="Nhập số học viên tối đa trong lớp"
								/>
							</div>
							<div className="col-12">
								<InputTextField
									form={form}
									name="CourseName"
									label="Tên khóa học"
									placeholder="[Trung tâm][Chương trình học][Giáo trình][Ca học] - Ngày học"
								/>
							</div>
							<div className="col-md-12 col-12 mt-3 " style={{ textAlign: 'center' }}>
								<button type="submit" className="btn btn-primary" disabled={isLoading.type == 'ADD_DATA' && isLoading.status}>
									Thêm Vào Lịch
									{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
}
CreateCourseOfflineForm.propTypes = {
	isUpdate: PropTypes.bool,
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	optionListForForm: PropTypes.shape({
		branchList: optionCommonPropTypes,
		studyTimeList: optionCommonPropTypes,
		gradeList: optionCommonPropTypes,
		programList: optionCommonPropTypes,
		teacherList: optionCommonPropTypes,
		dayOfWeek: optionCommonPropTypes,
		curriculumList: optionCommonPropTypes,
		userInformationList: optionCommonPropTypes
	}),
	handleGetCourse: PropTypes.func,
	handleFetchDataByBranch: PropTypes.func,
	handleFetchProgramByGrade: PropTypes.func,
	handleGetValueBeforeFetchCurriculum: PropTypes.func,
	handleGetValueBeforeFetchTeacher: PropTypes.func
}
CreateCourseOfflineForm.defaultProps = {
	isUpdate: false,
	isLoading: { type: '', status: false },
	optionListForForm: {
		branchList: [],
		studyTimeList: [],
		gradeList: [],
		programList: [],
		teacherList: [],
		dayOfWeek: [],
		curriculumList: [],
		userInformationList: []
	},
	handleGetCourse: null,
	handleFetchDataByBranch: null,
	handleFetchProgramByGrade: null,
	handleGetValueBeforeFetchCurriculum: null,
	handleGetValueBeforeFetchTeacher: null
}
export default CreateCourseOfflineForm

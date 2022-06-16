import { Form } from 'antd'
import React, { useEffect, useState } from 'react'
import { exerciseGroupApi } from '~/apiBase/'
import EditorSimple from '~/components/Elements/EditorSimple'
import UploadAudio from '~/components/Elements/UploadAudio'
import { useWrap } from '~/context/wrap'

const GroupForm = (props) => {
	const { isSubmit, questionData, changeIsSubmit, visible, changeData } = props
	const { showNoti } = useWrap()
	const [form] = Form.useForm()
	const [questionDataForm, setQuestionDataForm] = useState<any>(questionData)
	const [isResetEditor, setIsResetEditor] = useState<boolean>(false)
	const [loadAtFirst, setLoadAtFirst] = useState<boolean>(true)

	// GET INTRODUCE EDITOR
	const getIntroduceEditor = (dataEditor: any) => {
		if (questionDataForm) {
			questionDataForm.Introduce = dataEditor
		}
		setQuestionDataForm({ ...questionDataForm })
	}

	// GET VALUE IN EDITOR
	const getDataEditor = (dataEditor: any) => {
		if (questionDataForm) {
			questionDataForm.Content = dataEditor
		}
		setQuestionDataForm({ ...questionDataForm })
	}

	// Reset value in form
	const resetForm = () => {
		questionDataForm.Content = ''
		questionDataForm.Introduce = ''
		questionDataForm.ExerciseAnswer.forEach((item: any) => {
			item.AnswerContent = ''
			item.isTrue = false
		})
		setQuestionDataForm({ ...questionDataForm })
	}

	// SUBMIT FORM
	const handleSubmitQuestion = async () => {
		let res: any = null
		let newData: any = {
			Content: questionDataForm.Content,
			CurriculumID: questionData.CurriculumID,
			Level: questionData.Level,
			Type: questionData.Type,
			LinkAudio: questionDataForm.LinkAudio,
			Introduce: questionDataForm.Introduce,
			SkillID: questionData.SkillID
		}
		try {
			if (questionDataForm.ID) {
				res = await exerciseGroupApi.update({
					...newData,
					ID: questionDataForm.ID
				})
			} else {
				res = await exerciseGroupApi.add(newData)
			}
			if (res.status == 200) {
				changeIsSubmit(questionDataForm.ID ? questionDataForm : res.data.data)
				showNoti('success', `${questionDataForm.ID ? 'Cập nhật' : 'Thêm'} Thành công`)
				if (!questionDataForm.ID) {
					resetForm()
				}
				setIsResetEditor(true)
				setTimeout(() => {
					setIsResetEditor(false)
				}, 500)
			}
		} catch (error) {}
	}

	useEffect(() => {
		!!isSubmit && handleSubmitQuestion()
	}, [isSubmit])

	useEffect(() => {
		if (visible) {
			if (!questionData.ID) {
				questionData.Content = ''
				questionData.Introduce = ''
				questionData.LinkAudio = ''
			}
			setQuestionDataForm(questionData)
		} else {
			setQuestionDataForm(null)
			setLoadAtFirst(true)
		}
	}, [visible])

	useEffect(() => {
		if (questionDataForm) {
			if (!loadAtFirst) {
				if (questionDataForm.Content !== '' || questionDataForm.Introduce !== '' || questionDataForm.LinkAudio !== '') {
					changeData && changeData()
				}
			}
			setLoadAtFirst(false)
		}
	}, [questionDataForm])

	return (
		<div className="form-create-question">
			{visible && questionDataForm && (
				<Form form={form} layout="vertical" onFinish={handleSubmitQuestion}>
					<div className="container-fluid">
						<div className="row">
							<div className="col-12">
								<Form.Item name="Introduce" label="Giới thiệu">
									<EditorSimple
										handleChange={(value: any) => getIntroduceEditor(value)}
										isReset={isResetEditor}
										questionContent={questionDataForm?.Introduce}
										questionData={questionDataForm}
									/>
								</Form.Item>
								<Form.Item name="Content" label="Nội dung">
									<EditorSimple
										isTranslate={true}
										handleChange={(value: any) => getDataEditor(value)}
										isReset={isResetEditor}
										questionContent={questionDataForm?.Content}
										questionData={questionDataForm}
									/>
								</Form.Item>
								<Form.Item label="Tải lên link Audio">
									<UploadAudio
										getFile={(file: any) => {
											questionDataForm.LinkAudio = file
											setQuestionDataForm({ ...questionDataForm })
										}}
										valueFile={questionDataForm?.LinkAudio}
									/>
								</Form.Item>
								<div className="mb-4">
									<p className="font-weight-primary" style={{ color: 'red' }}>
										*Lưu ý: Upload tối đa 100Mb
									</p>
								</div>
							</div>
						</div>
					</div>
				</Form>
			)}
		</div>
	)
}

export default GroupForm

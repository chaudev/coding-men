import { Form } from 'antd'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { exerciseApi } from '~/apiBase/'
import EditorSimple from '~/components/Elements/EditorSimple'
import { useWrap } from '~/context/wrap'

let AnsID = 0

const WrittingForm = (props) => {
	const { isSubmit, questionData, changeIsSubmit, visible, changeData, isGroup } = props
	const { showNoti } = useWrap()
	const {
		reset,
		register,
		handleSubmit,
		control,
		setValue,
		formState: { isSubmitting, errors, isSubmitted }
	} = useForm()
	const [form] = Form.useForm()
	const [questionDataForm, setQuestionDataForm] = useState(null)
	const [isResetEditor, setIsResetEditor] = useState(false)
	const [answerList, setAnswerList] = useState(questionData.ExerciseAnswer)
	const [loadAtFirst, setLoadAtFirst] = useState(true)

	// SUBMI FORM
	const onSubmit = handleSubmit((data: any, e) => {
		console.log('DATA SUBMIT: ', data)
	})

	// GET VALUE IN EDITOR
	const getDataEditor = (dataEditor) => {
		if (questionDataForm) {
			questionDataForm.Content = dataEditor
		}
		setQuestionDataForm({ ...questionDataForm })
	}

	const getDescribeAnswer = (dataEditor) => {
		if (questionDataForm) {
			questionDataForm.DescribeAnswer = dataEditor
		}
		setQuestionDataForm({ ...questionDataForm })
	}

	// Reset value in form
	const resetForm = () => {
		questionDataForm.Content = ''
		questionDataForm.ExerciseAnswer = []
		setQuestionDataForm({ ...questionDataForm })
	}

	// SUBMIT FORM
	const handleSubmitQuestion = async () => {
		let res = null

		try {
			if (questionDataForm.ID) {
				let cloneData = JSON.parse(JSON.stringify(questionDataForm))

				cloneData.ExerciseAnswer.forEach((item, index) => {
					if (item.isAdd) {
						delete item.ID
					}
				})
				res = await exerciseApi.update(cloneData)
			} else {
				res = await exerciseApi.add(questionDataForm)
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
		isSubmit && handleSubmitQuestion()
	}, [isSubmit])

	useEffect(() => {
		if (visible) {
			if (!questionData.ID) {
				questionData.Content = ''
			}
			setQuestionDataForm({ ...questionData })
		} else {
			setQuestionDataForm(null)
			setLoadAtFirst(true)
		}
	}, [visible])

	useEffect(() => {
		if (questionDataForm) {
			if (!loadAtFirst) {
				changeData && changeData()
			}
			setLoadAtFirst(false)
		}
	}, [questionDataForm])

	return (
		<div className="form-create-question">
			{visible && questionDataForm && (
				<Form form={form} layout="vertical" onFinish={onSubmit}>
					<div className="container-fluid">
						<div className="row">
							<div className="col-12">
								<Form.Item name="Question" label="Câu hỏi">
									<EditorSimple
										isTranslate={true}
										handleChange={(value) => getDataEditor(value)}
										isReset={isResetEditor}
										questionContent={questionDataForm?.Content}
										questionData={questionDataForm}
									/>
								</Form.Item>
							</div>
							{/* <div className="col-12">
                <Form.Item label="File nghe">
                  <UploadAudio
                    getFile={(file) => {
                      questionDataForm.LinkAudio = file;
                      setQuestionDataForm({ ...questionDataForm });
                    }}
                    valueFile={questionDataForm?.LinkAudio}
                  />
                </Form.Item>
              </div> */}

							{!isGroup?.status && (
								<Form.Item label="Giải thích đáp án" name="DescribeAnswer">
									<EditorSimple handleChange={(value: any) => getDescribeAnswer(value)} />
								</Form.Item>
							)}
						</div>
					</div>
				</Form>
			)}
		</div>
	)
}

export default WrittingForm

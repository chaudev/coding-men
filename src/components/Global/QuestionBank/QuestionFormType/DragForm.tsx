import React, { useEffect, useState } from 'react'
import { useWrap } from '~/context/wrap'
import { Form, Spin, Checkbox, Input, Tooltip } from 'antd'
import Editor from '~/components/Elements/Editor'
import { exerciseGroupApi } from '~/apiBase/'
import { CloseOutlined } from '@ant-design/icons'
import { Plus } from 'react-feather'
import EditorSimple from '~/components/Elements/EditorSimple'

let AnsID = 0

const DragForm = (props: any) => {
	const { questionData, changeIsSubmit, visible, onChange, isGroup } = props
	const { showNoti } = useWrap()
	const [form] = Form.useForm()
	const [question, setQuestion] = useState<any>(null) // Dữ liệu câu hỏi + câu trả lời
	const [loading, setLoading] = useState<any>(true)
	const [dataExercise, setDataExercise] = useState<any>([])

	// VỪA VÔ LẤY DỮ LIỆU
	useEffect(() => {
		visible ? dataGroupDetail() : setLoading(true)
	}, [visible])

	useEffect(() => {
		onChange(question)
	}, [question])

	// GET GROUP DETAIL DATA
	const dataGroupDetail = async () => {
		changeIsSubmit(true)
		try {
			let res: any = await exerciseGroupApi.getWithID(questionData.ID ? questionData.ID : questionData.ExerciseGroupID)
			res.status == 200 && setQuestion(res.data.data)
			res.status == 204 && showNoti('danger', 'Không có dữ liệu')
		} catch (error) {
			showNoti('danger', error?.message)
		} finally {
			setLoading(false)
		}
	}

	const setDataEditor = (e: any) => {
		setQuestion({ ...question, Paragraph: e })
		onChange({ ...question, Paragraph: e })
	}

	const getDescribeAnswer = (dataEditor) => {
		setQuestion({ ...question, DescribeAnswer: dataEditor })
		onChange({ ...question, DescribeAnswer: dataEditor })
	}

	// HANDLE ADD QUESTION
	const addQuestion = (p: any) => {
		AnsID++
		let exerciseList: any = question?.ExerciseList
		let tempData: any = dataExercise
		let temp: any = {
			inputID: p,
			Content: '',
			ExerciseGroupID: question.ID,
			SubjectID: question.SubjectID,
			SubjectName: question.SubjectName,
			DescribeAnswer: '',
			Level: question.Level,
			LevelName: question.LevelName,
			LinkAudio: null,
			Type: question.Type,
			TypeName: question.TypeName,
			isAdd: true,
			Enable: true,
			ExerciseAnswer: [
				{
					ID: AnsID,
					AnswerContent: '',
					isTrue: true,
					Enable: true,
					isAdd: true
				}
			]
		}
		tempData.push(temp)
		exerciseList.push(temp)
		setDataExercise(tempData)
		setQuestion({ ...question, ExerciseList: exerciseList })
		onChange({ ...question, ExerciseList: exerciseList })
	}

	// HANDLE DELETE QUESTION
	const deleteSingleQuestion = (ID: any) => {
		let questionIndex: any = question.ExerciseList.findIndex((item: any) => item.inputID == ID) // Lấy vị trí của cái ID truyền vào
		let exerciseIndex: any = dataExercise.findIndex((item: any) => item.inputID == ID)
		// Xóa bên Ex nếu nó khác -1
		if (dataExercise[exerciseIndex]) {
			dataExercise.splice(exerciseIndex, 1)
		}
		// Xóa bên Quest nếu nó khác -1
		if (question.ExerciseList[questionIndex]) {
			if (question.ExerciseList[questionIndex].isAdd) {
				question.ExerciseList.splice(questionIndex, 1)
			} else {
				question.ExerciseList[questionIndex].Enable = false
			}
		} else {
			console.log('Câu hỏi không tồn tại')
		}
		setDataExercise([...dataExercise])
		setQuestion({ ...question })
		onChange({ ...question })
	}

	// HANDLE DELETE ALL QUESTION
	const deleteAllQuestion = () => {
		dataExercise?.splice(0, dataExercise.length) // Xóa tất cả tụi bên Ex
		question.ExerciseList.forEach((item: any) => {
			item.Enable = false // Xóa tất cả tụi bên này - gọi vậy để xóa trên data
		})
		setDataExercise([...dataExercise])
		setQuestion({ ...question, Paragraph: '' })
		onChange({ ...question, Paragraph: '' })
	}

	// Lấy cái số hiện ra bên câu trả lời
	const getQuestIndex = (ar: any, i: any) => {
		let temp: any = []
		for (let i = 0; i < ar.length; i++) {
			ar[i].Enable && temp.push(ar[i])
		}
		return parseInt(temp.indexOf(i)) + 1
	}

	// HANDLE ADD ANSWER
	const handleAddAnswer = (ID: number) => {
		AnsID++
		question.ExerciseList.every((item: any) => {
			if (item.inputID == ID) {
				item.ExerciseAnswer.push({
					ID: AnsID,
					AnswerContent: '',
					isTrue: true,
					Enable: true,
					isAdd: true
				})
				return false
			}
			return true
		})
		setQuestion({ ...question })
	}

	// ON CHANGE TEXT
	const onChange_text = (e: any, AnswerID: number, QuestionID: any) => {
		let QuestionIndex: any = question?.ExerciseList?.findIndex((item: any) => item.Enable && item.inputID == QuestionID) // Get question index
		let AnswerIndex: any = question.ExerciseList[QuestionIndex].ExerciseAnswer.findIndex((item: any) => item.Enable && item.ID == AnswerID) // Get answer index
		question.ExerciseList[QuestionIndex].ExerciseAnswer[AnswerIndex].AnswerContent = e.target.value // Add text
		setQuestion({ ...question })
	}

	// DELETE ANSWER
	const deleteAnswerItem = (AnswerID: number, QuestionID: number) => {
		let QuestionIndex: any = question.ExerciseList.findIndex((item: any) => item.inputID == QuestionID) // - Get question index
		let AnswerIndex: any = question.ExerciseList[QuestionIndex].ExerciseAnswer.findIndex((item: any) => item.ID == AnswerID) // - Get answer index

		// Action delete
		if (question.ExerciseList[QuestionIndex].ExerciseAnswer[AnswerIndex].isAdd) {
			question.ExerciseList[QuestionIndex].ExerciseAnswer.splice(AnswerIndex, 1)
		} else {
			question.ExerciseList[QuestionIndex].ExerciseAnswer[AnswerIndex].Enable = false
		}
		setQuestion({ ...question })
	}

	const onChange_isCorrect = (e: any, AnswerID: any, QuestionID: any) => {
		let checked: any = e.target.checked
		let QuestionIndex: any = question?.ExerciseList?.findIndex((item: any) => item.inputID == QuestionID)
		let AnswerIndex: any = question.ExerciseList[QuestionIndex].ExerciseAnswer.findIndex((item: any) => item.ID == AnswerID)
		question.ExerciseList[QuestionIndex].ExerciseAnswer.forEach((item: any) => {
			item.isTrue = false
		})
		question.ExerciseList[QuestionIndex].ExerciseAnswer[AnswerIndex].isTrue = checked
		setQuestion({ ...question })
	}

	return (
		<div className="form-create-question">
			{visible && loading ? (
				<div className="w-100 text-center mt-3">
					<Spin />
				</div>
			) : (
				visible && (
					<Form form={form} layout="vertical" onFinish={() => {}}>
						<div className="container-fluid">
							<div className="row">
								<div className="col-md-6 col-12">
									<Form.Item name="Question" label="Nội dung">
										<Editor
											exerciseList={dataExercise}
											deleteAllQuestion={deleteAllQuestion}
											deleteSingleQuestion={(quesID: number) => deleteSingleQuestion(quesID)}
											handleChange={(value: string) => setDataEditor(value)}
											questionContent={question?.Paragraph} // Câu hỏi được truyền vô
											questionData={question}
											addQuestion={(inputID: any) => addQuestion(inputID)}
											visible={visible}
										/>
									</Form.Item>
								</div>
								<div className="col-md-6 col-12" style={{ borderLeft: '2px dotted #dbdbdb' }}>
									<p className="style-label" style={{ textDecoration: 'underline' }}>
										Đáp án
									</p>
									{question?.ExerciseList?.map(
										(itemQues: any, index: any) =>
											itemQues.Enable && (
												<div key={index} className="question-item-group">
													<p className="" style={{ fontWeight: 500, color: '#525252' }}>
														Câu: {getQuestIndex(question.ExerciseList, itemQues)}
													</p>
													<Tooltip title="Thêm đáp án">
														<button className="btn-add-answer" onClick={() => handleAddAnswer(itemQues.inputID)}>
															<Plus />
														</button>
													</Tooltip>
													<div className="row">
														{itemQues.ExerciseAnswer?.map(
															(itemAns: any, index: any) =>
																itemAns.Enable && (
																	<div className="col-md-6 col-12" key={index}>
																		<div className="row-ans mt-3">
																			<Checkbox
																				checked={itemAns.isTrue}
																				onChange={(e: any) => onChange_isCorrect(e, itemAns.ID, itemQues.inputID)}
																			/>
																			<Form.Item className="mb-0">
																				<Input
																					value={itemAns.AnswerContent}
																					className="style-input"
																					onChange={(e: any) => onChange_text(e, itemAns.ID, itemQues.inputID)}
																				/>
																			</Form.Item>
																			<button className="delete-ans" onClick={() => deleteAnswerItem(itemAns.ID, itemQues.inputID)}>
																				<CloseOutlined />
																			</button>
																		</div>
																	</div>
																)
														)}
													</div>
												</div>
											)
									)}
								</div>
								{!isGroup?.status && (
									<Form.Item label="Giải thích đáp án" name="DescribeAnswer">
										<EditorSimple handleChange={(value: any) => getDescribeAnswer(value)} />
									</Form.Item>
								)}
							</div>
						</div>
					</Form>
				)
			)}
		</div>
	)
}

export default DragForm

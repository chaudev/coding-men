import React, { useEffect, useState } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { useDoingTest } from '~/context/useDoingTest'
import { useDoneTest } from '~/context/useDoneTest'

const TypingList = (props: any) => {
	const { doneTestData } = useDoneTest()
	const { dataQuestion, listQuestionID, isDoingTest } = props
	const { activeID, getActiveID, packageResult, getPackageResult, getListPicked, removeListPicked } = useDoingTest()
	const [listInput, setListInput] = useState([])
	const [listCorrectAnswer, setListCorrectAnswer] = useState([])
	const [isActive, setIsActive] = useState(null)
	const [loadFirst, setLoadFirst] = useState(false)

	useEffect(() => {
		if (dataQuestion.Paragraph !== '') {
			let spaceEditor: any = document.querySelectorAll('.box-typing .space-editor')

			if (spaceEditor && spaceEditor.length > 0) {
				spaceEditor.forEach((item: any, index: any) => {
					let quesID: any = parseInt(item.getAttribute('ques-id'))

					// Sắp xếp lại thứ tự các ô input trong đoạn văn
					let indexQues: any = null

					if (listQuestionID.includes(quesID)) {
						indexQues = listQuestionID.indexOf(quesID)
					}

					if (!!indexQues) {
						let positionSpace: any = document.querySelectorAll('.box-typing .position-space')

						if (positionSpace.length < spaceEditor.length) {
							let span = document.createElement('span')
							span.classList.add('position-space')
							span.id = quesID.toString()
							if (quesID === activeID) {
								span.classList.add('active')
							}

							// span.append(`(${indexQues + 1})`)

							item.innerHTML = ''
							item.before(span)
						}
					}
				})
			}
		}
	}, [listQuestionID])

	// ----------- ALL ACTION IN DOINGTEST -------------
	const returnPosition = (quesID) => {
		let text = ''
		let indexQuestion = listQuestionID.findIndex((id) => id === quesID)
		text = (indexQuestion + 1).toString()
		return text
	}

	const handleChangeText = (text: any, quesID: any) => {
		// Find index
		let indexQuestion = packageResult.SetPackageResultDetailInfoList.findIndex((item) => item.ExamTopicDetailID === dataQuestion.ID)
		let indexQuestionDetail = packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList.findIndex(
			(item) => item.ExerciseID === quesID
		)
		indexQuestionDetail === -1 && (indexQuestionDetail = 0)
		// Add new answer to list - Kiểm tra xem mảng có data chưa, nếu chưa thì thêm mới, ngược lại thì cập nhật object
		// Đối với loại Điền từ thì mảng chỉ có 1 object đáp án
		if (
			packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[indexQuestionDetail]
				.SetPackageExerciseAnswerStudentList.length == 0
		) {
			packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[
				indexQuestionDetail
			].SetPackageExerciseAnswerStudentList.push({
				AnswerID: 0,
				AnswerContent: text,
				FileAudio: ''
			})
		} else {
			packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[
				indexQuestionDetail
			].SetPackageExerciseAnswerStudentList[0].AnswerContent = text
		}
		getPackageResult({ ...packageResult })
	}

	useEffect(() => {
		if (!doneTestData) {
			if (isDoingTest) {
				if (dataQuestion.Paragraph !== '') {
					let spaceEditor = document.querySelectorAll('.doingtest-group .box-typing .space-editor')
					if (!!spaceEditor && spaceEditor.length > 0) {
						spaceEditor.forEach((item: any, index: any) => {
							let quesID: any = parseInt(item.getAttribute('ques-id'))

							// Trường hợp điền từ xong một lát quay lại vẫn còn
							let indexQuestion = packageResult.SetPackageResultDetailInfoList.findIndex(
								(item: any) => item.ExamTopicDetailID === dataQuestion.ID
							)

							let indexQuestionDetail: any = packageResult.SetPackageResultDetailInfoList[
								indexQuestion
							].SetPackageExerciseStudentInfoList.findIndex((item: any) => item.ExerciseID === quesID)
							indexQuestionDetail === -1 && (indexQuestionDetail = 0)
							if (
								packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[indexQuestionDetail]
									.SetPackageExerciseAnswerStudentList.length > 0
							) {
								if (!loadFirst) {
									item.value =
										packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[
											indexQuestionDetail
										].SetPackageExerciseAnswerStudentList[0].AnswerContent
									setLoadFirst(true)
								} else {
									if (activeID === isActive) {
										item.value =
											packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[
												indexQuestionDetail
											].SetPackageExerciseAnswerStudentList[0].AnswerContent
									}
								}
								if (
									!!packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[indexQuestionDetail]
										.SetPackageExerciseAnswerStudentList[0].AnswerContent
								) {
									item.classList.add('auto')
									item.setAttribute(
										'size',
										packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[indexQuestionDetail]
											.SetPackageExerciseAnswerStudentList[0].AnswerContent.length
									)
								}
							}

							//Tìm và active đúng ô input
							item.classList.remove('active-type-input')
							if (quesID === activeID) {
								item.classList.add('active-type-input')
							}
						})
					}
				}
			}
		} else {
			if (dataQuestion.Paragraph !== '') {
				let spaceEditor = document.querySelectorAll('.box-typing  .space-editor')
				spaceEditor.forEach((item) => {
					let quesID = parseInt(item.getAttribute('ques-id'))
					dataQuestion.ExerciseTopic.every((ques) => {
						if (ques.ExerciseID === quesID) {
							// Check this answer is right or wrong
							if (ques.isTrue) {
								item.classList.add('right-answer')
							} else {
								item.classList.add('wrong-answer')
							}
							const newItem = document.createElement('DIV')
							newItem.className = item.className
							item.parentNode.replaceChild(newItem, item)
							// Find answer content of user
							if (ques.ExerciseAnswer.length > 0) {
								if (ques.ExerciseAnswer[0].AnswerContent && ques.ExerciseAnswer[0].AnswerContent !== '') {
									newItem.innerHTML = ques.ExerciseAnswer[0].AnswerContent
								} else {
									newItem.classList.add('center-row')
								}
								// Tạo đáp án đúng để hover
								let getNodes = (str) => new DOMParser().parseFromString(str, 'text/html').body.childNodes
								let node = getNodes(`<div class="tooltip-answer" id="${quesID}">${ques.ExerciseAnswer[0].ExerciseAnswerContent}</div>`)
								newItem.appendChild(node[0])
								listCorrectAnswer.push({
									id: ques.ExerciseAnswer[0].ExerciseAnswerID,
									content: ques.ExerciseAnswer[0].ExerciseAnswerContent
								})
							}
							return false
						}
						return true
					})
					setListCorrectAnswer([...listCorrectAnswer])
				})
			}
		}

		if (doneTestData || isDoingTest) {
			// -- Sắp xếp lại vị trí
			let positionSpace = document.querySelectorAll('.position-space')
			positionSpace.forEach((item) => {
				item.classList.remove('active')
				if (parseInt(item.id) === activeID) {
					item.classList.add('active')
				}
			})
		}
	}, [activeID])

	useEffect(() => {
		if (doneTestData) {
			if (listCorrectAnswer.length > 0) {
				let spaceEditor = document.querySelectorAll('.test-wrapper .box-typing .space-editor')
				let tooltipAns = document.querySelectorAll('.test-wrapper .box-typing .tooltip-answer')
				spaceEditor.forEach((item) => {
					// Mouse over
					item.addEventListener('mouseover', (event: MouseEvent) => {
						let quesID = item.getAttribute('ques-id')
						tooltipAns.forEach((e) => {
							if (e.id === quesID) {
								e.classList.remove('d-none')
								e.classList.add('d-block')
							}
						})
					})
					// Mouse out
					item.addEventListener('mouseout', () => {
						let quesID = item.getAttribute('ques-id')
						tooltipAns.forEach((e) => {
							if (e.id === quesID) {
								e.classList.remove('d-block')
								e.classList.add('d-none')
							}
						})
					})
				})
			}
		}
	}, [listCorrectAnswer])

	useEffect(() => {
		if (!doneTestData) {
			let el = document.querySelectorAll('.doingtest-group .box-typing .space-editor')
			el.forEach((item: any) => {
				listInput.push(item.value)
				let quesID = parseInt(item.getAttribute('ques-id'))
				item.addEventListener('click', (event) => {
					event.preventDefault()
					getActiveID(quesID)
					setIsActive(quesID)
				})
				item.addEventListener('keyup', (event: any) => {
					const input = event.target
					handleChangeText(input.value, quesID)
					// Điều kiện đề input co giãn theo text
					let lengthText = input?.value?.length || 0
					if (lengthText > 14) {
						item.classList.add('auto')
						item.setAttribute('size', lengthText)
					} else {
						item.classList.remove('auto')
						item.setAttribute('size', 14)
						if (lengthText < 1) {
							removeListPicked(quesID)
						} else {
							getListPicked(quesID)
						}
					}
				})
			})
			setListInput([...listInput])
		}
	}, [])

	// Thay thẻ div = input
	const convertHTML = () => {
		if (dataQuestion?.ExerciseTopic.length > 0) {
			let cloneValueEditor = dataQuestion.Paragraph
			const divCont = document.createElement('DIV')
			divCont.innerHTML = cloneValueEditor
			const inputNodeList = divCont.querySelectorAll('input')

			dataQuestion.ExerciseTopic.forEach((item: any, index: any) => {
				let indexInput: any = parseInt(item.ExerciseID) + 1
				let temp: any = index + 1
				indexInput = indexInput.toString()
				inputNodeList[index]?.setAttribute('placeholder', `(${returnPosition(item.ExerciseID)})`)
				inputNodeList[index]?.setAttribute('ques-id', `${item.ExerciseID}`)
			})
			return divCont.innerHTML
		}
	}

	return (
		<>
			<div className="">{ReactHtmlParser(dataQuestion.Content)}</div>

			<div className="box-typing col-lg-6 col-md-12 mt-5" style={{ marginLeft: -15 }}>
				{ReactHtmlParser(convertHTML())}
			</div>

			{doneTestData && (
				<>
					<div className="wrap-list-answer-typing mt-4">
						<h6 className="mb-2">Đáp án</h6>
						<ul className="list-answer-typing w-100  pl-0">
							{dataQuestion?.ExerciseTopic.map(
								(item) =>
									item.ExerciseAnswer.length > 0 && (
										<li className="answer-item">
											<span className="number">{returnPosition(item.ExerciseID)}/</span>
											<span className="text">{item.ExerciseAnswer[0].ExerciseAnswerContent}</span>
										</li>
									)
							)}
						</ul>
					</div>
				</>
			)}
		</>
	)
}

export default TypingList

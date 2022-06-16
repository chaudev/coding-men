import React, { useState, useEffect } from 'react'
import { useDoingTest } from '~/context/useDoingTest'
import ReactHtmlParser from 'react-html-parser'
import { useDoneTest } from '~/context/useDoneTest'

let activeDrag = null

const DragList = (props: any) => {
	const { activeID, getActiveID, packageResult, getPackageResult, getListPicked, removeListPicked } = useDoingTest()
	const { dataQuestion, listQuestionID, isDoingTest, setChild, openPagi, isTeach } = props
	const { doneTestData } = useDoneTest()
	const [dataQuestionClone, setDataQuestionClone] = useState(dataQuestion)
	const [dataAnswer, setDataAnswer] = useState([])
	const [listCorrectAnswer, setListCorrectAnswer] = useState([])
	const [isDrop, setIsDrop] = useState(false)

	if (isDoingTest) {
		var indexQuestion: any = packageResult.SetPackageResultDetailInfoList.findIndex(
			(item: any) => item.ExamTopicDetailID === dataQuestion.ID
		)
	}

	useEffect(() => {
		if (dataQuestion.Paragraph !== '') {
			let spaceEditor: any = document.querySelectorAll('.drag-list .space-editor')
			if (spaceEditor && spaceEditor.length > 0) {
				spaceEditor.forEach((item: any, index: any) => {
					let quesID: any = parseInt(item.getAttribute('ques-id'))
					// Sắp xếp lại thứ tự các ô input trong đoạn văn
					let indexQues: any = null
					if (listQuestionID.includes(quesID)) {
						indexQues = listQuestionID.indexOf(quesID)
					}
					if (indexQues !== null) {
						let positionSpace: any = document.querySelectorAll('.drag-list .position-space')
						if (positionSpace.length < spaceEditor.length) {
							let span: any = document.createElement('span')
							span.classList.add('position-space')
							span.id = quesID.toString()
							if (quesID === activeID) {
								span.classList.add('active')
							}
							span.append(`(${indexQues + 1})`)
							item.innerHTML = `${(indexQues + 1).toString()}`
							item.before(span)
						} else {
							if (item.innerHTML == '') {
								item.innerHTML = `${(indexQues + 1).toString()}`
							}
						}
					}
				})
			}
		}
	}, [listQuestionID, dataAnswer])

	// ---- ALL ACTION IN DOING TEST ----

	// On Drop
	const drop = (ev: any) => {
		ev.preventDefault()
		var data: any = ev.dataTransfer.getData('text')
		data && ev.target.appendChild(document.getElementById(data))
		let nodeList: any = [...ev.target.childNodes]
		nodeList.forEach((item: any) => {
			dataAnswer.every((element: any) => {
				if (element.ansID === parseInt(item.id)) {
					// Xử lí mảng dataAnswer
					element.ansID = null
					element.html = null
					element.text = null
					setDataAnswer([...dataAnswer])
					// Xử lí package
					let indexQuestionDetail: any = packageResult.SetPackageResultDetailInfoList[
						indexQuestion
					].SetPackageExerciseStudentInfoList.findIndex((e: any) => e.ExerciseID === element.quesID)
					indexQuestionDetail === -1 && (indexQuestionDetail = 0)
					packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[
						indexQuestionDetail
					].SetPackageExerciseAnswerStudentList = []
					getPackageResult({ ...packageResult })

					return false
				}
				return true
			})
		})
	}

	// Allow Drop
	const allowDrop = (ev: any) => {
		ev.preventDefault()
	}

	// On Drag
	const drag = (ev: any) => {
		ev.dataTransfer.setData('text', ev.target.id)
	}

	// -- ACTION DROP AND DRAG
	useEffect(() => {
		if (!doneTestData) {
			if (isDoingTest) {
				let el: any = document.querySelectorAll('.doingtest-group .drag-list .space-editor')
				el.forEach((item) => {
					const quesID: any = parseInt(item.getAttribute('ques-id'))
					dataAnswer.push({ quesID: quesID, ansID: null, html: null, text: null })
					item.addEventListener('dragleave', (event: any) => {
						item.classList.remove('space-left')
						item.classList.remove('is-hover')
					})
					// ==================== DRAGOVER  ==============
					item.addEventListener('dragover', (event: any) => {
						const input: any = event.target as HTMLElement
						event.preventDefault()
						input.classList.add('is-hover')
						// -- Đầy thành phần drop qua 1 bên khi có hành động drop khác
						if (item.childNodes.length > 0) {
							if (item.childNodes[0].nodeName === 'DIV') {
								item.classList.add('space-left')
							}
						}
					})
					// ======================= DROP=========================
					item.addEventListener(
						'drop',
						(
							ev: CustomEvent & {
								dataTransfer?: DataTransfer
							} = new CustomEvent(null, { bubbles: true, cancelable: true })
						) => {
							// -- Thêm class auto và xóa khoảng cách sau khi đã drop xong
							item.classList.add('auto')
							item.classList.remove('space-left')
							item.classList.remove('is-hover')
							// Active input
							getActiveID(parseInt(item.getAttribute('ques-id')))
							// Đổi trạng thái để useeffect chứa active không chạy lại nữa
							setIsDrop(true)

							const actionDragAndDrop = () => {
								// -- Khởi tạo và xóa bên trong trước khi drop
								const input: any = ev.target as HTMLElement
								input.innerHTML = ''
								ev.preventDefault()
								var data: any = ev.dataTransfer.getData('text')

								input.appendChild(document.getElementById(data))
								// Kiểm tra sau khi drop thành công thì add vào mảng
								if (input.childNodes[0].nodeName === 'DIV') {
									let indexQues: any = dataAnswer.findIndex((item) => item.quesID === quesID)
									// -- Chặn drop thành phần bên trong
									input.childNodes[0].addEventListener('drop', (e) => {
										e.preventDefault(), e.stopPropagation()
									})
									input.childNodes[0].addEventListener(
										'dragstart',
										(
											e: CustomEvent & {
												dataTransfer?: DataTransfer
											} = new CustomEvent(null, {
												bubbles: true,
												cancelable: true
											})
										) => {
											const inputChild: any = e.target as HTMLElement
											activeDrag = inputChild.id
										}
									)
									// -- Kiểm tra phần tử drop xuất phát từ vùng nào
									if (dataAnswer.some((e: any) => e['ansID'] === parseInt(input.children[0].id))) {
										let iQuestion: any = dataAnswer.findIndex((e: any) => e.quesID === quesID)
										dataAnswer.every((element) => {
											if (element.ansID === parseInt(input.children[0].id)) {
												element.html = dataAnswer[iQuestion].html
												element.ansID = dataAnswer[iQuestion].ansID
												element.text = dataAnswer[iQuestion].text
												return false
											}
											return true
										})
									} else {
										// -- Thay thế cái mới và trả về vùng chứa câu trả lời
										if (dataAnswer[indexQues].html && dataAnswer[indexQues].ansID) {
											let getNodes: any = (str: any) => new DOMParser().parseFromString(str, 'text/html').body.childNodes
											let node: any = getNodes(dataAnswer[indexQues].html)
											document.getElementById('area-drop').appendChild(node[0])
										}
									}
									// -- Add phần tử mới vào mảng
									dataAnswer[indexQues].ansID = parseInt(input.children[0].id)
									dataAnswer[indexQues].html = input.innerHTML
									dataAnswer[indexQues].text = input.children[0].children[0].innerHTML
									setDataAnswer([...dataAnswer])
								}
							}
							if (item.children.length == 0) {
								actionDragAndDrop()
							} else {
								if (item.children[0].nodeName === 'TEXT') {
									actionDragAndDrop()
								} else {
									if (item.children[0].id !== activeDrag) {
										actionDragAndDrop()
									}
								}
							}
						}
					)
				})
				setDataAnswer([...dataAnswer])
			}
		}
	}, [])

	// -- UPDATE AFTER DROP AND DRAG
	useEffect(() => {
		if (!doneTestData) {
			if (isDoingTest) {
				if (dataAnswer?.length > 0) {
					let spaceEditor: any = document.querySelectorAll('.drag-list .space-editor')
					let boxAns: any = document.querySelectorAll('.drag-list .drag-list-answer')
					spaceEditor.forEach((item: any) => {
						const quesID: any = parseInt(item.getAttribute('ques-id'))
						let indexQuestionDetail: any = packageResult.SetPackageResultDetailInfoList[
							indexQuestion
						].SetPackageExerciseStudentInfoList.findIndex((e: any) => e.ExerciseID === quesID)
						indexQuestionDetail === -1 && (indexQuestionDetail = 0)
						// --- Kiểm tra nếu có thành phần drop thì thêm class auto và ngược lại
						if (item.childNodes.length > 0) {
							if (item.childNodes[0].nodeName === 'DIV') {
								item.classList.add('auto')
							} else {
								item.classList.remove('auto')
							}
						} else {
							item.classList.remove('auto')
						}
						// --- Sắp xếp lại  vị trí ---
						let indexQues: any = null
						if (listQuestionID.includes(quesID)) {
							indexQues = listQuestionID.indexOf(quesID)
						}
						// --- --------------- ---
						let indexFind: any = dataAnswer.findIndex((item: any) => item.quesID === quesID)
						indexFind === -1 && (indexFind = 0)
						if (dataAnswer[indexFind]?.ansID == null) {
							if (
								packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[indexQuestionDetail]
									.SetPackageExerciseAnswerStudentList.length < 1
							) {
								item.innerHTML = `(${(indexQues + 1).toString()})`
							}
						} else {
							if (item.childNodes.length == 0) {
								let getNodes = (str: any) => new DOMParser().parseFromString(str, 'text/html').body.childNodes
								let node: any = getNodes(dataAnswer[indexFind].html)
								item.appendChild(node[0])
								item.classList.add('auto')
							}
						}
						const checkAndReplace = () => {
							dataAnswer.forEach((ans: any, index: any) => {
								if (quesID === ans.quesID) {
									if (ans.ansID !== null) {
										// -- TRẢ VỀ KQ CŨ
										let getNodes = (str: any) => new DOMParser().parseFromString(str, 'text/html').body.childNodes
										let node: any = getNodes(
											`<div class="drag-list-answer" draggable="true" id="${ans.ansID}"><span>${ans.text}</span></div>`
										)
										item.innerHTML = ''
										item.appendChild(node[0])
										item.classList.add('auto')
									}
								}
							})
						}
						if (item.children.length == 0) {
							checkAndReplace()
						} else {
							if (item.children[0].nodeName !== 'DIV') {
								checkAndReplace()
							}
						}
					})
					boxAns.forEach((item: any) => {
						item.addEventListener(
							'dragstart',
							(
								ev: CustomEvent & {
									dataTransfer?: DataTransfer
								} = new CustomEvent(null, { bubbles: true, cancelable: true })
							) => {
								ev.dataTransfer.setData('text', item.id)
							}
						)
						// -- Chặn drop thành phần bên trong
						item.addEventListener('drop', (e: any) => {
							e.preventDefault(), e.stopPropagation()
						})
					})

					// -- ADD VÀO MẢNG --
					dataAnswer.forEach((item: any) => {
						if (item.ansID) {
							let indexQuestionDetail = packageResult.SetPackageResultDetailInfoList[
								indexQuestion
							].SetPackageExerciseStudentInfoList.findIndex((e: any) => e.ExerciseID === item.quesID)
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
									AnswerID: item.ansID,
									AnswerContent: item.text,
									FileAudio: ''
								})
							} else {
								packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[
									indexQuestionDetail
								].SetPackageExerciseAnswerStudentList[0].AnswerContent = item.text
								packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[
									indexQuestionDetail
								].SetPackageExerciseAnswerStudentList[0].AnswerID = item.ansID
							}
							getListPicked(item.quesID)
							getPackageResult({ ...packageResult })
						} else {
							removeListPicked(item.quesID)
						}
					})
				}
			}
		}
	}, [dataAnswer])

	// Hiện lại những câu đã trả lời sau khi quay lai
	useEffect(() => {
		if (!doneTestData) {
			if (isDoingTest && !isDrop) {
				if (dataQuestion.Paragraph !== '') {
					let spaceEditor: any = document.querySelectorAll('.drag-list .space-editor')
					let dragAns: any = document.querySelectorAll('.drag-list #area-drop .drag-list-answer')
					// -- Kiểm tra các ô drop
					spaceEditor.forEach((item: any, index: any) => {
						let quesID: any = parseInt(item.getAttribute('ques-id'))
						const checkAllElement = () => {
							let indexQuestionDetail: any = packageResult.SetPackageResultDetailInfoList[
								indexQuestion
							].SetPackageExerciseStudentInfoList.findIndex((item) => item.ExerciseID === quesID)
							indexQuestionDetail === -1 && (indexQuestionDetail = 0)
							let indexDataAnswer: any = dataAnswer.findIndex((item) => item.quesID === quesID)
							if (
								packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[indexQuestionDetail]
									.SetPackageExerciseAnswerStudentList.length > 0
							) {
								let AnsIDPackage: any = null
								let AnsContentPackage: any = null

								if (dataAnswer[indexDataAnswer].ansID) {
									AnsIDPackage = dataAnswer[indexDataAnswer].ansID
									AnsContentPackage = dataAnswer[indexDataAnswer].text
								} else {
									AnsIDPackage =
										packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[indexQuestionDetail]
											.SetPackageExerciseAnswerStudentList[0].AnswerID
									AnsContentPackage =
										packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[indexQuestionDetail]
											.SetPackageExerciseAnswerStudentList[0].AnswerContent
								}
								// -- TRẢ VỀ KQ CŨ
								let getNodes = (str: any) => new DOMParser().parseFromString(str, 'text/html').body.childNodes
								let node: any = getNodes(
									`<div class="drag-list-answer" draggable="true" id="${AnsIDPackage}"><span>${AnsContentPackage}</span></div>`
								)
								item.innerHTML = ''
								item.appendChild(node[0])
								// -- Cập nhật Data Answer
								dataAnswer.every((element: any) => {
									if (element.quesID === quesID) {
										element.ansID = AnsIDPackage
										element.text = AnsContentPackage
										element.html = `<div class="drag-list-answer" draggable="true" id="${AnsIDPackage}"><span>${AnsContentPackage}</span></div>`
										return false
									}
									return true
								})
								setDataAnswer([...dataAnswer])
								// -- XÓA TRONG AREA-DROP
								dragAns.forEach((element: any) => {
									if (parseInt(element.id) === AnsIDPackage) {
										element.remove()
									}
								})
							}
							// -- Reset data
							setDataQuestionClone({ ...dataQuestionClone })
							setChild({ ...dataQuestionClone })
						}
						if (item.children.length == 0) {
							checkAllElement()
						} else {
							if (item.children[0].nodeName !== 'DIV') {
								checkAllElement()
							}
						}
					})
				}
			}
		} else {
			if (dataQuestion.Paragraph !== '') {
				let spaceEditor: any = document.querySelectorAll('.drag-list .space-editor')
				spaceEditor.forEach((item: any) => {
					item.setAttribute('contenteditable', 'false')
					let quesID: any = parseInt(item.getAttribute('ques-id'))
					dataQuestion.ExerciseTopic.every((ques) => {
						if (ques.ExerciseID === quesID) {
							// Check this answer is right or wrong
							if (ques.isTrue) {
								item.classList.add('right-answer')
							} else {
								item.classList.add('wrong-answer')
							}
							// Find answer content of user
							if (ques.ExerciseAnswer.length > 0) {
								let getNodes = (str: any) => new DOMParser().parseFromString(str, 'text/html').body.childNodes
								if (ques.ExerciseAnswer[0].AnswerContent && ques.ExerciseAnswer[0].AnswerContent !== '') {
									item.classList.add('auto')
									item.innerHTML = ''
									let nodeYourAns: any = getNodes(
										`<div class="drag-list-answer" id="${ques.ExerciseAnswer[0].AnswerID}"><span>${ques.ExerciseAnswer[0].AnswerContent}</span></div>`
									)
									item.appendChild(nodeYourAns[0])
								}
								// Tạo đáp án đúng để hover
								let nodeCorrectAns: any = getNodes(
									`<div class="tooltip-answer" id="${quesID}">${ques.ExerciseAnswer[0].ExerciseAnswerContent}</div>`
								)
								item.appendChild(nodeCorrectAns[0])
								listCorrectAnswer.push({
									id: ques.ExerciseAnswer[0].ExerciseAnswerID,
									content: ques.ExerciseAnswer[0].ExerciseAnswerContent
								})
								setListCorrectAnswer([...listCorrectAnswer])
							}
							return false
						}
						return true
					})
				})
			}
		}
		if (doneTestData || isDoingTest) {
			// -- Sắp xếp lại vị trí
			let positionSpace: any = document.querySelectorAll('.position-space')
			positionSpace.forEach((item: any) => {
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
				let spaceEditor = document.querySelectorAll('.test-wrapper .drag-list .space-editor')
				let tooltipAns = document.querySelectorAll('.test-wrapper .drag-list .tooltip-answer')
				spaceEditor.forEach((item: any) => {
					// Mouse over
					item.addEventListener('mouseover', () => {
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
	const convertHTML = () => {
		if (dataQuestion?.ExerciseTopic.length > 0) {
			let cloneValueEditor = dataQuestion.Paragraph
			const divCont = document.createElement('DIV')
			divCont.innerHTML = cloneValueEditor
			const inputNodeList = divCont.querySelectorAll('input')
			if (inputNodeList.length > 0) {
				dataQuestion.ExerciseTopic.forEach((item: any, index: any) => {
					const newItem = document.createElement('DIV')
					newItem.className = inputNodeList[index].className
					inputNodeList[index].parentNode.replaceChild(newItem, inputNodeList[index])
					newItem.setAttribute('ques-id', `${item.ExerciseID}`)
				})
			}

			return divCont.innerHTML
		}
	}
	return (
		<div className="drag-list" style={{ height: '100%', marginLeft: !!isTeach ? 0 : -40 }}>
			<div className="wrap-drag">
				<div className="main-drag test-body">
					<div className="">{ReactHtmlParser(dataQuestion.Content)}</div>
					<h6 className="font-italic mb-3 mt-4">Kéo đáp án vào ô thích hợp</h6>
					<div className="col-lg-6 col-md-12 col-sm-12 col-12" style={{}}>
						{ReactHtmlParser(convertHTML())}
					</div>
				</div>
				{!openPagi && !isTeach && (
					<div className="fixed-ans" style={{ marginBottom: !!isTeach ? 70 : 0 }}>
						<div className="answerlist" id="area-drop" onDrop={(e: any) => drop(e)} onDragOver={(e) => allowDrop(e)}>
							{dataQuestionClone?.ExerciseTopic.map((item: any, index: any) =>
								item.ExerciseAnswer.map((ans: any, indexAns: any) => (
									<div
										className="drag-list-answer"
										key={indexAns}
										draggable="true"
										onDrop={(e: any) => (e.preventDefault(), e.stopPropagation())}
										onDragStart={(e: any) => drag(e)}
										id={ans.ID}
									>
										<span>{ans.AnswerContent}</span>
									</div>
								))
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default DragList

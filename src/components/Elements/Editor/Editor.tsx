import { BorderOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Input, Modal } from 'antd'
import 'bootstrap/js/src/dropdown'
import 'bootstrap/js/src/modal'
import 'bootstrap/js/src/tooltip'
import React, { useEffect, useRef, useState } from 'react'
import ReactHtmlParser from 'react-html-parser'
import ReactSummernote from 'react-summernote'
import 'react-summernote/dist/react-summernote.css'
import { studentApi } from '~/apiBase'
import { useWrap } from '~/context/wrap'

type dataTranslate = Array<{
	noteID: number
	textSelect: string
	textTranslate: string
}>

const EditorSummernote = (props) => {
	const { getDataEditor, isReset, questionContent, addQuestion, deleteSingleQuestion, deleteAllQuestion, questionData } = props
	const { showNoti } = useWrap()
	const editorRef = useRef<any>(null)
	const inputModalRef = useRef<any>(null)
	const [valueEditor, setValueEditor] = useState<any>(questionContent)
	// -- For translate --
	const [textSelect, setTextSelect] = useState<any>(null)
	const [textTranslate, setTextTranslate] = useState<any>(null)
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
	const [dataTranslate, setDataTranslate] = useState<dataTranslate>([])
	const [isAddTranslate, setIsAddTranslate] = useState<boolean>(false)

	useEffect(() => {
		if (questionData?.ExerciseList) {
			getCurrentQuestion()
		}
	}, [])

	// ON CHANGE
	const onChange = async (content: any) => {
		let temp: string = await convertTextChange(content) // Cái bùa này ép editor nó nhận "<" với ">"
		const res: any = await formatText(temp) // Cái này để khi xóa câu hỏi hay thêm tào lao thì nó sắp xếp lại FICA
		// Do Stuff:: Rewrite input index
		let inputs = editorRef.current?.noteEditable?.find('input.space-editor')
		Array.from(inputs).forEach((element: HTMLElement, index: number) => {
			element.setAttribute('placeholder', `(${index + 1})`)
			element.setAttribute('id', `${index}`)
		})
		// Do Stuff:: maping input with External Question
		let currentInputIDArray = Array.from(inputs).map((element: HTMLElement) => element.id)
		let diffIDArray = Array.from(questionData?.ExerciseList).filter((item: any) => !currentInputIDArray.includes(item.inputID.toString()))
		diffIDArray.forEach((item: any) => {
			!!deleteSingleQuestion && deleteSingleQuestion(item.inputID)
		})
		// Do Stuff:: làm qq gi do chưa check
		let tagRT = document.querySelectorAll('.note-editable ruby')
		// let tagP = document.querySelectorAll('.note-editable p')
		if (tagRT.length > 0) {
			tagRT.forEach((item: any, index) => {
				const hasNote = item.contains(item.querySelector('rt'))
				if (!hasNote) {
					item.replaceWith(...item.childNodes)
				}
			})
		}
		getDataEditor(res)
	}

	// Click thêm input
	const handleAddSpace = () => {
		// Do Stuff 1:: create Input ID
		let inputs = editorRef.current?.noteEditable?.find('input.space-editor')
		let inputID: any = inputs.length || 0
		// Do Stuff 2:: create Input Element
		const tempNode = document.createElement('input')
		tempNode.setAttribute('id', inputID)
		tempNode.classList.add('space-editor')
		tempNode.setAttribute('placeholder', `(${inputID + 1})`)
		// Do Stuff final
		editorRef.current.insertNode(tempNode)
		addQuestion(inputID)
	}

	const getCurrentQuestion = () => {
		let temp: any = []
		for (let i = 0; i < questionData?.ExerciseList.length; i++) {
			temp.push(parseInt(questionData?.ExerciseList[i]?.inputID))
		}
	}

	// BY CHAU
	const convertTextChange = (e: string) => {
		let temp: string = e
		e.includes('&lt;') && (temp = temp.replace('&lt;', '<'))
		e.includes('&gt;') && (temp = temp.replace('&gt;', '>'))
		return temp
	}

	// KHI MÀ "valueEditor" THAY ĐỔI THÌ CHẠY VÔ ĐÂY
	const formatText = async (e: any) => {
		let newText: any = ''
		let current: number = 0
		// <input id="0" class="space-editor" placeholder="(1)">
		for (let i = 0; i < e.length; i++) {
			if (e[i - 1] == '"' && e[i - 2] == '=' && e[i - 6] == 't' && e[i - 7] == 'u') {
				// Nếu nó là cái "input"
				newText = newText + current
				current++
			} else {
				if (e[i - 1] == '(' && e[i - 2] == '"' && e[i - 3] == '=' && e[i - 4] == 'r' && e[i - 5] == 'e') {
					// Nếu nó là cái "placeholder"
					newText = newText + current
				} else {
					// Nếu nó không là gì hết
					newText = newText + e[i]
				}
			}
		}
		return newText
	}

	// UPLOAD IMAGES
	const onImageUpload = async (fileList: any) => {
		showNoti('warning', 'Đang tải hình ảnh lên..')
		try {
			let res: any = await studentApi.uploadImage(fileList[0])
			res.status == 200 && ReactSummernote.insertImage(res.data.data)
		} catch (error) {
			showNoti('danger', 'Không thể tải hình ảnh lên')
		}
	}

	// Xóa tất cả câu hỏi
	useEffect(() => {
		editorRef.current?.isEmpty() && deleteAllQuestion()
	}, [editorRef.current?.isEmpty()])

	// ------------------------------------------------------------------------------------------------------
	// Phần dưới này dành cho cái phiên âm
	// Fucking this for translate
	const showModal = (type: any) => {
		setIsModalVisible(true)
		const { noteEditable: currentContent, editor: currentEditor } = editorRef.current
		const selectionRange = currentEditor.summernote('createRange')
		setTextSelect(selectionRange)
		setTimeout(() => {
			inputModalRef.current?.focus({
				cursor: 'start'
			})
		}, 100)
		type == 'add' ? setIsAddTranslate(true) : setIsAddTranslate(false)
	}

	const handleOk = () => {
		isAddTranslate ? !!textSelect && handleAddTranslate() : handleFixTranslate()
		setIsModalVisible(false)
	}

	const handleCancel = () => {
		setIsModalVisible(false)
		setTextSelect(null)
		setTextTranslate(null)
	}

	const onChange_GetTranslateText = (e: any) => {
		let text: string = e.target.value
		setTextTranslate(text)
	}

	const onKeyDownInput = (e: any) => {
		if (e.key === 'Enter') {
			handleAddTranslate()
			setIsModalVisible(false)
		}
	}

	// HANDLE FIX TRANSLATE
	const handleFixTranslate = () => {
		let elementNote: any = document.querySelectorAll('#editor-element .note-editable .text-note-of-translate')
		elementNote.forEach((item: any, index: any) => {
			let noteID: number = parseInt(item.getAttribute('data-note'))
			let textItem: any = item.innerHTML
			let indexData: number = dataTranslate.findIndex((e: any) => e.noteID === noteID)
			if (dataTranslate[indexData].textTranslate !== textItem) {
				item.innerHTML = dataTranslate[indexData].textTranslate
				item.setAttribute('title', dataTranslate[indexData].textTranslate)
			}
		})
	}

	// HANDLE ADD TRANSLATE
	const handleAddTranslate = () => {
		const { noteEditable: currentContent, editor: currentEditor } = editorRef.current
		if (currentEditor.summernote('isEmpty') === false && !!textSelect.toString()) {
			let noteID: any = null
			if (dataTranslate.length < 1) {
				noteID = 0
			} else {
				noteID = dataTranslate[dataTranslate.length - 1].noteID + 1
			}
			textSelect.pasteHTML(`<ruby>${textSelect.toString()}<rt style="font-size: 70%;">${textTranslate}</rt></ruby>`)
			setTextSelect(null)
			getDataEditor(currentContent.html())
		}
		setTextTranslate(null)
		setTextSelect(null)
	}

	const onFixTextTranslate = (e: any, noteID: any) => {
		let text: any = e.target.value
		let index: any = dataTranslate.findIndex((item: any) => item.noteID == noteID)
		let oldText: string = `<input class="input-prevent-translate"/><span title="${dataTranslate[index]?.textTranslate}" class="text-normal-of-translate">${dataTranslate[index]?.textSelect}<span data-note="${dataTranslate[index]?.noteID}" class="text-note-of-translate">${dataTranslate[index]?.textTranslate}</span></span><input class="input-prevent-translate"/>`
		let newText: string = `<input class="input-prevent-translate"/><span title="${text}" class="text-normal-of-translate">${dataTranslate[index]?.textSelect}<span data-note="${dataTranslate[index]?.noteID}" class="text-note-of-translate">${text}</span></span><input class="input-prevent-translate"/>`
		dataTranslate[index].textTranslate = text
		if (valueEditor.includes(oldText)) {
			setValueEditor(valueEditor.replace(oldText, newText))
			getDataEditor(valueEditor.replace(oldText, newText))
		}
		setDataTranslate([...dataTranslate])
	}

	useEffect(() => {
		let elementNote: any = document.querySelectorAll('#editor-element .note-editable .text-normal-of-translate')
		if (elementNote.length > 0) {
			elementNote.forEach((item: any) => {
				let noteID: any = item.lastChild.attributes[0].nodeValue
				let textSelect: any = item.firstChild.nodeValue
				let textTranslate: any = item.lastChild.childNodes[0].nodeValue
				dataTranslate.push({
					noteID: parseInt(noteID),
					textSelect: textSelect,
					textTranslate: textTranslate
				})
			})
			setDataTranslate([...dataTranslate])
		}
	}, [])

	// RÊN ĐƠ
	return (
		<>
			<Modal title="Phiên âm" visible={isModalVisible} okText="Lưu" cancelText="Hủy" onOk={handleOk} onCancel={handleCancel}>
				{isAddTranslate ? (
					textSelect ? (
						<Input
							ref={inputModalRef}
							allowClear
							id="input-translate"
							className="style-input"
							value={textTranslate}
							onChange={onChange_GetTranslateText}
							onKeyDown={onKeyDownInput}
						/>
					) : (
						<p style={{ fontWeight: 500 }}>Vui lòng chọn nội dung cần phiên âm</p>
					)
				) : (
					<div className="detail-translate">
						<table>
							<thead>
								<th className="text-center">Nội dung</th>
								<th className="text-center">Phiên âm</th>
							</thead>
							<tbody>
								{dataTranslate.map((item, index) => (
									<tr key={index}>
										<td>{item.textSelect}</td>
										<td className="text-center">
											<input
												className="show-text-translate"
												type="text"
												value={item.textTranslate}
												onChange={(e) => onFixTextTranslate(e, item.noteID)}
												onKeyDown={(e) => {
													if (e.key === 'Enter') {
														handleFixTranslate()
														setIsModalVisible(false)
													}
												}}
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</Modal>

			<div className="wrap-editor custom" id="editor-element">
				<div
					className="d-flex align-items-center mb-2"
					style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'flex-end' }}
				>
					<button className="btn-editor d-flex align-items-center mr-2" onClick={() => showModal('add')}>
						<PlusOutlined className="mr-2" /> Thêm Phiên âm
					</button>
					{/* <button className="btn-editor fix-translate d-flex align-items-center mr-2" onClick={() => showModal('fix')}>
						<EditOutlined className="mr-2" /> Sửa phiên âm
					</button> */}
					<button className="btn-editor d-flex align-items-center" onClick={handleAddSpace}>
						<BorderOutlined className="mr-2" /> Thêm input
					</button>
				</div>

				<ReactSummernote
					class="summernote"
					ref={editorRef}
					value={valueEditor}
					children={ReactHtmlParser(valueEditor)}
					options={{
						lang: 'vn',
						height: 500,
						dialogsInBody: true,
						toolbar: [
							['style', ['style']],
							['font', ['bold', 'underline', 'clear']],
							['fontname', ['fontname']],
							['para', ['ul', 'ol', 'paragraph']],
							['table', ['table']],
							['insert', ['link', 'picture', 'video']],
							['view', ['fullscreen', 'codeview']]
						]
					}}
					onChange={(e: string) => onChange(e)}
					onImageUpload={onImageUpload}
				/>
			</div>
		</>
	)
}

export default EditorSummernote

import React, { FC, useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import { Button, List, Tooltip, Input } from 'antd'
import EditorSimple from '~/components/Elements/EditorSimple'
import ReactHtmlParser from 'react-html-parser'
import { VideoCourseInteraction } from '~/apiBase'
import { useRouter } from 'next/router'
import { useWrap } from '~/context/wrap'
import { VideoNoteApi } from '~/apiBase/video-learning/video-note'

type itemProps = {
	id: ''
	Title: ''
	subTitle: ''
	TextContent: ''
	TimeNote: ''
}

type iProps = {
	onPress: any
	item: itemProps
	onDelete: any
	onEdit: any
}

type props = {
	lession: any
}

const TestResult: FC<props> = ({ lession }) => {
	const [showAdd, setShowAdd] = useState(false)
	const [newContent, setContent] = useState('')
	const [title, setTitle] = useState('')
	const [isReset, setReset] = useState(false)
	const [typeInput, setTypeInput] = useState(0)
	const [itemEdit, setItemEdit] = useState<any>([])

	const router = useRouter()
	const { userInformation, showNoti } = useWrap()

	const [notes, setNotes] = useState([])

	useEffect(() => {
		if (!!lession?.ID) {
			_getNotes(lession?.ID)
		}
	}, [lession])

	// CALL API GET NOTES
	const _getNotes = async (ID) => {
		const temp = {
			pageIndex: 1,
			pageSize: 999,
			VideoCourseID: router.query.course,
			LessonDetailID: ID,
			searchCreateby: userInformation?.UserAccountID,
			sort: 0
		}
		try {
			const res = await VideoCourseInteraction.ListNote(temp)
			res.status == 200 && setNotes(res.data.data)
		} catch (err) {}
	}

	// CREATE NEW NOTE
	const _createNote = async () => {
		try {
			let temp = {
				VideoCourseID: router.query.course,
				LessonDetailID: lession.ID,
				Title: title,
				TextContent: newContent,
				TimeNote: 0,
				Type: 2
			}
			const res = await VideoCourseInteraction.add(temp)
			res.status == 200 && _getNotes(lession?.ID), reset()
		} catch (error) {
			showNoti('danger', error?.message)
		}
	}

	// POST DATA EDIT NOTE
	const _editNote = async (param) => {
		try {
			const res = await VideoNoteApi.update(param)
			res.status == 200 && _getNotes(lession?.ID), reset()
		} catch (error) {
			showNoti('danger', error?.message)
		}
	}

	const reset = () => {
		setTitle('')
		setReset(true)
		setTimeout(() => {
			setReset(false)
		}, 200)
	}

	const handleSubmitEdit = () => {
		setTitle('')
		_editNote({ ID: itemEdit.ID, Title: title, TextContent: newContent })
		setShowAdd(false)
		setContent('')
		setTimeout(() => {
			setTypeInput(0)
			setShowAdd(true)
		}, 0)
	}

	return (
		<div className="pr-5 pl-5 wrap-vocab">
			{!showAdd ? (
				<Button
					onClick={() => {
						setTypeInput(0)
						setShowAdd(true)
					}}
					className="row wrap-vocab__create-new-button"
				>
					<span>Thêm mới</span>
					<i className="fas fa-plus-circle" style={{ color: 'gray' }}></i>
				</Button>
			) : (
				<div className="wrap-vocab__create-new">
					<Input
						placeholder="Tiêu đề"
						className="mb-3 mt-3"
						value={title}
						onChange={(t) => {
							setTitle(t.target.value)
						}}
					/>
					<EditorSimple
						handleChange={(value) => {
							setContent(value)
						}}
						isReset={isReset}
						questionContent={newContent}
					/>
					<div className="row wrap-vocab__create-new__button-group">
						<Tooltip title="Đóng khung nhập liệu">
							<button
								onClick={() => {
									setTitle('')
									setContent('')
									setTypeInput(0)
									setShowAdd(false)
								}}
								className="btn ml-3 mt-3 btn-primary"
							>
								<i className="far fa-times-circle mr-2"></i>Hủy
							</button>
						</Tooltip>

						<Tooltip title="Thêm ghi chú">
							<button onClick={typeInput === 0 ? _createNote : handleSubmitEdit} className="btn ml-3 mt-3 btn-success">
								<i className="fas fa-plus-circle mr-2"></i>
								{typeInput === 0 ? 'Thêm' : 'Lưu'}
							</button>
						</Tooltip>
					</div>
				</div>
			)}
		</div>
	)
}

export default TestResult

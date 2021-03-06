import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import { List, Avatar, Form, Button, Input, Tooltip, Popconfirm } from 'antd'
import { useWrap } from '~/context/wrap'
import { ReplyInteractionInVideoCourseApi } from '~/apiBase/ReplyInteractionInVideoCourse'
import { useRouter } from 'next/router'
import { VideoCourseInteraction } from '~/apiBase'
import { VideoNoteApi } from '~/apiBase/video-learning/video-note'

const { TextArea } = Input

// MY EDITOR - TEXTAREA
const Editor = ({ onChange, onSubmit, onSubmitEdit, submitting, value, isEdit, onCancel }) => (
	<>
		<Form.Item>
			<TextArea placeholder="Nội dung" rows={4} onChange={onChange} value={value} />
		</Form.Item>
		<Form.Item>
			<Button className="btn btn-primary" loading={submitting} onClick={isEdit === false ? onSubmit : onSubmitEdit}>
				{isEdit === false ? 'Thêm câu hỏi' : 'Lưu thay đổi'}
			</Button>
			{!!isEdit && (
				<Button className="btn btn-cancel ml-3" loading={submitting} onClick={onCancel}>
					Huỷ
				</Button>
			)}
		</Form.Item>
	</>
)

// CONVERT DATE TO H:M DD-MM-YYYY
const getDateString = (date) => {
	const newDate = new Date(date)
	return (
		newDate.getHours() +
		':' +
		newDate.getMinutes() +
		' ' +
		getNumber(newDate.getDate()) +
		'-' +
		getNumber(newDate.getMonth() + 1) +
		'-' +
		getNumber(newDate.getFullYear())
	)
}

const getNumber = (num) => {
	return num > 9 ? num : '0' + num
}

const RenderItemReply = (props: any) => {
	const { item, onEdit, onDelete, userInformation } = props

	return (
		<div className={`wrap-render-item-quest`} style={{ marginLeft: -15 }}>
			<div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
				<Avatar
					className="avatar custom-avt"
					src={item.AuthorAvatar !== '' && item.AuthorAvatar !== null ? item.AuthorAvatar : '/images/logo-thumnail.png'}
				/>
				<div className="ml-3 comment">
					<span className="name">{item.AuthorName} - </span>
					<span className="date">{getDateString(item.CreatedDate)}</span>

					<div className="m-0 row vl-t-sb">
						<p className="content">{item.ReplyContent}</p>

						<div className="row ml-3 vocab-item__menu" style={{ marginRight: -35 }}>
							{userInformation?.UserInformationID == item?.AuthorID && (
								<>
									<Tooltip title="Sửa">
										<button onClick={() => onEdit(item)} className="btn btn-icon edit">
											<div className="mini-reply-button">
												<i className="fas fa-edit" style={{ color: '#4bcbaf', fontSize: 16, marginRight: 2 }}></i>
											</div>
										</button>
									</Tooltip>
									<Tooltip title="Xoá">
										<button onClick={() => onDelete(item)} className="btn btn-icon edit">
											<div className="mini-reply-button">
												<i className="fas fa-trash-alt" style={{ color: '#dd4667', fontSize: 16, marginRight: 2 }}></i>
											</div>
										</button>
									</Tooltip>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

// RENDER ITEM QUESTION
const RenderItem = (props: any) => {
	const { item, onEdit, userInformation, onDelete } = props

	const [showReply, setShowReply] = useState(false)
	const [content, setContent] = useState('')
	const [replyList, setReplyList] = useState<any>([])
	const [edit, setEdit] = useState('')

	useEffect(() => {
		getReply()
	}, [])

	// CALL API GET REPLY
	const getReply = async () => {
		try {
			setContent('')
			const res = await ReplyInteractionInVideoCourseApi.getAll(item?.ID)
			setReplyList(res.data.data.obj)
		} catch (error) {
			console.log('getReply: ', error)
		}
	}

	// CALL API CREATE REPLY
	const postReply = async (param: any) => {
		try {
			await ReplyInteractionInVideoCourseApi.add(param)
			getReply()
		} catch (error) {
			console.log('postReply: ', error)
		}
	}

	// CALL API UPDATE REPLY
	const updateReply = async (param: any) => {
		try {
			await ReplyInteractionInVideoCourseApi.update(param)
			getReply()
		} catch (error) {
			console.log('postReply: ', error)
		} finally {
			setEdit('')
			setContent('')
		}
	}

	// ON EDIT REPLY
	const handleEditReply = (e) => {
		setEdit(e?.ID)
		setContent(e?.ReplyContent)
		setShowReply(true)
	}

	// ON DELETE REPLY
	const handleDeleteReply = (e) => {
		updateReply({ ID: e?.ID, Enable: false })
	}

	// SHOW ALL REPLY
	const [showAll, setShowAll] = useState(false)

	// RESET INPUT AND BUTTON
	const reset = () => {
		setContent('')
		setEdit('')
	}

	// RENDER
	return (
		<div className={`m-3 wrap-render-item-quest ${showReply && 'qa-item-active'}`}>
			<div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
				<Avatar
					className="avatar custom-avt"
					src={item.AuthorAvatar !== '' && item.AuthorAvatar !== null ? item.AuthorAvatar : '/images/logo-thumnail.png'}
				/>
				<div className="ml-3 comment">
					<div className="m-0 row vl-t-sb">
						<p className="title">{item.Title}</p>
						<div className="row mr-1 ml-3 vocab-item__menu">
							{userInformation?.UserInformationID == item?.AuthorID && (
								<>
									<Tooltip title="Sửa">
										<button onClick={() => onEdit(item)} className="btn btn-icon edit">
											<div className="mini-reply-button">
												<i className="fas fa-edit" style={{ color: '#4bcbaf', fontSize: 16, marginRight: 2 }}></i>
											</div>
										</button>
									</Tooltip>
									<Tooltip title="Xoá">
										<Popconfirm title="Bạn muốn xóa thật sao?" onConfirm={() => onDelete(item)} okText="Yes" cancelText="No">
											<button className="btn btn-icon edit">
												<div className="mini-reply-button">
													<i className="fas fa-trash-alt" style={{ color: '#dd4667', fontSize: 16, marginRight: 2 }}></i>
												</div>
											</button>
										</Popconfirm>
									</Tooltip>
								</>
							)}

							<Tooltip title={showReply ? 'Đóng trả lời' : 'Trả lời'}>
								<button
									onClick={() => {
										edit !== '' ? reset() : setShowReply(!showReply)
									}}
									className="btn btn-icon delete"
								>
									<div className="mini-reply-button">
										{showReply && edit == '' ? (
											<i className="fas fa-times" style={{ color: '#2196F3', fontSize: 16, marginRight: 2 }}></i>
										) : (
											<i className="fas fa-reply" style={{ color: '#2196F3', fontSize: 16, marginRight: 1 }}></i>
										)}
									</div>
								</button>
							</Tooltip>
						</div>
					</div>
					<p className="content">{item.TextContent}</p>
					<span className="date">
						<span className="name">{item.AuthorName}</span> {' - '}
						{getDateString(item.CreatedDate)}
					</span>
				</div>
			</div>

			<div className="qa-wrap-reply">
				{replyList.length !== 0 && (
					<>
						{replyList.length < 4 || showAll ? (
							<>
								<List
									className="mt-3"
									itemLayout="horizontal"
									dataSource={replyList}
									pagination={null}
									renderItem={(item) => (
										<RenderItemReply onDelete={handleDeleteReply} item={item} userInformation={userInformation} onEdit={handleEditReply} />
									)}
								/>

								{replyList.length > 3 && (
									<Button onClick={() => setShowAll(false)} className="btn btn-light mb-3" style={{ width: '100%' }}>
										Ẩn bớt
									</Button>
								)}
							</>
						) : (
							<>
								<List
									className="mt-3"
									itemLayout="horizontal"
									dataSource={[replyList[0], replyList[1]]}
									pagination={null}
									renderItem={(item) => (
										<RenderItemReply onDelete={handleDeleteReply} item={item} userInformation={userInformation} onEdit={handleEditReply} />
									)}
								/>
								<Button onClick={() => setShowAll(true)} className="btn btn-light mb-3" style={{ width: '100%' }}>
									Xem tất cả
								</Button>
							</>
						)}
					</>
				)}

				{showReply && (
					<div className="input">
						<Input
							value={content}
							onChange={(t) => {
								setContent(t.target.value)
							}}
							placeholder="Nội dung"
						/>
						<Button
							onClick={() =>
								edit !== ''
									? updateReply({ ID: edit, ReplyContent: content })
									: postReply({ InteractionInVideoCourseID: item?.ID, ReplyContent: content })
							}
							className="btn btn-primary ml-3"
						>
							{edit == '' ? 'Trả lời' : 'Lưu'}
						</Button>

						{edit !== '' && (
							<Button
								onClick={() => {
									setEdit('')
									setContent('')
									setShowReply(false)
								}}
								className="btn btn-cancel ml-3"
							>
								Hủy
							</Button>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

const VideoQuestion = (props: any) => {
	const { lession } = props

	const router = useRouter()
	const { userInformation, showNoti } = useWrap()

	const [dataQA, setDataQA] = useState([])
	const [comment, setComment] = useState('')
	const [title, setTile] = useState('')
	const [editItem, setEditItem] = useState<any>('')

	useEffect(() => {
		if (!!lession?.ID) {
			_getListQA(lession?.ID)
		}
	}, [lession])

	// ON EDIT
	const edit = (param) => {
		setEditItem(param)
		setTile(param.Title)
		setComment(param.TextContent)
	}

	// RESET INPUT
	const reset = () => {
		setTile('')
		setComment('')
		setEditItem('')
	}

	// GET ALL QUESTION BY LESSION ID
	const _getListQA = async (ID) => {
		const temp = { pageIndex: 1, pageSize: 999, VideoCourseID: router.query.course, LessonDetailID: ID, sort: 0 }
		try {
			const res = await VideoCourseInteraction.ListQA(temp)
			res.status == 200 && res.data.data !== undefined ? setDataQA(res.data.data) : setDataQA([])
		} catch (err) {
			//
		}
	}

	// PUT EDIT QUESTION
	const _editQuestion = async (param) => {
		try {
			const res = await VideoNoteApi.update(param)
			res.status == 200 && _getListQA(lession?.ID), reset()
		} catch (error) {
			showNoti('danger', error?.message)
		}
	}

	// CREATE NEW QUESTION
	const _createQuestion = async () => {
		try {
			let temp = { VideoCourseID: router.query.course, LessonDetailID: lession.ID, Title: title, TextContent: comment, Type: 1 }
			const res = await VideoCourseInteraction.add(temp)
			res.status == 200 && _getListQA(lession?.ID), reset()
		} catch (error) {
			showNoti('danger', error?.message)
		}
	}

	// RENDER
	return (
		<div className="wrap-question pr-3">
			<div className="wrap-question__container">
				<span className="ml-3 wrap-question__title">Tất cả câu hỏi ({dataQA.length})</span>
				<List
					className="mt-3"
					itemLayout="horizontal"
					dataSource={dataQA}
					pagination={{
						pageSize: 10
					}}
					renderItem={(item) => (
						<RenderItem
							item={item}
							onEdit={edit}
							onDelete={(e: any) => _editQuestion({ ID: e.ID, Enable: false })}
							userInformation={userInformation}
						/>
					)}
				/>
				<div className="ml-3 mt-4">
					<Input value={title} onChange={(t) => setTile(t.target.value)} className="mb-3" placeholder="Tiêu đề" />
					<Editor
						onChange={(t) => setComment(t.target.value)}
						onSubmit={_createQuestion}
						submitting={false}
						value={comment}
						isEdit={editItem !== '' ? true : false}
						onCancel={reset}
						onSubmitEdit={() => _editQuestion({ ID: editItem.ID, Title: title, TextContent: comment, Type: 1 })}
					/>
				</div>
			</div>
		</div>
	)
}

export default VideoQuestion

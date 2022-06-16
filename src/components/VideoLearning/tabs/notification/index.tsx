import React, { FC, useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import { Button, List, Tooltip, Input, Avatar, Popconfirm } from 'antd'
import EditorSimple from '~/components/Elements/EditorSimple'
import ReactHtmlParser from 'react-html-parser'
import { useWrap } from '~/context/wrap'
import Moment from 'moment'
import { VideoCourseInteraction } from '~/apiBase'
import { useRouter } from 'next/router'
import { VideoNoteApi } from '~/apiBase/video-learning/video-note'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenSquare, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

type itemProps = {
	id: ''
	Title: ''
	subTitle: ''
	TextContent: ''
	TimeNote: ''
	AuthorAvatar: string
	AuthorName: string
	CreatedDate: string
}

type iProps = {
	item: itemProps
	onDelete: any
	onEdit: any
}

type props = {
	lession: any
}

const RenderItem: FC<iProps> = ({ item, onDelete, onEdit }) => {
	const { userInformation } = useWrap()

	return (
		<div className="pt-3 pb-3 vocab-item">
			<span className="row vocab-item__title">
				<div className="row ml-3">
					<Avatar size={36} className="student-fb__i-avt mr-3" src={item.AuthorAvatar} />
					<div>
						{item.AuthorName}
						<p className="vl-tabs-nt">{Moment(item.CreatedDate).fromNow()}</p>
					</div>
				</div>

				<div className="row mr-3 ml-3 vocab-item__menu">
					{userInformation?.RoleID === 1 && (
						<>
							<Tooltip title="Sửa">
								<button onClick={() => onEdit(item)} className="btn btn-icon edit">
									<FontAwesomeIcon icon={faPenSquare as IconProp} />
								</button>
							</Tooltip>

							<Tooltip title="Xóa">
								<Popconfirm title="Bạn muốn xóa thật sao?" onConfirm={() => onDelete(item)} okText="Yes" cancelText="No">
									<button className="btn btn-icon delete">
										<FontAwesomeIcon icon={faTrashAlt as IconProp} />
									</button>
								</Popconfirm>
							</Tooltip>
						</>
					)}
				</div>
			</span>
			<span className="mt-3 pt-3  pr-3 vocab-item__content">
				<span style={{ fontWeight: 'bold' }}>{item.Title}</span>
				{ReactHtmlParser(item.TextContent)}
			</span>
		</div>
	)
}

const NotificationTab: FC<props> = ({ lession }) => {
	const { userInformation, showNoti } = useWrap()
	const [showAdd, setShowAdd] = useState(false)
	const [newContent, setContent] = useState('')
	const [title, setTitle] = useState('')
	const [isReset, setReset] = useState(false)
	const [typeInput, setTypeInput] = useState(0)
	const [itemEdit, setItemEdit] = useState<any>([])

	const router = useRouter()
	const [notification, setNotification] = useState([])

	useEffect(() => {
		if (!!router.query.course) {
			_getNotification()
		}
	}, [lession])

	const reset = () => {
		setTitle('')
		setReset(true)
		setTimeout(() => {
			setReset(false)
		}, 200)
	}

	//GET DATA NOTIFICATION
	const _getNotification = async () => {
		try {
			const res = await VideoCourseInteraction.ListListAnnouncement(router.query.course)
			res.status == 200 && setNotification(res.data.data)
			res.status == 204 && setNotification([])
		} catch (err) {
			showNoti('danger', err.message)
		}
	}

	// DELETE NOTE
	const _deleteNotification = async (item) => {
		try {
			const res = await VideoNoteApi.delete({ ID: item?.ID })
			res.status == 200 && _getNotification()
		} catch (error) {
			showNoti('danger', error?.message)
		}
	}

	// POST DATA EDIT NOTE
	const _editNotification = async (id, title, note) => {
		try {
			const res = await VideoNoteApi.update({ ID: id, Title: title, TextContent: note })
			res.status == 200 && _getNotification(), reset(), setTypeInput(0)
		} catch (error) {
			showNoti('danger', error?.message)
		}
	}

	// CALL API CREATE NEW QUESTION
	const _createNotification = async () => {
		try {
			let temp = {
				VideoCourseID: router.query.course,
				LessonDetailID: lession.ID,
				Title: title,
				TextContent: newContent,
				Type: 3
			}
			const res = await VideoCourseInteraction.add(temp)
			res.status == 200 && _getNotification(), reset()
		} catch (error) {
			showNoti('danger', error?.message)
		}
	}

	// SUBMIT EDIT NOTIFICATION
	const handleSubmitEdit = () => {
		_editNotification(itemEdit.ID, title, newContent)
		setShowAdd(false)
		setTimeout(() => {
			setShowAdd(true)
		}, 0)
	}

	// RENDER
	return (
		<div className="pr-5 pl-5 wrap-vocab">
			{userInformation?.RoleID === 1 && (
				<>
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
							<Input placeholder="Tiêu đề" className="mb-3 mt-3" value={title} onChange={(t) => setTitle(t.target.value)} />
							<EditorSimple handleChange={(value) => setContent(value)} isReset={isReset} questionContent={newContent} />
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
									<button onClick={typeInput === 0 ? _createNotification : handleSubmitEdit} className="btn ml-3 mt-3 btn-success">
										<i className="fas fa-plus-circle mr-2"></i>
										{typeInput === 0 ? 'Thêm' : 'Lưu'}
									</button>
								</Tooltip>
							</div>
						</div>
					)}
				</>
			)}

			<List
				itemLayout="horizontal"
				dataSource={notification}
				className="mt-3 wrap-vocab__list"
				renderItem={(item: itemProps) => (
					<RenderItem
						item={item}
						onDelete={_deleteNotification}
						onEdit={(p) => {
							setItemEdit(p)
							setTypeInput(1)
							setShowAdd(false)
							setTitle(p.Title)
							setContent(p.TextContent)
							setTimeout(() => {
								setShowAdd(true)
							}, 0)
						}}
					/>
				)}
			/>
		</div>
	)
}

export default NotificationTab

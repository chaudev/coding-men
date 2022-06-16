import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faPencilSquare, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Form, Input, Modal, Select, Spin } from 'antd'
import React, { useState } from 'react'
import { X } from 'react-feather'
import { documentCategoryApi } from '~/apiBase/course-detail/document-category'
import { useWrap } from '~/context/wrap'

const IconList = [
	{ icon: '/Images/1-listening.png' },
	{ icon: '/Images/2-reading.png' },
	{ icon: '/Images/3-speaking.png' },
	{ icon: '/Images/4-writing.png' },
	{ icon: '/Images/5-vocabulary.png' },
	{ icon: '/Images/6-grammar.png' },
	{ icon: '/Images/7-paraphrase.png' },
	{ icon: '/Images/8-blog.png' },
	{ icon: '/Images/9-goc-hoc-tap.png' },
	{ icon: '/Images/10-goc-dong-luc.png' },
	{ icon: '/Images/11-goc-review.png' }
]

const DocModal = (props) => {
	const { type, cateID, onFetchData, CategoryName, curriculumID } = props
	const [isVisible, setIsVisible] = useState(false)
	const [submitLoading, setSubmitLoading] = useState({ type: '', loading: false })
	const [form] = Form.useForm()
	const { showNoti, pageSize } = useWrap()
	const { Option } = Select

	const addDocument = async (data) => {
		console.log('add category', data)
		setSubmitLoading({ type: 'UPLOADING', loading: true })
		try {
			let res = await documentCategoryApi.add({ ...data, CurriculumnID: curriculumID })
			if (res.status === 200) {
				showNoti('success', 'Thành công!')
				setIsVisible(false)
				form.resetFields()
				onFetchData && onFetchData()
			}
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setSubmitLoading({ type: 'UPLOADING', loading: false })
		}
	}

	const editDocument = async (data) => {
		setSubmitLoading({ type: 'UPLOADING', loading: true })
		try {
			let res = await documentCategoryApi.update(data)
			if (res.status == 200) {
				showNoti('success', 'Thành công!')
				setIsVisible(false)
				form.resetFields()
				onFetchData && onFetchData()
			}
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setSubmitLoading({ type: 'UPLOADING', loading: false })
		}
	}

	const _onSubmit = (value) => {
		console.log('value', value)
		if (type == 'ADD_DOC') {
			addDocument(value)
		}
		if (type == 'EDIT_DOC') {
			editDocument({ ...value, ID: cateID })
		}
		if (type == 'DELETE_DOC') {
			console.log({ CategoryName: CategoryName, ID: cateID, Enable: false })
			editDocument({ ID: cateID, CategoryName: CategoryName, Enable: 'false' })
		}
	}

	const handleChange = () => {}

	return (
		<>
			{type == 'ADD_DOC' && (
				<button
					onClick={() => {
						setIsVisible(true)
					}}
					className="btn btn-warning"
				>
					Thêm thư mục
				</button>
			)}
			{type == 'EDIT_DOC' && (
				<button
					onClick={() => {
						setIsVisible(true)
						form.resetFields()
					}}
					className="btn btn-icon edit"
				>
					<FontAwesomeIcon style={{ color: '#34c4a4' }} icon={faPencilSquare as IconProp} size="lg" />
					{/* <i className="fas fa-edit" style={{ color: '#34c4a4', fontSize: 16, marginBottom: -1 }}></i> */}
				</button>
			)}
			{type == 'DELETE_DOC' && (
				<button
					onClick={() => {
						setIsVisible(true)
					}}
					className="btn btn-icon delete"
				>
					<FontAwesomeIcon style={{ color: '#E53935', fontSize: 17 }} icon={faTrashAlt as IconProp} size="xs" />

					{/* <X /> */}
				</button>
			)}

			<Modal
				title={
					(type == 'ADD_DOC' && 'Thêm loại tài liệu') ||
					(type == 'DELETE_DOC' && 'Xóa loại tài liệu') ||
					(type == 'EDIT_DOC' && 'Sửa loại tài liệu')
				}
				onCancel={() => setIsVisible(false)}
				visible={isVisible}
				footer={false}
			>
				<Form form={form} layout="vertical" onFinish={_onSubmit}>
					<div className="row">
						{(type == 'ADD_DOC' && (
							<>
								<div className="col-12">
									<Form.Item label="Tên loại tài liệu" name="CategoryName">
										<Input onChange={(event) => {}} name="CategoryName" placeholder="Tên loại tài liệu" className="style-input" />
									</Form.Item>
								</div>
								<div className="col-12 category-icon-select">
									<Form.Item label="Chọn icon" name="Icon">
										<Select style={{ width: 120, height: 90 }} onChange={handleChange}>
											{IconList.map((item) => (
												<Option value={item.icon}>
													<img src={item.icon} />
												</Option>
											))}
										</Select>
									</Form.Item>
								</div>
							</>
						)) ||
							(type == 'DELETE_DOC' && (
								<div className="col-12 justify-content-center">
									<h4 className="text-center">Bạn xác nhận muốn xóa loại tài liệu này?</h4>
								</div>
							)) ||
							(type == 'EDIT_DOC' && (
								<>
									<div className="col-12">
										<Form.Item label="Tên loại tài liệu" name="CategoryName">
											<Input
												onChange={(event) => {}}
												name="CategoryName"
												placeholder="Tên loại tài liệu"
												className="style-input"
												defaultValue={CategoryName}
											/>
										</Form.Item>
									</div>
									<div className="col-12 category-icon-select">
										<Form.Item label="Chọn icon" name="Icon">
											<Select style={{ width: 120, height: 90 }} onChange={handleChange}>
												{IconList.map((item) => (
													<Option value={item.icon}>
														<img src={item.icon} />
													</Option>
												))}
											</Select>
										</Form.Item>
									</div>
								</>
							))}

						<div className="col-12 mt-3 text-center w-100">
							<button type="submit" className="btn btn-primary w-100">
								{type == 'DELETE_DOC' ? 'Xóa' : 'Lưu'}
								{submitLoading.type == 'UPLOADING' && submitLoading.loading && <Spin className="loading-base" />}
							</button>
						</div>
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default DocModal

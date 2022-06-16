import { UploadOutlined } from '@ant-design/icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faFolderPlus, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Form, Image, Input, Modal, Spin, Upload } from 'antd'
import React, { useState } from 'react'
import { X } from 'react-feather'
import { documentListApi } from '~/apiBase/document-list/document-list'
import { useWrap } from '~/context/wrap'

const DocListModal = ({ type, docInfo, onFetchDataForm, docID, docName }) => {
	const [isVisible, setIsVisible] = useState(false)
	const [submitLoading, setSubmitLoading] = useState({ type: '', loading: false })
	const [previewImage, setPreviewImage] = useState('')
	const [imageSelected, setImageSelected] = useState({ name: '', originFileObj: '' })
	const [form] = Form.useForm()
	const { showNoti } = useWrap()

	const addDocument = async (value) => {
		let dataUpdate = {
			DocumentName: value.DocumentName,
			CategoryID: docInfo.CategoryID,
			File: value.File.file.originFileObj,
			Image: imageSelected.originFileObj
		}
		setSubmitLoading({ type: 'UPLOADING', loading: true })
		try {
			let res = await documentListApi.add(dataUpdate)
			if (res.status === 200) {
				showNoti('showNoti', 'Thành công!')
				onFetchDataForm && onFetchDataForm()
				setIsVisible(false)
				form.resetFields()
				setImageSelected({ name: '', originFileObj: '' })
				setPreviewImage('')
			}
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setSubmitLoading({ type: 'UPLOADING', loading: false })
		}
	}

	const updateDocument = async (value) => {
		let dataUpdate = {
			ID: docID,
			DocumentName: type == 'DELETE_DOC' ? '' : value.CategoryName,
			Enable: type == 'DELETE_DOC' ? false : true
		}
		setSubmitLoading({ type: 'UPLOADING', loading: true })
		try {
			let res = await documentListApi.update(dataUpdate)
			if (res.status === 200) {
				showNoti('showNoti', 'Thành công!')
				onFetchDataForm && onFetchDataForm()
				setIsVisible(false)
				form.resetFields()
			}
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setSubmitLoading({ type: 'UPLOADING', loading: false })
		}
	}

	const handleUploadFile = async (info) => {
		setImageSelected(info.file)
		setPreviewImage(URL.createObjectURL(info.file.originFileObj))
	}

	// Handle delete image
	const handleDeleteImage = () => {
		setImageSelected({ name: '', originFileObj: '' })
		setPreviewImage('')
	}

	const _onSubmit = async (value) => {
		if (type == 'ADD_DOC') {
			addDocument(value)
		}
		if (type == 'DELETE_DOC') {
			updateDocument(value)
		}
		if (type == 'EDIT_DOC') {
			updateDocument(value)
		}
	}

	return (
		<>
			{type == 'ADD_DOC' && (
				<button
					onClick={() => {
						setIsVisible(true)
						form.resetFields()
					}}
					className="btn btn-icon edit"
				>
					<FontAwesomeIcon style={{ color: '#2196F3' }} icon={faFolderPlus as IconProp} size="lg" />
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
					<i className="fas fa-edit" style={{ color: '#34c4a4', fontSize: 16, marginBottom: -1 }}></i>
				</button>
			)}

			{type == 'DELETE_DOC' && (
				<button
					onClick={() => {
						setIsVisible(true)
					}}
					className="btn btn-icon delete"
				>
					<X />
				</button>
			)}

			<Modal
				title={(type == 'ADD_DOC' && 'Thêm tài liệu') || (type == 'DELETE_DOC' && 'Xóa tài liệu') || (type == 'EDIT_DOC' && 'Sửa tài liệu')}
				onCancel={() => setIsVisible(false)}
				visible={isVisible}
				footer={false}
			>
				<Form form={form} layout="vertical" onFinish={_onSubmit}>
					<div className="row">
						{(type == 'ADD_DOC' && (
							<>
								<div className="col-12">
									<Form.Item label="Tên tài liệu" name="DocumentName" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
										<Input onChange={(event) => {}} name="DocumentName" placeholder="Tên tài liệu" className="style-input" />
									</Form.Item>
								</div>
								<div className="col-12">
									<Form.Item
										label=" " // CHỔ NÀY BÙA ĐỀ HIỆN CÁI TOOLTIP. XÓA KHOẢN TRẮNG MẤT LUÔN TOOLTIP
										tooltip={{
											title:
												'File dạng: ".jpg", ".jpeg", ".png", ".bmp", ".mp4", ".flv", ".mpeg", ".mov", ".mp3", ".doc", ".docx", ".pdf", ".csv", ".xlsx", ".xls", ".ppt", ".pptx", ".zip", ".rar", tối đa 100mb',
											icon: (
												<div className="row ">
													<span className="mr-1 mt-3" style={{ color: '#000' }}>
														Nhấp để tải lên tài liệu
													</span>
													<i className="fas fa-question-circle"></i>
												</div>
											)
										}}
										name="File"
										rules={[{ required: true, message: 'Bạn không được để trống' }]}
									>
										<Upload style={{ width: 800 }} className="vc-e-upload" maxCount={1} name="File">
											<Button className="vc-e-upload" icon={<UploadOutlined />}>
												Click to Upload
											</Button>
										</Upload>
									</Form.Item>
								</div>

								<div className="col-md-6 col-12">
									<Form.Item name="Image" label="Hình ảnh thu nhỏ">
										<Upload className="vc-e-upload" onChange={(e) => handleUploadFile(e)} showUploadList={false}>
											<Button className="vc-e-upload" icon={<UploadOutlined style={{ marginTop: -2 }} />}>
												Bấm để tải hình ảnh
											</Button>
										</Upload>
										{imageSelected.name !== undefined && imageSelected.name !== '' && (
											<div className="row m-0 mt-3 vc-store-center">
												<Button danger onClick={() => handleDeleteImage()}>
													Xoá hình ảnh
												</Button>
											</div>
										)}
									</Form.Item>
								</div>
								<div className="col-12 mb-4">
									<p className="font-weight-primary" style={{ color: 'red' }}>
										*Lưu ý: Upload tối đa 100Mb
									</p>
								</div>
								{previewImage !== '' && (
									<div className="col-md-6 col-12">
										<Image className="image_wrapper" src={previewImage} />
									</div>
								)}
							</>
						)) ||
							(type == 'DELETE_DOC' && (
								<div className="col-12 justify-content-center">
									<h4 className="text-center">Bạn xác nhận muốn xóa tài liệu?</h4>
								</div>
							)) ||
							(type == 'EDIT_DOC' && (
								<>
									<div className="col-12">
										<Form.Item label="Tên tài liệu" name="CategoryName">
											<Input
												onChange={(event) => {}}
												name="CategoryName"
												placeholder="Tên tài liệu"
												className="style-input"
												defaultValue={docName}
											/>
										</Form.Item>
									</div>
								</>
							))}

						<div className="col-12 mt-3">
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

export default DocListModal

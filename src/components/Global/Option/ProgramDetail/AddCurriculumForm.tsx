import { UploadOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, Modal, Select, Spin, Tooltip, Upload } from 'antd'
import React, { useState } from 'react'
import { curriculumDetailApi } from '~/apiBase'
import { lessonDetailApi } from '~/apiBase/options/lesson-detail'
import { useWrap } from '~/context/wrap'
import EditorSimple from '~/components/Elements/EditorSimple'

const { Option } = Select

const initLesson = {
	Content: '',
	LinkVideo: '',
	LinkDocument: '',
	LinkHtml: '',
	ExamTopicID: null,
	IsPreview: false
}

export const AddCurriculumForm = (props) => {
	const { curriculumDetailID, dataExamTopic, dataCurriculumDetail, onFetchData, callFrom, callBack, dataRow } = props
	const [form] = Form.useForm()
	const { showNoti } = useWrap()

	const [visible, setVisible] = useState(false)
	const [status, setStatus] = useState(false)
	const [showListUploadDoc, setShowListUploadDoc] = useState(false)
	const [showListUploadHtml, setShowListUploadHtml] = useState(false)
	const [loadingUploadDoc, setLoadingUploadDoc] = useState({ nameFile: '', type: '', loading: false })
	const [loadingUploadHtml, setLoadingUploadHtml] = useState({ nameFile: '', type: '', loading: false })
	const [lesson, setLesson] = useState({ ...initLesson, CurriculumDetailID: curriculumDetailID })
	const [description, setDescription] = useState<string>('')
	const [exam, setExam] = useState({ ID: curriculumDetailID, SubjectID: dataRow.SubjectID, IsExam: true, ExamTopicID: null })
	const [isLoading, setIsLoading] = useState({ type: '', status: false })

	const showModal = () => {
		setVisible(true)
	}

	const handleSelectStatus = (value: string) => {
		setStatus(value === 'Kiểm tra' ? true : false)
	}

	const handleOk = () => {
		setTimeout(() => {
			setVisible(false)
		}, 2000)
	}

	const handleCancel = () => {
		setVisible(false)
	}

	const _onSubmit = async () => {
		setIsLoading({ type: 'ADD_DATA', status: true })
		let res = null
		if (status) {
			try {
				res = await curriculumDetailApi.update(exam)
				if (res.status == 200) {
					showNoti('success', res.data.message)
					form.resetFields()
					setVisible(false)
					onFetchData && onFetchData()
				}
			} catch (error) {
				showNoti('danger', error.message)
			} finally {
				setIsLoading({ type: 'ADD_DATA', status: false })
			}
		} else {
			try {
				res = await lessonDetailApi.add({ ...lesson, Description: description })
				if (res.status == 200) {
					showNoti('success', res.data.message)
					form.resetFields()
					setVisible(false)
				}
			} catch (error) {
				showNoti('danger', error.message)
			} finally {
				setIsLoading({ type: 'ADD_DATA', status: false })
			}
		}
		if (callFrom === 'modal') {
			callBack(true)
		}
		return res
	}

	const onChangeUploadLinkDocument = async (info: any) => {
		if (info.fileList.length > 0) {
			setShowListUploadDoc(false)
			setLoadingUploadDoc({ nameFile: info.file.name, loading: true, type: 'link-doc' })
			if (info.file.status === 'uploading') {
				return
			}
			try {
				let res = await lessonDetailApi.UploadDocument(info.file.originFileObj)
				if (res.status == 200) {
					setLesson({ ...lesson, LinkDocument: res.data.data })
					showNoti('success', 'Upload file thành công')
					setShowListUploadDoc(true)
				}
			} catch (error) {
				showNoti('danger', 'Tải file thất bại')
				setShowListUploadDoc(false)
			} finally {
				setLoadingUploadDoc({ nameFile: '', loading: false, type: '' })
			}
		} else {
			showNoti('success', 'Xóa file thành công')
			setLesson({ ...lesson, LinkDocument: '' })
		}
	}

	const onChangeUploadLinkHTML = async (info) => {
		if (info.fileList.length > 0) {
			setShowListUploadHtml(false)
			setLoadingUploadHtml({ nameFile: info.file.name, loading: true, type: 'link-html' })
			if (info.file.status === 'uploading') {
				return
			}
			try {
				let res = await lessonDetailApi.UploadHtml(info.file.originFileObj)
				setLesson({ ...lesson, LinkHtml: res.data.data })
				showNoti('success', 'Upload file thành công')
				setShowListUploadHtml(true)
			} catch (error) {
				showNoti('danger', 'Tải file thất bại')
				setShowListUploadHtml(false)
			} finally {
				setLoadingUploadHtml({ nameFile: '', loading: false, type: '' })
			}
		} else {
			showNoti('success', 'Xóa file thành công')
			setLesson({ ...lesson, LinkHtml: '' })
		}
	}

	return (
		<>
			<button className="btn btn-icon edit" onClick={showModal}>
				{callFrom === 'main' ? (
					<Tooltip title="Cập nhật">
						<i className="fas fa-edit" style={{ color: '#34c4a4', fontSize: 16, marginBottom: -1 }}></i>
					</Tooltip>
				) : callFrom === 'modal' ? (
					<Tooltip title="Thêm mới">
						<button onClick={() => callBack(false)} className="btn btn-success" style={{ marginRight: -5, marginTop: -6 }}>
							<i className="far fa-plus-circle mr-2"></i>Thêm mới
						</button>
					</Tooltip>
				) : (
					<Tooltip title="Cập nhật">
						<i className="fas fa-edit" style={{ color: '#34c4a4', fontSize: 16, marginBottom: -1 }}></i>
					</Tooltip>
				)}
			</button>

			<Modal
				title={!status ? 'Thêm nội dung bài học' : 'Thêm nội dung kiểm tra'}
				visible={visible}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={false}
				width={1000}
				centered
			>
				<div className="container-fluid">
					<Form form={form} onFinish={_onSubmit} layout="vertical">
						{!status ? (
							<div className="lesson-adding">
								<div className="row">
									<div className="col-md-6 col-12">
										<Form.Item label="Giáo trình" name="CurriculumDetailID">
											<Select
												disabled={true}
												className="style-input w-100"
												showSearch
												optionFilterProp="children"
												defaultValue={curriculumDetailID}
												onChange={handleSelectStatus}
											>
												{!!dataCurriculumDetail &&
													dataCurriculumDetail?.map((item: any, index: number) => (
														<Option value={item.ID} key={index}>
															{item?.CurriculumName}
														</Option>
													))}
											</Select>
										</Form.Item>
									</div>
									<div className="col-md-6 col-12">
										<Form.Item label="Tiêu đề" name="Content">
											<Input
												placeholder="Nhập tiêu đề"
												className="style-input"
												onChange={(e) => setLesson({ ...lesson, Content: e.target.value })}
											/>
										</Form.Item>
									</div>
									<div className="col-md-6 col-12">
										<Form.Item label="Link video" name="LinkVideo">
											<Input
												placeholder="Thêm liên kết đến video"
												className="style-input"
												onChange={(e) => setLesson({ ...lesson, LinkVideo: e.target.value })}
											/>
										</Form.Item>
									</div>
									<div className="col-md-6 col-12">
										<Form.Item label="Link tài liệu" name="LinkDocument">
											<Upload onChange={onChangeUploadLinkDocument} showUploadList={showListUploadDoc} maxCount={1}>
												<Button icon={<UploadOutlined />}>Bấm để tải file</Button>
											</Upload>
											{loadingUploadDoc.loading && loadingUploadDoc.type == 'link-doc' && (
												<div className="d-flex align-items-center mt-2">
													<Spin />
													<p className="ml-2  ant-upload-list-item-name">{loadingUploadDoc.nameFile}</p>
												</div>
											)}
										</Form.Item>
									</div>

									<div className="col-md-6 col-12">
										<Form.Item label="Bài tập" name="ExamTopicID">
											<Select
												disabled={false}
												style={{ width: '100%' }}
												className="style-input"
												showSearch
												placeholder="Chọn bài tập"
												optionFilterProp="children"
												onChange={(value) => setLesson({ ...lesson, ExamTopicID: value })}
											>
												<Option value={0} key={0}>
													Không chọn
												</Option>
												{dataExamTopic?.map((item, index) => (
													<Option value={item.ID} key={index}>
														{item.Name}
													</Option>
												))}
											</Select>
										</Form.Item>
									</div>
									<div className="col-md-6 col-12">
										<Form.Item label="Link HTML" name="LinkHtml">
											<Upload onChange={onChangeUploadLinkHTML} showUploadList={showListUploadHtml} maxCount={1}>
												<Button icon={<UploadOutlined />}>Bấm để tải file</Button>
											</Upload>
											{loadingUploadHtml.loading && loadingUploadHtml.type == 'link-html' && (
												<div className="d-flex align-items-center mt-2">
													<Spin />
													<p className="ml-2  ant-upload-list-item-name">{loadingUploadHtml.nameFile}</p>
												</div>
											)}
										</Form.Item>
									</div>
									<div className="col-12 mb-4">
										<p className="font-weight-primary" style={{ color: 'red' }}>
											*Lưu ý: Upload tối đa 100Mb
										</p>
									</div>
								</div>
								<div className="row">
									<div className="col-12">
										<Form.Item label="" name="isPreview">
											<Checkbox onChange={(e) => setLesson({ ...lesson, IsPreview: e.target.checked })}>Cho xem trước video</Checkbox>
										</Form.Item>
									</div>
								</div>
								<div className="row">
									<div className="col-12">
										<Form.Item label="Nội dung" name="Notice">
											<EditorSimple isFull handleChange={(value: string) => setDescription(value)} isTranslate={false} />
										</Form.Item>
									</div>
								</div>
							</div>
						) : (
							<div className="exam-adding">
								<div className="row">
									<div className="col-12">
										<Form.Item label="Đề kiểm tra" name="ExamTopicID">
											<Select
												disabled={false}
												style={{ width: '100%' }}
												className="style-input"
												showSearch
												optionFilterProp="children"
												placeholder="Chọn đề kiểm tra"
												onChange={(value: number) => setExam({ ...exam, ExamTopicID: Number(value) })}
											>
												{!!dataExamTopic &&
													dataExamTopic?.map((item: any, index: number) => (
														<Option value={item.ID} key={index}>
															{item?.Name}
														</Option>
													))}
											</Select>
										</Form.Item>
									</div>
								</div>
							</div>
						)}

						<div className="row ">
							<div className="col-12 mt-3">
								<button type="submit" className="btn btn-primary w-100">
									Lưu {isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
}

export default AddCurriculumForm

import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Spin, Tooltip, Select, Upload, Button, Image } from 'antd'
import { useForm } from 'react-hook-form'
import { VideoCourseCategoryApi } from '~/apiBase/video-course-store/category'
import { VideoCourseLevelApi, VideoCuorseTag } from '~/apiBase/video-course-store/level'
import { useWrap } from '~/context/wrap'
import EditorSimple from '~/components/Elements/EditorSimple'
import { UploadOutlined } from '@ant-design/icons'
import { newsFeedApi } from '~/apiBase'
import { parseToMoney } from '~/utils/functions'
import NumberFormat from 'react-number-format'

const { Option } = Select

const ModalCreateVideoCourse = React.memo((props: any) => {
	const { isLoading, _onSubmit, dataLevel, dataCategory, dataCurriculum, refeshData, tags, onRefeshTags } = props

	const [isModalVisible, setIsModalVisible] = useState(false)
	const [loading, setLoading] = useState(false)
	const [form] = Form.useForm()
	const [tagArray, setTagArray] = useState('')
	const { showNoti } = useWrap()
	const [imageSelected, setImageSelected] = useState({ name: '' })
	const [previewImage, setPreviewImage] = useState('')
	const [slogan, setSlogan] = useState('')
	const [requirements, setRequirements] = useState('')
	const [description, setDescription] = useState('')
	const [resultsAchieved, setResultsAchieved] = useState('')
	const [courseForObject, setCourseForObject] = useState('')

	const { handleSubmit } = useForm()

	const finalSubmit = (ImageThumbnails: any) => {
		let temp = {
			CurriculumID: form.getFieldValue('CurriculumID'),
			CategoryID: form.getFieldValue('CategoryID'),
			LevelID: form.getFieldValue('LevelID'),
			VideoCourseName: form.getFieldValue('VietNamName'),
			EnglishName: form.getFieldValue('EnglishName'),
			ChineseName: '',
			ImageThumbnails: ImageThumbnails,
			OriginalPrice: form.getFieldValue('OriginalPrice').replace(/[^0-9\.]+/g, ''),
			SellPrice: form.getFieldValue('SellPrice').replace(/[^0-9\.]+/g, ''),
			TagArray: tagArray[0] == ',' ? tagArray.replace(',', '') : tagArray,
			Slogan: slogan,
			Requirements: requirements,
			Description: description,
			ResultsAchieved: resultsAchieved,
			CourseForObject: courseForObject,
			TeacherID: '',
			ExpiryDays: form.getFieldValue('ExpiryDays'),
			LimitMinutes: form.getFieldValue('LimitMinutes'),
			LimitBooking: form.getFieldValue('LimitBooking'),
			RequestPoint: form.getFieldValue('RequestPoint')
		}

		_onSubmit(temp)
		setIsModalVisible(false)
	}

	// HANDLE SUBMIT
	const onSubmit = handleSubmit((e) => {
		if (imageSelected.name === '') {
			finalSubmit(null)
		} else {
			uploadFile(imageSelected)
		}
	})

	useEffect(() => {
		const value = form.getFieldValue('OriginalPrice')
		if (value !== null && value !== undefined) {
			form.setFieldsValue({ OriginalPrice: parseToMoney(value.replace(/[^0-9\.]+/g, '')) })
		}
	}, [form.getFieldValue('OriginalPrice')])

	useEffect(() => {
		const value = form.getFieldValue('SellPrice')
		if (value !== null && value !== undefined) {
			form.setFieldsValue({ SellPrice: parseToMoney(value.toString().replace(/[^0-9\.]+/g, '')) })
		}
	}, [form.getFieldValue('SellPrice')])

	// Call api upload image
	const uploadFile = async (file) => {
		setLoading(true)
		try {
			let res = await newsFeedApi.uploadFile(file.originFileObj)
			if (res.status == 200 || res.status == 204) {
				finalSubmit(res.data.data)
			}
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setLoading(false)
		}
	}

	// on change isModalVisible
	React.useEffect(() => {
		if (!isModalVisible) {
			form.resetFields()
			setPreviewImage('')
			setImageSelected({ name: '' })
		}
	}, [isModalVisible])

	const [modalCate, setModalCate] = useState(false)
	const [modalLevel, setModalLevel] = useState(false)
	const [modalTags, setModalTags] = useState(false)
	const [newType, setNewType] = useState('')
	const [newLevel, setNewLevel] = useState('')
	const [newTag, setNewTag] = useState('')

	const createType = async () => {
		setLoading(true)
		try {
			const res = await VideoCourseCategoryApi.add({ CategoryName: newType, Enable: 'True' })
			res.status == 200 &&
				(setModalCate(false),
				setIsModalVisible(true),
				refeshData(),
				showNoti('success', 'Th??m th??nh c??ng'),
				setNewType(''),
				form.setFieldsValue({ TypeName: '' }))
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setLoading(false)
		}
	}

	const createLevel = async () => {
		setLoading(true)
		try {
			const res = await VideoCourseLevelApi.add({ LevelName: newLevel, Enable: 'True' })
			res.status == 200 &&
				(setModalLevel(false),
				setIsModalVisible(true),
				refeshData(),
				showNoti('success', 'Th??m th??nh c??ng'),
				setNewLevel(''),
				form.setFieldsValue({ LevelName: '' }))
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setLoading(false)
		}
	}

	const createTag = async () => {
		setLoading(true)
		try {
			await VideoCuorseTag.add({ Name: newTag })
		} catch (error) {
			error?.message?.ID !== undefined
				? (showNoti('success', 'Th??m th??nh c??ng'),
				  setIsModalVisible(true),
				  setModalTags(false),
				  onRefeshTags(),
				  setNewTag(''),
				  form.setFieldsValue({ newTag: '' }))
				: showNoti('danger', error.message)
		} finally {
			setLoading(false)
		}
	}

	// Upload file audio
	const handleUploadFile = async (info) => {
		setImageSelected(info.file)
		setPreviewImage(URL.createObjectURL(info.file.originFileObj))
	}

	// Handle delete image
	const handleDeleteImage = () => {
		setImageSelected({ name: '' })
		setPreviewImage('')
	}

	useEffect(() => {
		return () => {
			previewImage !== '' && URL.revokeObjectURL(previewImage)
		}
	}, [imageSelected])

	function handleChange(value) {
		setTagArray(`${value}`)
		form.setFieldsValue({ tags: `${value}` })
	}

	// RENDER
	return (
		<>
			<div className="ml-3 mr-3 mb-3 mt-1">
				<button className="btn btn-warning add-new" onClick={() => setIsModalVisible(true)}>
					Th??m m???i
				</button>

				<Modal
					confirmLoading={loading}
					title="Th??m lo???i"
					width={400}
					visible={modalCate}
					onCancel={() => setModalCate(false)}
					onOk={() => createType()}
				>
					<Form form={form} layout="vertical" onFinish={() => createType()}>
						<div className="col-md-12 col-12">
							<Form.Item name="TypeName" label="T??n lo???i" rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}>
								<Input
									placeholder=""
									className="style-input"
									defaultValue={newType}
									value={newType}
									onChange={(e) => setNewType(e.target.value)}
								/>
							</Form.Item>
						</div>
					</Form>
				</Modal>

				<Modal
					confirmLoading={loading}
					title="Th??m tr??nh ?????"
					width={400}
					visible={modalLevel}
					onCancel={() => setModalLevel(false)}
					onOk={() => createLevel()}
				>
					<Form form={form} layout="vertical" onFinish={() => createLevel()}>
						<div className="col-md-12 col-12">
							<Form.Item name="LevelName" label="T??n tr??nh ?????" rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}>
								<Input
									placeholder=""
									className="style-input"
									defaultValue={newLevel}
									value={newLevel}
									onChange={(e) => setNewLevel(e.target.value)}
								/>
							</Form.Item>
						</div>
					</Form>
				</Modal>

				<Modal
					confirmLoading={loading}
					title="Th??m t??? kh??a t??m ki???m"
					width={400}
					visible={modalTags}
					onCancel={() => setModalTags(false)}
					onOk={() => createTag()}
				>
					<Form form={form} layout="vertical" onFinish={() => createTag()}>
						<div className="col-md-12 col-12">
							<Form.Item name="newTag" label="T??? kh??a t??m ki???m m???i">
								<Input
									placeholder=""
									className="style-input"
									defaultValue={newTag}
									value={newTag}
									onChange={(e) => setNewTag(e.target.value)}
								/>
							</Form.Item>
						</div>
					</Form>
				</Modal>

				<Modal
					className="m-create-vc"
					title={`T???o kho?? h???c video`}
					visible={isModalVisible}
					onCancel={() => setIsModalVisible(false)}
					footer={null}
				>
					<div className="row m-0 p-0">
						<Form className="" form={form} layout="vertical" onFinish={() => onSubmit()}>
							<div className="row p-0 m-0">
								<div className="row p-0 m-0 col-md-6 col-12">
									<div className="col-md-6 col-12">
										<Form.Item name="EnglishName" label="T??n ti???ng Anh" rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}>
											<Input
												placeholder=""
												className="style-input"
												onChange={(e: any) => form.setFieldsValue({ EnglishName: e.target.value })}
											/>
										</Form.Item>
									</div>

									<div className="col-md-6 col-12">
										<Form.Item name="VietNamName" label="T??n ti???ng Vi???t" rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}>
											<Input
												placeholder=""
												className="style-input"
												onChange={(e) => form.setFieldsValue({ VietNamName: e.target.value })}
											/>
										</Form.Item>
									</div>

									<div className="col-md-6 col-12">
										<Form.Item
											name="LimitBooking"
											label="S??? l?????t book Zoom 1-1"
											rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}
										>
											<NumberFormat
												placeholder="S??? l?????t book: 5"
												className="ant-input style-input w-100"
												onChange={(e: any) => form.setFieldsValue({ LimitBooking: e.target.value })}
											/>
										</Form.Item>
									</div>

									<div className="col-md-6 col-12">
										<Form.Item
											name="RequestPoint"
											label="S??? ??i???m c???n ????? ???????c h???c"
											rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}
										>
											<NumberFormat
												placeholder="S??? ??i???m: 8"
												className="ant-input style-input w-100"
												onChange={(e: any) => form.setFieldsValue({ RequestPoint: e.target.value })}
											/>
										</Form.Item>
									</div>

									<div className="col-md-6 col-12">
										<Form.Item name="LimitMinutes" label="S??? ph??t / l?????t" rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}>
											<NumberFormat
												placeholder="S??? ph??t: 60"
												className="ant-input style-input w-100"
												onChange={(e: any) => form.setFieldsValue({ LimitMinutes: e.target.value })}
											/>
										</Form.Item>
									</div>

									<div className="col-md-6 col-12">
										<Form.Item
											name="ExpiryDays"
											label=" " // CH??? N??Y B??A ????? HI???N C??I TOOLTIP. X??A KHO???N TR???NG M???T LU??N TOOLTIP
											tooltip={{
												title: 'Nh???p 0 ho???c b??? tr???ng th?? kh??ng c?? h???n s??? d???ng',
												icon: (
													<div className="row ">
														<span className="mr-1 mt-3" style={{ color: '#000' }}>
															S??? ng??y s??? d???ng
														</span>
														<i className="fas fa-question-circle"></i>
													</div>
												)
											}}
											rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}
										>
											<NumberFormat
												placeholder="S??? ph??t: 60"
												className="ant-input style-input w-100"
												onChange={(e: any) => form.setFieldsValue({ ExpiryDays: e.target.value })}
											/>
										</Form.Item>
									</div>

									<div className="col-md-6 col-12">
										<Form.Item
											name="CurriculumID"
											label=" " // CH??? N??Y B??A ????? HI???N C??I TOOLTIP. X??A KHO???N TR???NG M???T LU??N TOOLTIP
											tooltip={{
												title: 'Ch??? hi???n th??? gi??o tr??nh c?? video',
												icon: (
													<div className="row ">
														<span className="mr-1 mt-3" style={{ color: '#000' }}>
															Gi??o tr??nh
														</span>
														<i className="fas fa-question-circle"></i>
													</div>
												)
											}}
											rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}
										>
											<Select
												style={{ width: '100%' }}
												className="style-input"
												showSearch
												aria-selected
												placeholder="Ch???n lo???i..."
												optionFilterProp="children"
												onChange={(e: number) => form.setFieldsValue({ CurriculumID: e })}
											>
												{dataCurriculum.map((item: any, index: number) => (
													<Option key={index} value={item.ID}>
														{item.CurriculumName}
													</Option>
												))}
											</Select>
										</Form.Item>
									</div>

									<div className="col-md-6 col-12">
										<Form.Item
											label={
												<div className="row m-0">
													Lo???i{' '}
													<Tooltip title="Th??m lo???i m???i">
														<Button onClick={() => setModalCate(true)} className="btn btn-primary btn-vc-create ml-1">
															<div style={{ marginTop: -2 }}>+</div>
														</Button>
													</Tooltip>
												</div>
											}
											name="CategoryID"
											rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}
										>
											<Select
												style={{ width: '100%' }}
												className="style-input"
												showSearch
												aria-selected
												placeholder="Ch???n lo???i..."
												optionFilterProp="children"
												onChange={(e: number) => form.setFieldsValue({ CategoryID: e })}
											>
												{dataCategory.map((item, index) => (
													<Option key={index} value={item.ID}>
														{item.CategoryName}
													</Option>
												))}
											</Select>
										</Form.Item>
									</div>

									<div className="col-md-6 col-12">
										<Form.Item
											name="LevelID"
											label={
												<div className="row m-0">
													Tr??nh ?????{' '}
													<Tooltip title="Th??m tr??nh ????? m???i">
														<Button onClick={() => setModalLevel(true)} className="btn btn-primary btn-vc-create ml-1">
															<div style={{ marginTop: -2 }}>+</div>
														</Button>
													</Tooltip>
												</div>
											}
											rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}
										>
											<Select
												style={{ width: '100%' }}
												className="style-input"
												showSearch
												placeholder="Ch???n tr??nh ?????..."
												optionFilterProp="children"
												onChange={(e: number) => form.setFieldsValue({ LevelID: e })}
											>
												{dataLevel.map((item: any, index: number) => (
													<Option key={index} value={item.ID}>
														{item.LevelName}
													</Option>
												))}
											</Select>
										</Form.Item>
									</div>

									<div className="col-md-6 col-12">
										<Form.Item name="OriginalPrice" label="Gi?? g???c" rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}>
											<NumberFormat
												className="ant-input style-input w-100"
												onChange={(e: any) => form.setFieldsValue({ OriginalPrice: e.target.value })}
												thousandSeparator={true}
											/>
										</Form.Item>
									</div>

									<div className="col-md-6 col-12">
										<Form.Item name="SellPrice" label="Gi?? b??n" rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}>
											<NumberFormat
												className="ant-input style-input w-100"
												onChange={(e: any) => form.setFieldsValue({ SellPrice: e.target.value })}
												thousandSeparator={true}
											/>
										</Form.Item>
									</div>

									{/* upload image */}
									<div className="col-md-6 col-12">
										<Form.Item name="Image" label="H??nh ???nh thu nh???">
											<Upload style={{ width: 800 }} className="vc-e-upload" onChange={(e) => handleUploadFile(e)} showUploadList={false}>
												<Button className="vc-e-upload" icon={<UploadOutlined style={{ marginTop: -2 }} />}>
													B???m ????? t???i h??nh ???nh
												</Button>
											</Upload>
											{imageSelected.name !== undefined && imageSelected.name !== '' && (
												<div className="row m-0 mt-3 vc-store-center">
													<Button danger onClick={handleDeleteImage}>
														Xo?? h??nh ???nh
													</Button>
												</div>
											)}
										</Form.Item>
										<p className="font-weight-primary mb-4" style={{ color: 'red' }}>
											*L??u ??: Upload t???i ??a 100Mb
										</p>
										<div className="col-12"></div>
									</div>

									<div className="col-md-6 col-12 "></div>

									{previewImage !== '' && (
										<div className="col-md-6 col-12 mb-3" style={{ marginTop: -10 }}>
											<Image className="image_wrapper" src={previewImage} />
										</div>
									)}

									<div className="col-12">
										<Form.Item
											name="Tags"
											label={
												<div className="row m-0">
													T??? kh??a t??m ki???m{' '}
													<Tooltip title="Th??m t??? kh??a t??m ki???m">
														<Button onClick={() => setModalTags(true)} className="btn btn-primary btn-vc-create ml-1">
															<div style={{ marginTop: -2, marginLeft: 1 }}>+</div>
														</Button>
													</Tooltip>
												</div>
											}
											rules={[{ required: true, message: 'B???n kh??ng ???????c ????? tr???ng' }]}
										>
											<Select
												mode="tags"
												className="style-input"
												style={{ width: '100%' }}
												placeholder="T??? kh??a t??m ki???m"
												searchValue=""
												onChange={(e) => handleChange(e)}
											>
												{tags.length > 0 &&
													tags.map((item: any, index: number) => (
														<Option key={index} value={item.ID}>
															{item.Name}
														</Option>
													))}
											</Select>
										</Form.Item>
									</div>
								</div>

								<div className="row p-0 m-0 custom-scroll-bar col-md-6 col-12">
									<div className="row vc-e-d" style={{ height: imageSelected.name === '' ? 605 : 803 }}>
										<div className="col-md-12 col-12">
											<Form.Item name="Slogan" label="Slogan">
												<EditorSimple
													defaultValue={slogan}
													handleChange={(e) => setSlogan(e)}
													isTranslate={false}
													isSimpleTool={true}
													height={80}
												/>
											</Form.Item>
										</div>
										<div className="col-md-12 col-12">
											<Form.Item name="Requirements" label="??i???u ki???n h???c">
												<EditorSimple
													defaultValue={requirements}
													handleChange={(e) => setRequirements(e)}
													isTranslate={false}
													isSimpleTool={true}
													height={80}
												/>
											</Form.Item>
										</div>
										<div className="col-md-12 col-12">
											<Form.Item name="CourseForObject" label="?????i t?????ng h???c">
												<EditorSimple
													defaultValue={courseForObject}
													handleChange={(e) => setCourseForObject(e)}
													isTranslate={false}
													isSimpleTool={true}
													height={80}
												/>
											</Form.Item>
										</div>
										<div className="col-md-12 col-12">
											<Form.Item name="ResultsAchieved" label="N???i dung kh??a h???c">
												<EditorSimple
													defaultValue={resultsAchieved}
													handleChange={(e) => setResultsAchieved(e)}
													isTranslate={false}
													isSimpleTool={true}
													height={80}
												/>
											</Form.Item>
										</div>
										<div className="col-md-12 col-12">
											<Form.Item name="Description" label="M?? t???">
												<EditorSimple
													defaultValue={description}
													handleChange={(e) => setDescription(e)}
													isTranslate={false}
													isSimpleTool={true}
													height={80}
												/>
											</Form.Item>
										</div>
									</div>
								</div>
							</div>

							<div className="footer">
								<div className="row">
									<div className="col-12" style={{ justifyContent: 'flex-end', display: 'flex' }}>
										<button onClick={() => setIsModalVisible(false)} className="btn btn-warning mr-3">
											Hu???
										</button>
										<button type="submit" className="btn btn-primary">
											T???o kh??a h???c {loading && <Spin className="loading-base" />}
											{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
										</button>
									</div>
								</div>
							</div>
						</Form>
					</div>
				</Modal>
			</div>
		</>
	)
})

export default ModalCreateVideoCourse

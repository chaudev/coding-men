import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Modal, Spin, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { Trash2 } from 'react-feather'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { packageCategoryApi } from '~/apiBase/package/pakage-category'
import InputTextField from '~/components/FormControl/InputTextField'
import { useWrap } from '~/context/wrap'

export default function PakegeCategoryForm(props) {
	const { mode, dataRow, SetPackageID, onFetchData } = props
	const [isModalVisible, setIsModalVisible] = useState(false)
	const openModal = () => setIsModalVisible(true)
	const closeModal = () => {
		if (mode === 'add') {
			form.reset()
		}
		if (mode === 'edit') {
			form.reset({
				Name: dataRow.Name
			})
		}
		setIsModalVisible(false)
	}
	const [isLoading, setIsLoading] = useState(false)
	const { showNoti } = useWrap()

	const schema = yup.object().shape({
		Name: yup.string().required('Bạn không được để trống')
	})

	const defaultValuesInit = {
		Name: ''
	}

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	})

	useEffect(() => {
		if (dataRow) {
			form.reset({
				Name: dataRow.Name
			})
		}
	}, [dataRow])

	const checkHandleSubmit = async (data) => {
		let res = null
		setIsLoading(true)
		try {
			if (mode === 'add') {
				res = await packageCategoryApi.add({ SetPackageID: SetPackageID, Name: data.Name })
			}
			if (mode === 'edit') {
				res = await packageCategoryApi.update({ ID: dataRow.ID, Name: data.Name })
			}
			if (mode === 'delete') {
				res = await packageCategoryApi.update({ ID: dataRow.ID, Enable: false })
			}
			if (res.status === 200) {
				onFetchData && onFetchData()
				setIsModalVisible(false)
				showNoti('success', res.data.message)
				form.reset()
			}
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setIsModalVisible(false)
			setIsLoading(false)
		}
	}

	return (
		<>
			{mode === 'add' && (
				<button className="btn btn-warning add-new" onClick={openModal}>
					Thêm dạng đề
				</button>
			)}
			{mode === 'edit' && (
				<Tooltip title="Sửa dạng đề">
					<button className="btn btn-icon edit" onClick={openModal}>
						<i className="fas fa-edit" style={{ color: '#34c4a4', fontSize: 16, marginBottom: -1 }}></i>
					</button>
				</Tooltip>
			)}
			{mode === 'delete' && (
				<Tooltip title="Xóa dạng đề">
					<button className="btn btn-icon delete" onClick={openModal}>
						<Trash2 />
					</button>
				</Tooltip>
			)}
			<Modal title="Thêm dạng đề" visible={isModalVisible} footer={null} onCancel={closeModal}>
				<div className="wrap-form">
					<Form layout="vertical" onFinish={form.handleSubmit(checkHandleSubmit)}>
						{mode === 'delete' ? (
							<div className="row">
								<div className="col-12">
									<h4 className="text-center">Bạn có chắc muốn xóa dạng đề này?</h4>
								</div>
								<div className="col-12 mt-3 " style={{ textAlign: 'center' }}>
									<button type="submit" className="btn btn-primary" disabled={isLoading}>
										Xóa
										{isLoading && <Spin className="loading-base" />}
									</button>
								</div>
							</div>
						) : (
							<div className="row">
								<div className="col-12">
									<InputTextField form={form} name="Name" label="Tên dạng bộ đề" placeholder="Nhập dạng tên bộ đề" />
								</div>
								<div className="col-12 mt-3 " style={{ textAlign: 'center' }}>
									<button type="submit" className="btn btn-primary" disabled={isLoading}>
										{mode === 'add' ? 'Khởi tạo' : 'Sửa'}
										{isLoading && <Spin className="loading-base" />}
									</button>
								</div>
							</div>
						)}
					</Form>
				</div>
			</Modal>
		</>
	)
}

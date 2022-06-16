import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Modal, Spin, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { Trash2 } from 'react-feather'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { packageDetailApi } from '~/apiBase/package/package-detail'
import RadioField from '~/components/FormControl/RadioField'
import SelectField from '~/components/FormControl/SelectField'
import { useWrap } from '~/context/wrap'

PackageDetailForm.propTypes = {
	dataRow: PropTypes.shape({
		ID: PropTypes.number,
		Name: PropTypes.string,
		Avatar: PropTypes.string,
		Level: PropTypes.number,
		Type: PropTypes.number,
		TypeName: PropTypes.string,
		Price: PropTypes.number
	}),
	mode: PropTypes.string,
	onFetchData: PropTypes.func,
	SetPackageID: PropTypes.number,
	SetPackageCategoryID: PropTypes.number,
	optionExamTopicList: PropTypes.shape({
		title: PropTypes.string,
		Value: PropTypes.number,
		Option: PropTypes.object
	})
}
PackageDetailForm.defaultProps = {
	dataRow: {},
	mode: ''
}

const skillList = [
	{
		label: 'Listening',
		value: 1
	},
	{
		label: 'Speaking',
		value: 2
	},
	{
		label: 'Reading',
		value: 3
	},
	{
		label: 'Writing',
		value: 4
	}
]

function PackageDetailForm(props) {
	const { dataRow, mode, optionExamTopicList, SetPackageCategoryID, SetPackageID, onFetchData } = props
	const [isModalVisible, setIsModalVisible] = useState(false)
	const { showNoti } = useWrap()
	const openModal = () => setIsModalVisible(true)
	const closeModal = () => setIsModalVisible(false)
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	})

	const schema = yup.object().shape({
		Skill: yup.number().required('Bạn không được để trống'),
		ExamTopicID: yup.number().nullable().required('Bạn không được để trống')
	})

	const defaultValuesInit = {
		Skill: '',
		ExamTopicID: null
	}

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	})

	useEffect(() => {
		if (dataRow) {
			form.reset(dataRow)
		}
	}, [dataRow])

	const checkHandleSubmit = (data: any) => {
		if (mode === 'add') {
			onCreatePackageDetail(data)
		}
	}

	const onCreatePackageDetail = async (data) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		})
		try {
			const res = await packageDetailApi.add({
				SetPackageID: SetPackageID,
				SetPackageCategoryID: SetPackageCategoryID,
				Skill: data.Skill,
				ExamTopicID: data.ExamTopicID
			})
			if (res.status === 200) {
				setIsModalVisible(false)
				showNoti('success', res.data.message)
				onFetchData && onFetchData()
			}
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			})
		}
	}

	const onUpdatePakageDetail = async () => {
		console.log('delete')
		let res = null
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		})
		try {
			res = await packageDetailApi.update({ ID: dataRow.ID, Enable: false })
			if (res.status === 200) {
				showNoti('success', res.data.message)
				onFetchData && onFetchData()
				setIsModalVisible(false)
			}
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			})
		}
	}

	return (
		<>
			{mode === 'add' && (
				<button className="btn btn-warning" onClick={openModal} type="button">
					Thêm đề
				</button>
			)}
			{mode === 'edit' && (
				<Tooltip title="Sửa dạng đề">
					<button className="btn btn-icon edit" onClick={openModal} type="button">
						<i className="fas fa-edit" style={{ color: '#34c4a4', fontSize: 16, marginBottom: -1 }}></i>
					</button>
				</Tooltip>
			)}
			{mode === 'delete' && (
				<Tooltip title="Xóa dạng đề">
					<button className="btn btn-icon delete" onClick={openModal} type="button">
						<Trash2 />
					</button>
				</Tooltip>
			)}
			<Modal title={mode == 'add' ? 'Thêm đề ' : 'Thêm đề '} visible={isModalVisible} footer={null} onCancel={closeModal}>
				<div className="wrap-form">
					<Form layout="vertical" onFinish={form.handleSubmit(checkHandleSubmit)}>
						{mode === 'delete' ? (
							<div className="row">
								<div className="col-12">
									<h4 className="text-center">Bạn có chắc muốn xóa đề này?</h4>
								</div>
								<div className="col-12 mt-3 " style={{ textAlign: 'center' }}>
									<button
										type="submit"
										className="btn btn-primary"
										disabled={isLoading.type == 'ADD_DATA' && isLoading.status}
										onClick={() => onUpdatePakageDetail()}
									>
										Xóa
										{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
									</button>
								</div>
							</div>
						) : (
							<>
								<div className="row">
									<div className="col-12">
										<SelectField form={form} optionList={optionExamTopicList} name="ExamTopicID" label="Đề " placeholder="Chọn đề " />
									</div>
									<div className="col-12">
										<RadioField form={form} name="Skill" label="Kĩ năng" radioList={skillList} handleChange={(typeID) => {}} />
									</div>
									<div className="col-12 mt-3 " style={{ textAlign: 'center' }}>
										<button type="submit" className="btn btn-primary" disabled={isLoading.type == 'ADD_DATA' && isLoading.status}>
											{mode === 'add' ? 'Khởi tạo' : 'Sửa'}
											{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
										</button>
									</div>
								</div>
							</>
						)}
					</Form>
				</div>
			</Modal>
		</>
	)
}

export default PackageDetailForm

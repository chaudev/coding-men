import { Card, Checkbox, Popconfirm, Spin, Table, Tabs, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { CheckCircle } from 'react-feather'
import { useForm } from 'react-hook-form'
import { teacherApi } from '~/apiBase'
import PowerTable from '~/components/PowerTable'
import { useWrap } from '~/context/wrap'
import ConfirmAssignModal from './Teacher/ConfirmAssignModal'

const TeacherProfile = (props: any) => {
	const { isLoading, userID, dataSubject, updateTeacherForSubject, onFetchData } = props

	const [loading, setLoading] = useState({ type: '', status: false })
	const { setValue } = useForm()
	const { showNoti } = useWrap()

	const onAssign = async (CurriculumID: number) => {
		setLoading({ type: '', status: true })
		try {
			const res = await teacherApi.assign({ CurriculumID: CurriculumID, TeacherID: userID })
			res?.status == 200 && onFetchData(), showNoti('success', 'Thay đổi thành công!')
		} catch (error) {
			showNoti('danger', 'Thay đổi thất bại!')
			console.log('error: ', error)
		} finally {
			setLoading({ type: '', status: false })
		}
	}

	const columns = [
		{
			title: 'Giáo trình',
			width: 200,
			dataIndex: 'CurriculumName',
			render: (text: string) => <p className="font-weight-primary">{text}</p>
		},
		{
			title: 'Trạng thái',
			align: 'center',
			dataIndex: 'Enable',
			render: (text: string, data: any) => (
				<p className={data.Enable ? 'tag green' : 'tag red'}>{data.Enable ? 'Được phép dạy' : 'Không được phép dạy'}</p>
			)
		},
		{
			title: 'Thao tác',
			width: 100,
			align: 'center',
			render: (text: string, data: any) => {
				return (
					<>
						<Tooltip title={data?.Enable ? 'Không cho phép dạy' : 'Cho phép dạy'}>
							<Checkbox checked={data.Enable} onChange={() => onAssign(data?.CurriculumID)} />
						</Tooltip>
					</>
				)
			}
		}
	]

	const handleSubmitAssignment = async (info: any) => {
		setLoading({ type: 'ASSIGN_TEACHER', status: true })
		try {
			let res = await teacherApi.updateTeacherForAllSubject({
				teacherId: userID,
				programId: info.key,
				IsSelected: info.IsSelected ? false : true
			})
			if (res.status === 200) {
				showNoti('success', 'Thay đổi thành công!')
				onFetchData && onFetchData()
				return true
			}
			if (res.status === 204) {
				showNoti('danger', 'Chưa có môn học trong chương trình này!')
				onFetchData && onFetchData()
				return true
			}
		} catch (error) {
		} finally {
			setLoading({ type: 'ASSIGN_TEACHER', status: false })
		}
	}

	const expandedRowRender = (record) => {
		const columns = []
		const data = [
			{
				Subject: 'Subject'
			}
		]

		for (let i = 0; i < Object.keys(record.Subject).length; i++) {
			columns.push({
				key: record.Subject[i].SubjectID,
				title: record.Subject[i].SubjectName,
				dataIndex: 'Subject',
				render: () => (
					<Checkbox value={record.Subject[i].SubjectID} checked={record.Subject[i].IsSelected ? true : false} onChange={onChangeCheckBox} />
				)
			})
		}

		const onChangeCheckBox = (e) => {
			const data = { UserInformationID: userID, SubjectID: e.target.value }
			let res = updateTeacherForSubject(data)
			res.then(function (rs: any) {
				rs && rs.status == 200
			})
		}

		if (Object.keys(record.Subject).length) {
			return (
				<div className="mini-table">
					<Table columns={columns} dataSource={data} pagination={false} className="tb-expand" />
				</div>
			)
		} else {
			return <p>Chưa có môn học</p>
		}
	}

	useEffect(() => {
		setValue('UserInformationID', userID)
	}, [])

	if (!!isLoading.status || !!loading.status) {
		return (
			<>
				<Card className="space-top-card text-center">
					<Spin></Spin>
				</Card>
			</>
		)
	} else {
		return (
			<>
				<Card className="space-top-card">
					<div className="">
						<div className="wrap-table table-expand">
							<PowerTable
								className="teacher-detail-table"
								dataSource={dataSubject}
								columns={columns}
								size="middle"
								scroll={{ x: 600 }}
								expandable={{
									expandedRowRender: (record: any) => expandedRowRender(record)
								}}
								pagination={false}
							/>
						</div>
					</div>
				</Card>
			</>
		)
	}
}

export default TeacherProfile

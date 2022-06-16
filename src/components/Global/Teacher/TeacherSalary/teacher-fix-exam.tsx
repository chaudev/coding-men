import React, { useState, useEffect } from 'react'
import { Tooltip, Modal } from 'antd'
import { numberWithCommas } from '~/utils/functions'
import { useWrap } from '~/context/wrap'
import PowerTable from '~/components/PowerTable'
import { teacherSalaryApi } from '~/apiBase/staff-manage/teacher-salary'
import moment from 'moment'

const TeacherFixExam = ({ price, record }) => {
	const [visible, setVisible] = useState(false)
	const [dataSource, setDataSource] = useState<ITeacherSalaryFixExam[]>([])
	const { showNoti, pageSize } = useWrap()
	const defaultParams = {
		pageIndex: 1,
		pageSize: pageSize,
		sortType: true,
		selectAll: true,
		SalaryOfTeacherID: record.ID
	}

	const columns = [
		{
			title: 'Giáo viên',
			width: 150,
			dataIndex: 'TeacherName',
			render: (price, record) => <p className="font-weight-primary">{price}</p>
		},
		{
			title: 'Môn học',
			width: 100,
			dataIndex: 'SetPackageName',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Buổi học',
			width: 100,
			dataIndex: 'ExamTopicName',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Tên học viên',
			width: 150,
			dataIndex: 'StudentName',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Thời gian chấm bài',
			width: 150,
			dataIndex: 'CreateOn',
			render: (price, record) => <p>{moment(price).format('DD-MM-YYYY')}</p>
		}
	]

	const getDataSource = async () => {
		try {
			let res = await teacherSalaryApi.getFixExam(defaultParams)
			console.log(res.data.data)
			setDataSource(res.data.data)
		} catch (error) {}
	}

	useEffect(() => {
		if (visible) {
			getDataSource()
		}
	}, [visible])

	return (
		<>
			<button className="font-weight-primary btn btn-icon edit" onClick={() => setVisible(true)}>
				<Tooltip title="Xem chi tiết">
					<button className="custom-btn-shit-2">{!!price ? numberWithCommas(price) : 0}</button>
				</Tooltip>
			</button>

			<Modal width={800} title="Chi tiết lương chấm bài" visible={visible} onCancel={() => setVisible(false)} footer={false}>
				<PowerTable columns={columns} dataSource={dataSource}></PowerTable>
			</Modal>
		</>
	)
}

export default TeacherFixExam

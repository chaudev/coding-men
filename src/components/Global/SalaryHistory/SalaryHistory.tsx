import React, { useState, useEffect } from 'react'
import { courseExamApi } from '~/apiBase/package/course-exam'
import { useWrap } from '~/context/wrap'
import Link from 'next/link'
import NestedTable from '~/components/Elements/NestedTable'
import { Tooltip } from 'antd'
import { ExclamationCircleOutlined, FormOutlined } from '@ant-design/icons'
import { staffSalaryApi, teacherApi } from '~/apiBase'
import { parseToMoney } from '~/utils/functions'
import moment from 'moment'

const SalaryHistory = (props) => {
	const { ID } = props
	// ------ BASE USESTATE TABLE -------
	const [dataSource, setDataSource] = useState<IStaffSalaryHistory[]>([])
	const { showNoti, pageSize, userInformation } = useWrap()
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [totalPage, setTotalPage] = useState(null)
	const [indexRow, setIndexRow] = useState(null)
	const [currentPage, setCurrentPage] = useState(1)

	const [dataTeacher, setDataTeacher] = useState([])

	useEffect(() => {
		getDataSource()
	}, [])

	// GET DATA SOURCE
	const getDataSource = async () => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			let res = await staffSalaryApi.getHistory(ID)
			if (res.status == 200) {
				setDataSource(res.data.data)
				setTotalPage(res.data.totalRow)
			}
			res.status == 204 && setDataSource([])
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false })
		}
	}

	const columns = [
		{
			title: 'Lương cũ',
			dataIndex: 'SalaryOld',
			render: (value) => <div className="bold disable-text">{!!value && parseToMoney(value)}</div>
		},
		{
			title: 'Lương mới',
			dataIndex: 'SalaryNew',
			render: (value) => <div className="bold primary">{!!value && parseToMoney(value)}</div>
		},
		{
			title: 'Ghi chú',
			dataIndex: 'Note'
		},
		{
			title: 'Ngày',
			dataIndex: 'CreatedOn',
			render: (value) => <div>{!!value && moment(value).format('DD/MM/YYYY')}</div>
		},
		{
			title: 'Sửa bởi',
			dataIndex: 'CreatedBy'
		}
	]

	return (
		<>
			<NestedTable
				currentPage={currentPage}
				totalPage={totalPage && totalPage}
				pagination={false}
				loading={isLoading}
				addClass="basic-header"
				TitlePage=""
				dataSource={dataSource}
				columns={columns}
			/>
		</>
	)
}

export default SalaryHistory

import { Select, DatePicker } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { teacherSalaryApi } from '~/apiBase/staff-manage/teacher-salary'
import ExpandTable from '~/components/ExpandTable'
import LayoutBase from '~/components/LayoutBase'
import { useWrap } from '~/context/wrap'
import { numberWithCommas } from '~/utils/functions'
import SalaryOfTeacherDetail from '../../../components/Global/Teacher/TeacherSalary/salary-of-teacher-detail'
import ConfirmForm from '../../../components/Global/Teacher/TeacherSalary/teacher-confirm-form'
import TeacherFixExam from '../../../components/Global/Teacher/TeacherSalary/teacher-fix-exam'

const now = new Date()

const SalaryReview = () => {
	const [totalPage, setTotalPage] = useState(null)
	const [payRoll, setPayRoll] = useState<ITeacherSalary[]>([])
	const [currentPage, setCurrentPage] = useState(1)
	const { showNoti, userInformation, pageSize } = useWrap()
	const [isLoading, setIsLoading] = useState({ type: 'GET_ALL', status: false })

	const getLastYear = () => {
		return now.getMonth() == 0 ? now.getFullYear() - 1 : now.getFullYear()
	}

	const getDateNumber = (number) => {
		return number > 10 ? number : number == 0 ? '12' : '0' + number
	}

	const paramDefault = {
		pageIndex: currentPage,
		pageSize: pageSize,
		sortType: true,
		selectAll: true,
		Year: getLastYear(),
		Month: getDateNumber(now.getMonth()),
		TeacherName: null,
		TeacherID: null,
		StatusID: null
	}
	const [params, setParams] = useState(paramDefault)

	const getDataPayroll = async (page: any) => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			let res = await teacherSalaryApi.getAll({ ...params, pageIndex: page })
			if (res.status == 200) {
				setPayRoll(res.data.data)
			}
			if (res.status == 204) {
				setPayRoll([])
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false })
		}
	}

	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber)
		setParams({ ...params, pageIndex: currentPage })
	}

	const onChangeMonth = (value) => {
		setParams({ ...params, Month: Number(value.getMonth() + 1), Year: Number(value.getFullYear()) })
	}

	useEffect(() => {
		getDataPayroll(currentPage)
	}, [params, userInformation])

	const columns = [
		{
			title: 'Lương cơ bản',
			width: 150,
			dataIndex: 'BasicSalary',
			render: (price, record: ITeacherSalary) => <p>{numberWithCommas(price)}</p>
		},
		{
			title: 'Lương tháng',
			width: 150,
			dataIndex: 'Salary',
			render: (price, record: ITeacherSalary) => <SalaryOfTeacherDetail price={price} record={record} />
		},
		{
			title: 'Lương chấm bài',
			width: 150,
			dataIndex: 'SalaryFixExam',
			render: (price, record: ITeacherSalary) => <TeacherFixExam price={price} record={record} />
		},
		{
			title: 'Thưởng',
			width: 150,
			dataIndex: 'Bonus',
			render: (price, record: ITeacherSalary) => <p>{numberWithCommas(price)}</p>
		},
		{
			title: 'Trạng thái',
			width: 200,
			dataIndex: 'StatusName',
			render: (price, record: any) => (
				<>
					{record.StatusID == 1 && <span className="tag red">{price}</span>}
					{record.StatusID == 3 && <span className="tag yellow">{price}</span>}
					{record.StatusID == 4 && <span className="tag blue">{price}</span>}
					{record.StatusID == 5 && <span className="tag green">{price}</span>}
				</>
			)
		},
		{
			title: 'Khấu trừ',
			width: 150,
			dataIndex: 'AdvanceSalary',
			render: (price, record: ITeacherSalary) => <p>{numberWithCommas(price)}</p>
		},
		{
			title: 'Lương tổng',
			width: 150,
			dataIndex: 'TotalSalary',
			render: (price, record: ITeacherSalary) => <p>{numberWithCommas(price)}</p>
		},
		{
			title: 'Cập nhật',
			align: 'right',
			render: (text, record) => <ConfirmForm record={record} setParams={setParams} params={params} />
		}
	]

	const expandedRowRender = (data, index) => {
		return (
			<div className="row m-0 p-0">
				<div className="bold mr-2">Ghi chú:</div>
				<div>{data?.NoteBonus}</div>
			</div>
		)
	}

	return (
		<ExpandTable
			currentPage={currentPage}
			loading={isLoading}
			totalPage={totalPage && totalPage}
			getPagination={(pageNumber: number) => getPagination(pageNumber)}
			addClass="basic-header"
			TitlePage="Bảng lương giáo viên"
			dataSource={payRoll}
			columns={columns}
			expandable={{ expandedRowRender }}
			Extra={
				<DatePicker
					defaultValue={moment(new Date(getLastYear() + '-' + getDateNumber(now.getMonth())), 'MM/yyyy')}
					onChange={(e: any, a) => {
						onChangeMonth(e._d)
					}}
					picker="month"
					style={{ borderRadius: 6, height: 34 }}
				/>
			}
		/>
	)
}
SalaryReview.layout = LayoutBase
export default SalaryReview

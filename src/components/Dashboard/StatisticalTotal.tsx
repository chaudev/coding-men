import { Card, Skeleton, Select, DatePicker } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { statisticalApi } from '~/apiBase/statistical/statistical-total'
import ChartCard from './ChartCard'

const StatisticalTotalDefault = {
	Warning: 0,
	Prewarning: 0,
	AverageView: 0,
	CompleteHomework: 0,
	PrecompleteHomework: 0,
	NotDonePaidCoursePrice: 0,
	PrenotDonePaidCoursePrice: 0,
	TotalVideoViews: 0,
	PretotalVideoViews: 0,
	VideoCourseRevenue: 0,
	PrevideoCourseRevenue: 0,
	ExamAppointmentResultNotDone: 0,
	CourseExamresultNotDone: 0,
	SetPackageResultNotDone: 0,
	DonePaidCoursePrice: 0,
	PredonePaidCoursePrice: 0,
	CourseSecond3Month: 0,
	Customer: 0,
	PreCustomer: 0,
	TestAppointment: 0,
	PreTestAppointment: 0,
	TestDone: 0,
	PreTestDone: 0,
	RegisterAppointment: 0,
	PreRegisterAppointment: 0,
	Studying: 0,
	PreStudying: 0,
	Reserve: 0,
	Prereserve: 0,
	Changecourse: 0,
	PreChangecourse: 0,
	Teacher: 0,
	PreTeacher: 0,
	Employee: 0,
	PreEmployee: 0,
	Submittopic: 0,
	Marktopic: 0,
	Remaketopic: 0,
	Enable: true,
	CreatedOn: '',
	CreatedBy: '',
	ModifiedOn: '',
	ModifiedBy: ''
}

export default function StatisticalTotal() {
	const [statisticalTotal, setStatisticalTotal] = useState<IStatistical>(StatisticalTotalDefault)
	const { Option } = Select
	const [mode, setMode] = useState(1)
	const [isLoading, setIsLoading] = useState({ status: '', loading: false })
	const [todoApi, setTodoApi] = useState({
		branch: 0,
		StartYear: 2017,
		EndYear: 2022,
		Year: new Date().getFullYear(),
		Month: new Date().getMonth() + 1
	})
	const listMode = [
		{ title: 'Thống kê trung tâm', value: 1 },
		{ title: 'Thống kê chi tiết', value: 2 }
	]

	const getStatisticalTotal = async () => {
		setIsLoading({ status: 'STAT_GET_ALL', loading: true })
		try {
			let res: any = await statisticalApi.getStatisticalTotal(todoApi)
			if (res?.status == 200) {
				setStatisticalTotal(res.data.data)
			}
			if (res?.status == 204) {
				setStatisticalTotal(null)
			}
		} catch (error) {
		} finally {
			setIsLoading({ status: 'STAT_GET_ALL', loading: false })
		}
	}

	const now = new Date()

	const getLastYear = () => {
		return now.getMonth() == 0 ? now.getFullYear() - 1 : now.getFullYear()
	}

	const getDateNumber = (number: any) => {
		return number > 10 ? number : number == 0 ? '12' : '0' + number
	}

	const handleChangeType = (value: any) => {
		setMode(value)
	}

	useEffect(() => {
		getStatisticalTotal()
	}, [])

	return (
		<>
			{isLoading.status === 'STAT_GET_ALL' && isLoading.loading == true ? (
				<Skeleton active />
			) : (
				<>
					<Card
						title="Sắp xếp lịch học"
						extra={
							<>
								<div className="d-flex">
									{mode === 2 && (
										<DatePicker
											defaultValue={moment(new Date(getLastYear() + '-' + getDateNumber(now.getMonth())), 'MM/yyyy')}
											onChange={(e: any, a: any) => {}}
											picker="month"
											className="style-input mr-2"
											style={{ width: 150 }}
										/>
									)}
									<Select style={{ width: 200 }} defaultValue="Chọn loại" className="style-input" onChange={handleChangeType}>
										{listMode.map((item, index) => (
											<Option value={item.value} key={index}>
												{item.title}
											</Option>
										))}
									</Select>
								</div>
							</>
						}
					>
						<div className="row">
							<div className="mb-6 col-xl-3 col-md-4 col-sm-4 col-12">
								<ChartCard typeChart={3} styleName="up" title="Học viên hẹn test" statisticalTotal={statisticalTotal} />
							</div>
							<div className="mb-6 col-xl-3 col-md-4 col-sm-4 col-12">
								<ChartCard typeChart={1} title="Học viên đến test" styleName="up" statisticalTotal={statisticalTotal} />
							</div>
							<div className="mb-4 col-xl-3 col-md-4 col-sm-4 col-12">
								<ChartCard typeChart={3} styleName="up" title="Bài tập đã nộp" statisticalTotal={statisticalTotal} />
							</div>
							<div className="mb-4 col-xl-3 col-md-4 col-sm-4 col-12">
								<ChartCard typeChart={1} title="Bài đã chấm" styleName="down" statisticalTotal={statisticalTotal} />
							</div>
							<div className="mb-4 col-xl-3 col-md-4 col-sm-4 col-12">
								<ChartCard typeChart={2} styleName="up" title="Giáo viên" statisticalTotal={statisticalTotal} />
							</div>
							<div className="mb-4 col-xl-3 col-md-4 col-sm-4 col-12">
								<ChartCard typeChart={3} styleName="up" title="Nhân viên" statisticalTotal={statisticalTotal} />
							</div>
							<div className="mb-4 col-xl-3 col-md-4 col-sm-4 col-12">
								<ChartCard typeChart={1} styleName="up" title="Doanh thu khóa học video" statisticalTotal={statisticalTotal} />
							</div>
							<div className="mb-4 col-xl-3 col-md-4 col-sm-4 col-12">
								<ChartCard typeChart={2} styleName="up" title="Lượt xem khóa học video" statisticalTotal={statisticalTotal} />
							</div>
						</div>
					</Card>
				</>
			)}
		</>
	)
}

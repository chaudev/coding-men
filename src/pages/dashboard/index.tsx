import React from 'react'
import TitlePage from '~/components/TitlePage'
import LayoutBase from '~/components/LayoutBase'
import dynamic from 'next/dynamic'

const DynamicStatisticalRate = dynamic(() => import('~/components/Dashboard/StatisticalRate'))
const DynamicStatisticalTotal = dynamic(() => import('~/components/Dashboard/StatisticalTotal'))
const DynamicStatisticalRevenue = dynamic(() => import('~/components/Dashboard/RevenueChart'))
const DynamicStatisticalAcademic = dynamic(() => import('~/components/Dashboard/AcademicChart'))
const DynamicStatisticalJobOfStudent = dynamic(() => import('~/components/Dashboard/StatisticalJobOfStudent'))
const DynamicStatisticalCoursePurchases = dynamic(() => import('~/components/Dashboard/StatisticalCoursePurchases'))
const DynamicStatisticalRateVideoCourse = dynamic(() => import('~/components/Dashboard/StatisticalRateVideoCourse'))
const DynamicStatisticalAverageAgeOfStudent = dynamic(() => import('~/components/Dashboard/StatisticalAverageAgeOfStudent'))
const DynamicStatisticalPercentOfStudentByArea = dynamic(() => import('~/components/Dashboard/StatisticalPercentOfStudentByArea'))
const DynamicStatisticalPercentOfStudentBySource = dynamic(() => import('~/components/Dashboard/StatisticalPercentOfStudentBySource'))

const Dashboard = () => {
	return (
		<div>
			<TitlePage title="Thống kê" />
			<DynamicStatisticalTotal />
			<div className="mt-5">
				<DynamicStatisticalAcademic />
			</div>
			<div className="row mt-5">
				<DynamicStatisticalRate />
				<DynamicStatisticalRateVideoCourse />
			</div>
			<DynamicStatisticalAverageAgeOfStudent />
			<DynamicStatisticalPercentOfStudentByArea />
			<DynamicStatisticalPercentOfStudentBySource />
			<DynamicStatisticalCoursePurchases />
			<DynamicStatisticalJobOfStudent />
			<DynamicStatisticalRevenue />
		</div>
	)
}

Dashboard.layout = LayoutBase
export default Dashboard

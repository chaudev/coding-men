import React, { useEffect, useState } from 'react'
import { packageDetailApi } from '~/apiBase/package/package-detail'
import NestedTable from '~/components/Elements/NestedTable'
import { useWrap } from '~/context/wrap'
import PackageDetailForm from './PackageDetailForm/PackageDetailForm'

export default function PackageCategoryDetail(props) {
	const { data, optionExamTopicList, SetPackageID } = props
	const [dataSource, setDataSource] = useState<ISetPackageDetail[]>()
	const [totalPage, setTotalPage] = useState(null)
	const { showNoti, pageSize } = useWrap()
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	})
	const [filters, setFilters] = useState({
		pageIndex: 1,
		pageSize: pageSize,
		SetPackageCategoryID: data.ID
	})

	const columns = [
		{
			title: 'Tên đề',
			dataIndex: 'ExamTopicName'
		},
		{
			title: 'Thời gian',
			dataIndex: 'Time',
			render: (time) => `${time} phút`
		},
		{
			title: 'Hình thức',
			dataIndex: 'TypeName'
		},
		{
			title: 'Thao tác',
			dataIndex: 'Action',
			render: (a, record) => {
				return (
					<>
						<PackageDetailForm
							dataRow={record}
							mode="delete"
							optionExamTopicList={optionExamTopicList}
							SetPackageCategoryID={data.ID}
							onFetchData={() => setFilters({ ...filters })}
						/>
					</>
				)
			}
		}
	]

	// PAGINATION
	const getPagination = (pageIndex: number, pageSize: number) => {
		if (!pageSize) pageSize = 10
		setFilters({
			...filters,
			pageIndex: pageIndex
		})
	}

	// GET DATA IN FIRST TIME
	const getDataSource = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		})
		try {
			let res = await packageDetailApi.getAll(filters)
			if (res.status === 200) {
				if (res.data.totalRow && res.data.data.length) {
					setDataSource(res.data.data)
					setTotalPage(res.data.totalRow)
				}
			} else if (res.status === 204) {
				showNoti('danger', 'Không tìm thấy')
			}
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			})
		}
	}

	useEffect(() => {
		getDataSource()
	}, [data, filters])

	return (
		<>
			<NestedTable
				loading={isLoading}
				currentPage={filters.pageIndex}
				totalPage={totalPage}
				getPagination={getPagination}
				addClass="basic-header"
				dataSource={dataSource}
				columns={columns}
				TitleCard={
					<>
						<PackageDetailForm
							mode="add"
							optionExamTopicList={optionExamTopicList}
							SetPackageCategoryID={data.ID}
							SetPackageID={SetPackageID}
							onFetchData={() => setFilters({ ...filters })}
						/>
					</>
				}
			/>
		</>
	)
}

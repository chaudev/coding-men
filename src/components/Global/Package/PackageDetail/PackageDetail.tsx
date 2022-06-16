import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { examTopicApi, packageApi } from '~/apiBase'
import { packageCategoryApi } from '~/apiBase/package/pakage-category'
import ExpandTable from '~/components/ExpandTable'
import { useWrap } from '~/context/wrap'
import { fmSelectArr } from '~/utils/functions'
import PackageCategoryDetail from './PackageCategoryDetail'
import PakegeCategoryForm from './PakageCategoryForm'

const PackageDetail = () => {
	const router = useRouter()
	const { slug: ID } = router.query
	const [packageDetailList, setPackageDetailList] = useState<ISetPackageCategory[]>([])
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	})
	const [totalPage, setTotalPage] = useState(null)
	const { showNoti, pageSize } = useWrap()
	const [packageInfo, setPackageInfo] = useState<IPackage>(null)
	const [optionExamTopicList, setOptionExamTopicList] = useState<IOptionCommon[]>([])
	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: pageSize,

		SetPackageID: ID
	}
	let refValue = useRef({
		pageIndex: 1,
		pageSize: 10
	})
	const [filters, setFilters] = useState(listFieldInit)
	// PAGINATION
	const getPagination = (pageIndex: number, pageSize: number) => {
		if (!pageSize) pageSize = 10
		refValue.current = {
			...refValue.current,
			pageSize,
			pageIndex
		}
		setFilters({
			...filters,
			...refValue.current
		})
	}
	// RESET SEARCH
	const onResetSearch = () => {
		setFilters({
			...listFieldInit,
			pageSize: refValue.current.pageSize
		})
	}

	const fetchPackageDetailList = async () => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			let res = await packageCategoryApi.getDetail(Number(ID))
			if (res.status === 200) {
				setPackageDetailList(res.data.data)
				setTotalPage(res.data.totalRow)
			}
			if (res.status === 204) {
				setPackageDetailList([])
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false })
		}
	}

	const fetchPackage = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		})
		try {
			let res = await packageApi.getByID(ID)
			if (res.status === 200) {
				setPackageInfo(res.data.data)
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
	const fetchExam = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		})
		try {
			let res = await examTopicApi.getAll({ selectAll: true, Type: 2 })
			if (res.status === 200) {
				const fmOptionExamTopicList = fmSelectArr(res.data.data, 'Name', 'ID')
				setOptionExamTopicList(fmOptionExamTopicList)
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
		fetchPackage()
		fetchExam()
	}, [])

	useEffect(() => {
		fetchPackageDetailList()
	}, [filters])

	const columns = [
		{
			title: 'Dạng đề',
			dataIndex: 'Name',
			render: (a) => {
				return <p className="font-weight-black">{a}</p>
			}
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'CreatedOn',
			render: (a) => {
				return <p className="font-weight-black">{moment(a).format('DD/MM/YYYY')}</p>
			}
		},

		{
			align: 'center',
			render: (packageItem: ISetPackageDetail, record, idx) => (
				<>
					<PakegeCategoryForm mode={'edit'} dataRow={record} SetPackageID={ID} onFetchData={() => setFilters({ ...filters })} />
					<PakegeCategoryForm mode={'delete'} dataRow={record} SetPackageID={ID} onFetchData={() => setFilters({ ...filters })} />
				</>
			)
		}
	]

	const expandedRowRender = (data) => {
		return <PackageCategoryDetail data={data} optionExamTopicList={optionExamTopicList} SetPackageID={ID} />
	}

	return (
		<>
			<ExpandTable
				currentPage={filters.pageIndex}
				totalPage={totalPage}
				getPagination={getPagination}
				loading={isLoading}
				Size="package-list-table"
				addClass="basic-header"
				dataSource={packageDetailList}
				columns={columns}
				TitlePage="Danh sách bộ đề"
				TitleCard={<PakegeCategoryForm mode={'add'} SetPackageID={ID} onFetchData={() => setFilters({ ...filters })} />}
				expandable={{ expandedRowRender }}
			/>
		</>
	)
}

export default PackageDetail

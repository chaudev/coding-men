import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useWrap } from '~/context/wrap'
import { subjectApi, programApi } from '~/apiBase'
import SubjectForm from '../SubjectForm'
import PowerTable from '~/components/PowerTable'

let pageIndex = 1

const Subject = (props) => {
	const { key } = props
	const router = useRouter()
	const programID = parseInt(router.query.slug as string)

	const [dataProgram, setDataProgram] = useState<IProgram[]>([])

	const [dataSource, setDataSource] = useState<ISubject[]>([])
	const { showNoti, pageSize, userInformation } = useWrap()
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [totalPage, setTotalPage] = useState(null)
	const [indexRow, setIndexRow] = useState(null)
	const [currentPage, setCurrentPage] = useState(1)
	const listTodoApi = { pageSize: pageSize, pageIndex: pageIndex, ProgramID: programID ? programID : null }
	const [todoApi, setTodoApi] = useState(listTodoApi)

	const getDataSource = async () => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			let res = await subjectApi.getAll(todoApi)
			if (res.status == 200) {
				if (res.data.data.length > 0) {
					setDataSource(res.data.data)
					setTotalPage(res.data.totalRow)
				}
			}
			res.status == 204 && showNoti('danger', 'Không có dữ liệu') && setDataSource([])
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false })
		}
	}

	// GET DATA PROGRAM
	const getDataProgram = async () => {
		try {
			let res = await programApi.getAll(todoApi)
			res.status == 200 && setDataProgram(res.data.data)
			res.status == 204 && showNoti('danger', 'Không có dữ liệu')
		} catch (error) {
			showNoti('danger', error.message)
		}
	}

	const afterPost = (mes: any) => {
		showNoti('success', mes)
		setTodoApi({ ...listTodoApi, pageIndex: 1 })
		setCurrentPage(1)
	}

	const _onSubmit = async (dataSubmit: any) => {
		setIsLoading({ type: 'ADD_DATA', status: true })
		let res = null
		if (dataSubmit.ID) {
			try {
				res = await subjectApi.update(dataSubmit)
				if (res.status == 200) {
					let newDataSource = [...dataSource]
					newDataSource.splice(indexRow, 1, dataSubmit)
					setDataSource(newDataSource)
					showNoti('success', res.data.message)
				}
			} catch (error) {
				showNoti('danger', error.message)
			} finally {
				setIsLoading({ type: 'ADD_DATA', status: false })
			}
		} else {
			try {
				res = await subjectApi.add(dataSubmit)
				res?.status == 200 && afterPost(res.data.message)
			} catch (error) {
				showNoti('danger', error.message)
			} finally {
				setIsLoading({ type: 'ADD_DATA', status: false })
			}
		}
		return res
	}

	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber
		setCurrentPage(pageNumber)
		setTodoApi({ ...todoApi, pageIndex: pageIndex })
	}

	useEffect(() => {
		getDataSource()
	}, [todoApi, key])

	useEffect(() => {
		getDataProgram()
	}, [])

	const columns = [
		{
			title: 'Bài học',
			dataIndex: 'SubjectName',
			key: 'subjectname',
			width: '90%',
			className: 'col-long',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			width: userInformation && userInformation?.RoleID !== 2 ? '10%' : 0,
			align: 'center',
			render: (text, data, index) => (
				<>
					{userInformation && userInformation?.RoleID !== 2 && (
						<SubjectForm
							dataProgram={dataProgram}
							getIndex={() => setIndexRow(index)}
							index={index}
							rowData={data}
							rowID={data.ID}
							isLoading={isLoading}
							_onSubmit={(data: any) => _onSubmit(data)}
						/>
					)}
				</>
			)
		}
	]

	return (
		<div>
			<PowerTable
				currentPage={currentPage}
				totalPage={totalPage && totalPage}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				addClass="table-fix-column table-small"
				loading={isLoading}
				TitleCard={
					userInformation &&
					userInformation?.RoleID !== 2 && (
						<SubjectForm dataProgram={dataProgram} isLoading={isLoading} _onSubmit={(data: any) => _onSubmit(data)} />
					)
				}
				dataSource={dataSource}
				columns={columns}
				Extra="Bài học"
			/>
		</div>
	)
}

export default Subject

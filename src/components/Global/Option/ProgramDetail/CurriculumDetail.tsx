import { Button, Popconfirm, Select, Switch } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { curriculumDetailApi, examTopicApi } from '~/apiBase'
import NestedTable from '~/components/Elements/NestedTable'
import PowerTable from '~/components/PowerTable'
import { useWrap } from '~/context/wrap'
import AddExamForm from './AddExamForm'
import DetailsModal from './DetailsModal'

let pageIndex = 1

const CurriculumDetail = (props) => {
	const { Option } = Select
	const router = useRouter()
	const { courseID: courseID, slug: slug } = router.query
	// const curriculumID = parseInt(router.query.slug as string);
	const { curriculumID, dataSubject, loadingOut, isNested, isFixed } = props
	const [loadingSelect, setLoadingSelect] = useState({ id: null, status: false })

	// ------ BASE USESTATE TABLE -------
	const [dataSource, setDataSource] = useState<ICurriculumDetail[]>([])
	const { showNoti, pageSize, isAdmin } = useWrap()
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [examTopic, setExamTopic] = useState({
		pageIndex: 1,
		pageSize: 100,
		Type: 4 // 4 LÀ BÀI TẬP
	})
	const [totalPage, setTotalPage] = useState(null)
	const [currentPage, setCurrentPage] = useState(1)
	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: pageIndex,
		CurriculumID: curriculumID ? curriculumID : null
	}
	const [todoApi, setTodoApi] = useState(listTodoApi)
	const [dataExamTopic, setDataExamTopic] = useState(null)
	const [currentCheckID, setCurrentCheckID] = useState<number>(null)
	const [loadingCheck, setLoadingCheck] = useState({ id: null, status: false })

	// GET DATA COURSE
	const getDataSource = async () => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			let res = await curriculumDetailApi.getAll(todoApi)
			if (res.status == 200) {
				if (res.data.data.length > 0) {
					setDataSource(res.data.data)
					setTotalPage(res.data.totalRow)
				} else {
					showNoti('danger', 'Không có dữ liệu')
				}
			}
			res.status == 204 && showNoti('danger', 'Không có dữ liệu') && setDataSource([])
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false })
		}
	}

	const updateSubject = async (value, data, index) => {
		let cloneData = { ...data }
		cloneData.SubjectID = value
		setLoadingSelect({ id: data.ID, status: true })
		try {
			let res = await curriculumDetailApi.update({ ID: data.ID, SubjectID: value })
			if (res.status == 200) {
				let newDataSource = [...dataSource]
				newDataSource.splice(index, 1, cloneData)
				setDataSource(newDataSource)
				showNoti('success', res.data.message)
			}
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setLoadingSelect({ id: data.ID, status: false })
		}
	}

	const returnValue = (ID: any) => {
		let value = null
		dataSource.every((item, index) => {
			if (item.ID == ID) {
				value = item.SubjectID
				return false
			} else {
				return true
			}
		})
		return value
	}

	// -------------- GET PAGE_NUMBER -----------------
	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber)
		setTodoApi({ ...todoApi, pageIndex: pageNumber })
	}

	const onChange_typeLesson = async (ID, checked) => {
		let res = null
		setLoadingCheck({ id: ID, status: true })
		try {
			if (checked) {
				res = await curriculumDetailApi.update({ ID: ID, isExam: true })
			} else {
				res = await curriculumDetailApi.update({ ID: ID, isExam: false })
			}
			if (res.status == 200) {
				showNoti('success', checked ? 'Đã chuyển sang kiểm tra' : 'Đã tắt kiểm tra')
				setTodoApi({ ...todoApi })
				checked ? setCurrentCheckID(ID) : setCurrentCheckID(null)
			}
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setLoadingCheck({ id: ID, status: false })
		}
	}

	const getLessonID = async () => {
		try {
			let res = await examTopicApi.getAll(examTopic)
			if (res.status == 200) {
				setDataExamTopic(res.data.data)
			} else if (res.status == 204) {
			}
		} catch (error) {
			console.log('GetLessonID: ', error)
		}
	}

	// ============== USE EFFECT - FETCH DATA ===================
	useEffect(() => {
		getDataSource()
		getLessonID()
	}, [todoApi])

	useEffect(() => {
		if (loadingOut && loadingOut.status && loadingOut.type === 'GET_ALL') {
			getDataSource()
		}
	}, [loadingOut])

	const columns = [
		{
			title: 'Bài học',
			dataIndex: 'SubjectName',
			key: 'subjectname',
			className: 'text-center',
			render: (text, data, index) => (
				<>
					{isAdmin ? (
						dataSubject && (
							<Select
								loading={data.ID == loadingSelect.id && loadingSelect.status}
								value={returnValue(data.ID)}
								style={{ width: '100%', margin: 'auto' }}
								className="style-input"
								showSearch
								optionFilterProp="children"
								defaultValue={data.SubjectID}
								onChange={(value) => updateSubject(value, data, index)}
							>
								<Option key="none" value={0}>
									Trống
								</Option>
								{dataSubject?.map((item, index) => (
									<Option key={index} value={item.ID}>
										{item.SubjectName}
									</Option>
								))}
							</Select>
						)
					) : (
						<p className="font-weight-black">{text}</p>
					)}
				</>
			)
		},
		{
			title: 'Trạng thái',
			dataIndex: 'StatusName',
			key: 'statusname',
			className: 'text-center',
			render: (text, data) => (
				<div>
					{isAdmin ? (
						isFixed ? (
							<Switch
								checked={data.IsExam}
								checkedChildren="Kiểm tra"
								unCheckedChildren="Kiểm tra"
								onChange={(checked) => onChange_typeLesson(data.ID, checked)}
								loading={loadingCheck.id == data.ID && loadingCheck.status}
							/>
						) : (
							<p>{data?.IsExam ? 'Kiểm tra' : 'Buổi học'}</p>
						)
					) : (
						<p>{data?.IsExam ? 'Kiểm tra' : 'Buổi học'}</p>
					)}
				</div>
			)
		},
		{
			title: 'Buổi học',
			dataIndex: 'LessonNumber',
			key: 'lessonnumber',
			className: 'col-short text-center'
		},
		{
			title: '',
			dataIndex: 'StatusName',
			key: 'statusname',
			className: 'text-center',
			render: (text, data) => (
				<>
					{!data.IsExam ? (
						<DetailsModal
							isAdmin={isAdmin}
							curriculumDetailID={data.ID}
							dataExamTopic={dataExamTopic}
							dataCurriculumDetail={dataSource}
							onFetchData={() => setTodoApi({ ...todoApi })}
							courseID={courseID}
							dataRow={data}
							isFixed={isFixed}
						/>
					) : (
						<AddExamForm
							disable={props.disable}
							dataExamTopic={dataExamTopic}
							dataRow={data}
							onFetchData={() => (setTodoApi({ ...todoApi }), setCurrentCheckID(null))}
							currentCheckID={currentCheckID}
						/>
					)}
				</>
			)
		}
	]

	async function _insertSubject() {
		try {
			const res = await curriculumDetailApi.insert({ CurriculumID: curriculumID })
			res.status == 200 && getDataSource()
		} catch (error) {
			showNoti('danger', error?.message)
		}
	}

	return (
		<>
			<div className="w-100 d-flex mt-2">
				<Popconfirm title="Bạn muốn thêm buổi học mới?" onConfirm={_insertSubject} okText="Thêm" cancelText="Không">
					<Button className="btn btn-warning">Thêm buổi học</Button>
				</Popconfirm>
			</div>
			{isNested ? (
				<NestedTable
					currentPage={currentPage}
					totalPage={totalPage && totalPage}
					getPagination={(pageNumber: number) => getPagination(pageNumber)}
					addClass="table-curriculum-detail"
					loading={isLoading}
					dataSource={dataSource}
					columns={columns}
				/>
			) : (
				<PowerTable
					currentPage={currentPage}
					totalPage={totalPage && totalPage}
					getPagination={(pageNumber: number) => getPagination(pageNumber)}
					addClass="table-curriculum-detail"
					loading={isLoading}
					dataSource={dataSource}
					columns={columns}
				/>
			)}
		</>
	)
}

export default CurriculumDetail

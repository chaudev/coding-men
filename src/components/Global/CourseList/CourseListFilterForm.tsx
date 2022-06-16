import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Popover } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Filter } from 'react-feather'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import InputTextField from '~/components/FormControl/InputTextField'
import SelectField from '~/components/FormControl/SelectField'
import { optionCommonPropTypes } from '~/utils/proptypes'

const CourseListFilterForm = (props) => {
	const { handleFilter, handleResetFilter, optionList } = props
	const { statusList, branchList, programList, teacherList } = optionList
	console.log('🚀 ~ file: CourseListFilterForm.tsx ~ line 14 ~ CourseListFilterForm ~ teacherList', teacherList)
	const [showFilter, showFilterSet] = useState(false)

	const funcShowFilter = () => {
		showFilter ? showFilterSet(false) : showFilterSet(true)
	}
	const schema = yup.object().shape({
		CourseName: yup.string(),
		Status: yup.number().nullable(),
		BranchID: yup.number().nullable(),
		ProgramID: yup.number().nullable()
	})

	const defaultValuesInit = {
		CourseName: '',
		Status: null,
		BranchID: null,
		ProgramID: null
	}
	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	})

	const checkHandleFilter = (objVl) => {
		if (!handleFilter) return
		handleFilter(objVl)
		funcShowFilter()
	}
	const checkHandleResetFilter = () => {
		if (!handleResetFilter) return
		handleResetFilter()
		funcShowFilter()
		form.reset({ ...defaultValuesInit })
	}

	const content = (
		<div className={`wrap-filter small`}>
			<Form layout="vertical" onFinish={form.handleSubmit(checkHandleFilter)}>
				<div className="row">
					<div className="col-md-6">
						<InputTextField form={form} name="CourseName" label="Tên khóa học" placeholder="Nhập tên khóa học" />
					</div>
					<div className="col-md-6">
						<SelectField form={form} name="Status" label="Trạng thái" placeholder="Chọn trạng thái" optionList={statusList} />
					</div>
					<div className="col-md-6">
						<SelectField form={form} name="BranchID" label="Trung tâm" optionList={branchList} placeholder="Chọn trung tâm" />
					</div>
					<div className="col-md-6">
						<SelectField
							form={form}
							name="ProgramID"
							label="Chương trình học"
							placeholder="Chọn chương trình học"
							optionList={programList}
						/>
					</div>
					<div className="col-md-6">
						<SelectField form={form} name="TeacherID" label="Giáo viên" placeholder="Chọn giáo viên" optionList={teacherList} />
					</div>
					<div className="col-md-12 mt-3">
						<button type="submit" className="btn btn-primary" style={{ marginRight: '10px' }}>
							Tìm kiếm
						</button>
						<button type="button" className="light btn btn-secondary" onClick={checkHandleResetFilter}>
							Reset
						</button>
					</div>
				</div>
			</Form>
		</div>
	)

	return (
		<>
			<div className="wrap-filter-parent">
				<Popover
					placement="bottomRight"
					content={content}
					trigger="click"
					overlayClassName="filter-popover"
					visible={showFilter}
					onVisibleChange={funcShowFilter}
				>
					<button className="btn btn-secondary light btn-filter">
						<Filter />
					</button>
				</Popover>
			</div>
		</>
	)
}

CourseListFilterForm.propTypes = {
	handleFilter: PropTypes.func,
	handleResetFilter: PropTypes.func,
	optionList: PropTypes.shape({
		statusList: optionCommonPropTypes,
		branchList: optionCommonPropTypes,
		programList: optionCommonPropTypes
	})
}
CourseListFilterForm.defaultProps = {
	handleFilter: null,
	handleResetFilter: null,
	optionList: {}
}
export default CourseListFilterForm

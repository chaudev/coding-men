import React, { useState } from 'react'
import { Select, DatePicker, Form, Popover } from 'antd'
import { Filter } from 'react-feather'
import moment from 'moment'
import { useWrap } from '~/context/wrap'

const { RangePicker } = DatePicker
const { Option } = Select

type IFilterVideo = {
	handleFilter: Function
	dataLevel: any
	handleReset: Function
	dataCategory: any
}

const initFilter = {
	Type: null,
	Level: null,
	fromDate: '',
	toDate: ''
}

const dateFormat = 'YYYY/MM/DD'

const FilterVideoCourses = (props: IFilterVideo) => {
	const { handleFilter, dataLevel, handleReset, dataCategory } = props
	const { showNoti } = useWrap()

	const [listFilter, setListFilter] = useState(initFilter)
	const [visible, setVisible] = useState(false)

	const onSubmit = () => {
		handleFilter(listFilter)
		setVisible(false)
	}

	const getValueFilter = (value, typeFilter) => {
		switch (typeFilter) {
			case 'select':
				setListFilter({ ...listFilter, Type: value })
				break
			case 'date-range':
				if (value.length > 1) {
					let fromDate = moment(value[0].toDate()).format('YYYY/MM/DD')
					let toDate = moment(value[1].toDate()).format('YYYY/MM/DD')
					setListFilter({ ...listFilter, fromDate: fromDate, toDate: toDate })
				} else {
					showNoti('danger', 'Chưa chọn đầy đủ ngày')
				}
				break
			default:
				break
		}
	}

	const handleChangeFilter = (visible) => {
		setVisible(visible)
	}

	const onReset = () => {
		handleReset()
		setVisible(false)
	}

	const content = (
		<div className={`wrap-filter small`}>
			<Form layout="vertical" onFinish={onSubmit}>
				<div className="row">
					<div className="col-12">
						<Form.Item label="Trình độ">
							<Select
								placeholder="Chọn trình độ.."
								className="style-input"
								onChange={(value) => setListFilter({ ...listFilter, Level: value })}
							>
								{dataLevel.map((item, index) => (
									<Option key={index} value={item.ID}>
										{item.LevelName}
									</Option>
								))}
							</Select>
						</Form.Item>
					</div>

					<div className="col-12">
						<Form.Item label="Loại">
							<Select placeholder="Chọn loại.." className="style-input" onChange={(value) => setListFilter({ ...listFilter, Type: value })}>
								{dataCategory.map((item, index) => (
									<Option key={index} value={item.ID}>
										{item.CategoryName}
									</Option>
								))}
							</Select>
						</Form.Item>
					</div>

					<div className="col-12">
						<Form.Item label="Từ - Đến">
							<RangePicker format={dateFormat} onChange={(value) => getValueFilter(value, 'date-range')} />
						</Form.Item>
					</div>

					<div className="col-md-12">
						<Form.Item className="mb-0">
							<button type="submit" className="btn btn-primary" style={{ marginRight: '10px' }}>
								Tìm kiếm
							</button>
							<button type="button" className="light btn btn-secondary" style={{ marginRight: '10px' }} onClick={onReset}>
								Reset
							</button>
						</Form.Item>
					</div>
				</div>
			</Form>
		</div>
	)

	return (
		<>
			<Popover
				visible={visible}
				placement="bottomRight"
				content={content}
				trigger="click"
				overlayClassName="filter-popover"
				onVisibleChange={handleChangeFilter}
			>
				<button className="btn btn-secondary light btn-filter">
					<Filter />
				</button>
			</Popover>
		</>
	)
}

export default FilterVideoCourses

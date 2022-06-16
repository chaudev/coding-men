import React, { useState } from 'react'
import { Select, Form, Popover } from 'antd'
import { Filter } from 'react-feather'

const FilterTeacher = (props: any) => {
	const { handleFilter, data, handleReset } = props

	const [listFilter, setListFilter] = useState({ CurriculumID: 0 })
	const [visible, setVisible] = useState(false)

	const { Option } = Select

	const onSubmit = () => {
		handleFilter(listFilter)
		setVisible(false)
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
						<Form.Item label="Khóa học của bạn">
							<Select
								placeholder="Chọn khóa học.."
								className="style-input"
								onChange={(value) => setListFilter({ ...listFilter, CurriculumID: value })}
							>
								{data.map((item: any, index: any) => (
									<Option key={index} value={item.CurriculumID}>
										{item.VideoCourseName}
									</Option>
								))}
							</Select>
						</Form.Item>
					</div>

					<div className="col-md-12">
						<Form.Item className="mb-0">
							<button type="submit" className="btn btn-primary" style={{ marginRight: '10px' }}>
								Tìm kiếm
							</button>
							<button type="button" className="light btn btn-secondary" style={{ marginRight: '10px' }} onClick={onReset}>
								Đặt lại
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

export default FilterTeacher

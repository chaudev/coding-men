import { DatePicker, Form, Popover, Select } from 'antd'
import React from 'react'
import { Filter } from 'react-feather'

const FilterJobTable = () => {
	function onChange(date, dateString) {
		console.log(date, dateString)
	}

	const content = (
		<div className={`wrap-filter small`}>
			<Form layout="vertical">
				<div className="row">
					<div className="col-md-6">
						<Form.Item label="Từ">
							<DatePicker className="style-input" onChange={onChange} />
						</Form.Item>
					</div>
					<div className="col-md-6">
						<Form.Item label="Đến">
							<DatePicker className="style-input" onChange={onChange} />
						</Form.Item>
					</div>
					<div className="col-md-12">
						<Form.Item className="mb-0">
							<button className="btn btn-primary" style={{ marginRight: '10px' }}>
								Tìm kiếm
							</button>
							<button className="btn btn-success">Export</button>
						</Form.Item>
					</div>
				</div>
			</Form>
		</div>
	)

	return (
		<>
			<div className="wrap-filter-parent">
				<Popover placement="bottomRight" content={content} trigger="click" overlayClassName="filter-popover">
					<button className="btn btn-secondary light btn-filter">
						<Filter />
					</button>
				</Popover>
			</div>
		</>
	)
}

export default FilterJobTable

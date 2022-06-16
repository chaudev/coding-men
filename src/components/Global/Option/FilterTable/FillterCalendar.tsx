import React, { useState } from 'react'
import { Select, Form, Popover, Button } from 'antd'
import { Filter } from 'react-feather'
import { useWrap } from '~/context/wrap'

const FillterCalendar = (props) => {
	const { handleFilter, data, handleReset } = props
	const { userInformation } = useWrap()

	const [listFilter, setListFilter] = useState({ status: null })
	const [visible, setVisible] = useState(false)

	const { Option } = Select

	const onSubmit = () => {
		console.log('listFilter: ', listFilter)

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
						<Form.Item label="Trạng thái">
							{userInformation?.UserInformationID &&
							(userInformation?.UserInformationID == 1 || userInformation?.UserInformationID == 2) ? (
								<Select
									placeholder="Chọn trạng thái.."
									className="style-input"
									onChange={(value) => setListFilter({ ...listFilter, status: value })}
								>
									{data.status.teacher.map((item: any, index: any) => (
										<Option key={index} value={item.ID}>
											{item.title}
										</Option>
									))}
								</Select>
							) : (
								<Select
									placeholder="Chọn trạng thái.."
									className="style-input"
									onChange={(value) => setListFilter({ ...listFilter, status: value })}
								>
									{data.status.student.map((item: any, index: any) => (
										<Option key={index} value={item.ID}>
											{item.title}
										</Option>
									))}
								</Select>
							)}
						</Form.Item>
					</div>

					<div className="col-md-12">
						<Form.Item className="mb-0">
							<Button onClick={onSubmit} className="btn btn-primary" style={{ marginRight: '10px' }}>
								Tìm kiếm
							</Button>
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

export default FillterCalendar

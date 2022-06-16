import { Popconfirm, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { X } from 'react-feather'

const DeleteTableRow = (props) => {
	const { handleDelete, text, title } = props

	const checkHandleDelete = () => {
		if (!handleDelete) return
		handleDelete()
	}
	return (
		<>
			<Tooltip title={title || 'Xóa'}>
				<Popconfirm placement="left" title={'Bạn muốn xóa' + text + '?'} onConfirm={checkHandleDelete} cancelText="Hủy" okText="Xóa">
					<button type="button" className="btn btn-icon delete">
						<X />
					</button>
				</Popconfirm>
			</Tooltip>
		</>
	)
}

DeleteTableRow.propTypes = {
	handleDelete: PropTypes.func,
	text: PropTypes.string,
	title: PropTypes.string
}

DeleteTableRow.defaultProps = {
	handleDelete: null,
	text: '',
	title: ''
}
export default DeleteTableRow

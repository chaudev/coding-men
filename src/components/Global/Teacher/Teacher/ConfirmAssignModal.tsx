import { Modal } from 'antd'
import React, { useState } from 'react'

const ConfirmAssignModal = (props) => {
	const { data, _onSubmit, loading } = props
	console.log(data)
	const [isVisible, setIsVisible] = useState(false)

	const handleSubmit = () => {
		if (_onSubmit === undefined) return
		_onSubmit(data).then((res) => {
			if (res) {
				setIsVisible(false)
			}
		})
	}

	return (
		<>
			<button
				className="btn btn-icon edit"
				onClick={() => {
					setIsVisible(true)
				}}
			>
				<i className="fas fa-edit" style={{ color: '#34c4a4', fontSize: 16, marginBottom: -1 }}></i>
			</button>
			<Modal
				footer={null}
				visible={isVisible}
				title="Xác nhận gán giáo viên"
				onCancel={() => {
					setIsVisible(false)
				}}
			>
				<div className="row">
					<div className="col-12">
						{data && data.IsSelected ? (
							<h5>Xác nhận giáo viên không được dạy tất cả các môn trong chương trình</h5>
						) : (
							<h5>Xác nhận giáo viên được dạy tất cả các môn trong chương trình</h5>
						)}
					</div>
					<div className="col-12">
						<button className="btn btn-primary w-100" disabled={loading.type === 'ASSIGN_TEACHER' && loading.status} onClick={handleSubmit}>
							Xác nhận
						</button>
					</div>
				</div>
			</Modal>
		</>
	)
}

export default ConfirmAssignModal

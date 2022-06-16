import { DownloadOutlined } from '@ant-design/icons'
import { Modal, Tooltip } from 'antd'
import React, { useState, useRef } from 'react'
import ReactHtmlParser from 'react-html-parser'
import Pdf from 'react-to-pdf'
import { useWrap } from '~/context/wrap'

export default function ModalDownloadCertificate(props) {
	const { data } = props
	const { Content } = data
	const [isVisible, setIsVisible] = useState(false)
	const { showNoti } = useWrap()
	const ref = useRef()

	const options = {
		fontWeight: 500,
		fontName: 'Times'
	}

	return (
		<>
			<Tooltip title="Tải chứng chỉ">
				<button
					className="btn-icon btn edit"
					onClick={() => {
						setIsVisible(true)
					}}
				>
					<DownloadOutlined />
				</button>
			</Tooltip>

			<Modal
				title={'Chứng chỉ học viên'}
				visible={isVisible}
				footer={false}
				onCancel={() => {
					setIsVisible(false)
				}}
				width={1000}
			>
				<div className="row">
					<div className="col-12">
						<div ref={ref}>{ReactHtmlParser(Content)}</div>
					</div>
					<div className="col-12 mt-4">
						<Pdf targetRef={ref} filename="certificate.pdf">
							{({ toPdf }) => (
								<button className="btn btn-primary" onClick={toPdf}>
									Tải xuống
								</button>
							)}
						</Pdf>
					</div>
				</div>
			</Modal>
		</>
	)
}

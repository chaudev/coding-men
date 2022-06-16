import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useWrap } from '~/context/wrap'
import LayoutBase from '~/components/LayoutBase'
import TitlePage from '~/components/TitlePage'
import { Card, Popover, Tooltip, Spin } from 'antd'
import EditorBase from '~/components/Elements/EditorBase'
import { certificateApi } from '~/apiBase/options/certificate-config'

const codeEditorList = [
	{ label: '{khoahoc}', desc: ' Khóa học' },
	{ label: '{batdau}', desc: ' Thời gian bắt đầu' },
	{ label: '{ketthuc}', desc: ' Thời gian kết thúc' }
]

CertificateOfStudent.propTypes = {
	title: PropTypes.string
}

function CertificateOfStudent(props) {
	const [certificate, setCertificate] = useState<ICertificate>()
	const [certificateContent, setCertificateContent] = useState('')
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const { showNoti } = useWrap()

	const getCertificateContent = async () => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			let res = await certificateApi.getAll()
			if (res.status === 200) {
				setCertificate(res.data.data)
				setCertificateContent(res.data.data.Content)
			}
		} catch (err) {
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false })
		}
	}

	const changeCertificateContent = (value) => {
		setCertificateContent(value)
	}

	const updateCertificate = async () => {
		setIsLoading({ type: 'UPDATE', status: true })
		try {
			let res = await certificateApi.update({ ID: certificate.ID, Content: certificateContent })
			if (res.status === 200) {
				showNoti('success', res.data.message)
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'UPDATE', status: false })
		}
	}

	useEffect(() => {
		getCertificateContent()
	}, [])

	return (
		<>
			<div className="row">
				<TitlePage title="Chứng chỉ học viên" />
				<div className="col-12">
					<Card
						className={`${isLoading.type === 'GET_ALL' && isLoading.status ? 'custom-loading' : ''}`}
						style={{ position: 'relative' }}
						extra={
							<Popover
								placement="bottomRight"
								content={
									<div className="invoice-editor-list">
										{codeEditorList.map((c, idx) => (
											<Tooltip title="Nhấn để sao chép" placement="left" className="invoice-editor-item">
												<p
													key={idx}
													onClick={() => {
														navigator.clipboard.writeText(c.label)
													}}
												>
													<span>{c.label}:</span>
													{`${c.desc}`}
												</p>
											</Tooltip>
										))}
									</div>
								}
							>
								<a className="btn-code-editor" style={{ position: 'relative' }} type="primary">
									Mã hướng dẫn
								</a>
							</Popover>
						}
					>
						<EditorBase content={certificateContent && certificateContent} handleChangeDataEditor={changeCertificateContent} />
						<div className="pt-3 d-flex justify-content-center">
							<div style={{ paddingRight: 5 }}>
								<button
									type="submit"
									className="btn btn-primary"
									disabled={isLoading.type === 'UPDATE' && isLoading.status}
									onClick={updateCertificate}
								>
									Xác nhận
									{isLoading.type === 'UPDATE' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
						<Spin className="custom-loading-icon" size="large" />
					</Card>
				</div>
			</div>
		</>
	)
}

CertificateOfStudent.layout = LayoutBase
export default CertificateOfStudent

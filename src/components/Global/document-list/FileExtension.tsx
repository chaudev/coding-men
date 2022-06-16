import { Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import DocListModal from './DocListMadal'

const FileExtension = (props) => {
	const { docList, isLoading, docInfo, onFetchData, showAdd } = props
	const [searchDoc, setSearchDoc] = useState<IDocumentList[]>(docList)

	useEffect(() => {
		setSearchDoc(docList)
	}, [docList])

	const iconFile = (link) => {
		return (
			<>
				{link.split('.').slice(-1) == 'pdf' && <img style={{ width: 25, height: 25, marginRight: 5 }} src="/images/pdf.svg" alt="icon" />}
				{link.split('.').slice(-1) == 'png' && <img style={{ width: 25, height: 25, marginRight: 5 }} src="/images/png.svg" alt="icon" />}
				{link.split('.').slice(-1) == 'doc' && <img style={{ width: 25, height: 25, marginRight: 5 }} src="/images/doc.svg" alt="icon" />}
				{link.split('.').slice(-1) == 'docx' && <img style={{ width: 25, height: 25, marginRight: 5 }} src="/images/docx.svg" alt="icon" />}
				{link.split('.').slice(-1) == 'jpg' && <img style={{ width: 25, height: 25, marginRight: 5 }} src="/images/jpg.svg" alt="icon" />}
				{link.split('.').slice(-1) == 'gif' && <img style={{ width: 25, height: 25, marginRight: 5 }} src="/images/gif.svg" alt="icon" />}
				{link.split('.').slice(-1) == 'xlsx' && <img style={{ width: 25, height: 25, marginRight: 5 }} src="/images/xls.svg" alt="icon" />}
			</>
		)
	}

	return (
		<div className="">
			<Spin spinning={isLoading.type === 'GET_ALL' && isLoading.loading}>
				{searchDoc?.length > 0 ? (
					<div className="row">
						{searchDoc.map((doc: IDocumentList, idx) => (
							<div className="mb-3 col-12 col-sm-6 col-lg-4" key={idx}>
								<div className="file-man-box">
									<a href={doc.DocumentLink} download={doc.DocumentLink} target="_blank">
										<img
											src={doc.ImageThumbnail && doc.ImageThumbnail.length > 0 ? doc.ImageThumbnail : '/images/document-thumb.jpg'}
											style={{ width: '100%' }}
											alt=" document image"
										/>
										<div className="file-man-title">
											<p className="file-download">
												<i className="fa fa-download"></i>
											</p>
										</div>
									</a>

									<div className="p-2 pt-0 pb-3" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
										{iconFile(doc.DocumentLink)}
										<div className="ml-2" style={{ flex: 1 }}>
											{doc.DocumentName || 'Tài liệu không có tiêu đề'}
										</div>
										{showAdd() && (
											<div>
												<DocListModal
													type="EDIT_DOC"
													docInfo={docInfo}
													onFetchDataForm={() => {
														onFetchData()
													}}
													docID={doc.ID}
													docName={doc.DocumentName}
												/>
												<DocListModal
													type="DELETE_DOC"
													docInfo={docInfo}
													onFetchDataForm={() => {
														onFetchData()
													}}
													docID={doc.ID}
													docName={doc.DocumentName}
												/>
											</div>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<h4>Không tìm thấy tài liệu!</h4>
				)}
			</Spin>
		</div>
	)
}

export default FileExtension

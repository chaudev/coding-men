import { Card, Dropdown, Menu, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import LayoutBase from '~/components/LayoutBase'
import { documentCategoryApi } from '~/apiBase/course-detail/document-category'
import { useWrap } from '~/context/wrap'
import { Folder } from 'react-feather'
import FileExtension from '~/components/Global/document-list/FileExtension'
import { documentListApi } from '~/apiBase/document-list/document-list'
import DocModal from '~/components/Global/document-list/DocModal'
import { DashOutlined, EllipsisOutlined } from '@ant-design/icons'
import TitlePage from '~/components/TitlePage'
import DocListModal from '~/components/Global/document-list/DocListMadal'

const DocumentList = (props) => {
	const [isLoading, setIsLoading] = useState({ type: '', loading: false })
	const [categoryDoc, setCategoryDoc] = useState<ICategoryDoc[]>([])
	const { showNoti, pageSize, userInformation } = useWrap()
	const [categoryID, setCategoryID] = useState(null)
	const [activeID, setActiveID] = useState<any>()
	const [docList, setDocList] = useState(null)
	const [docInfo, setDocInfo] = useState({})

	const paramsDefault = {
		pageIndex: 1,
		pageSize: pageSize,
		CurriculumnID: 0
	}

	const [params, setParams] = useState(paramsDefault)

	const getDataCategoryDoc = async () => {
		setIsLoading({ type: 'GET_ALL', loading: true })
		try {
			let res = await documentCategoryApi.getAll(params)
			if (res.status == 200) {
				setCategoryDoc(res.data.data)
				setActiveID(res.data.data[0].ID)
				getDocList(res.data.data[0].ID)
				setDocInfo({ CategoryID: res.data.data[0].ID, DocumentName: res.data.data[0].CategoryName })
				setCategoryID(res.data.data[0].ID)
			}
			if (res.status == 204) {
				showNoti('danger', 'Không tìm thấy dữ liệu!')
			}
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setIsLoading({ type: 'GET_ALL', loading: false })
		}
	}

	const getDocList = async (ID) => {
		console.log('getDocList')

		setIsLoading({ type: 'GET_ALL', loading: true })
		try {
			let res = await documentListApi.getAll({ CategoryID: ID, DocumentName: '' })
			if (res.status == 200) {
				setDocList(res.data.data)
			}
			if (res.status == 204) {
				setDocList([])
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'GET_ALL', loading: false })
		}
	}

	const menu = (cate) => {
		return (
			<Menu className="action-btn text-right d-flex justify-content-center align-items-center" style={{ borderRadius: 5 }}>
				<Tooltip title="Thêm tài liệu">
					<Menu.Item key="0">
						{showAdd() && (
							<DocListModal
								type="ADD_DOC"
								docInfo={docInfo}
								docID={null}
								docName={null}
								onFetchDataForm={() => setParams({ ...params, pageIndex: 1 })}
							/>
						)}
					</Menu.Item>
				</Tooltip>

				<Tooltip title="Chỉnh sửa">
					<Menu.Item key="0">
						<DocModal
							type="EDIT_DOC"
							CategoryName={cate.CategoryName}
							cateID={cate.ID}
							onFetchData={() => setParams({ ...params, pageIndex: 1 })}
						/>
					</Menu.Item>
				</Tooltip>

				<Tooltip title="Xóa">
					<Menu.Item key="1">
						<DocModal
							type="DELETE_DOC"
							CategoryName={cate.CategoryName}
							cateID={cate.ID}
							onFetchData={() => setParams({ ...params, pageIndex: 1 })}
						/>
					</Menu.Item>
				</Tooltip>
			</Menu>
		)
	}

	const menuCateMD = () => {
		return (
			<div className=" d-md-none col-md-3 document-menu">
				<div className="pb-3 col-12 d-flex justify-content-between align-items-center box-header">
					<div className="title">Loại tài liệu</div>
					<DocModal type="ADD_DOC" CategoryName={null} cateID={null} onFetchData={() => setParams({ ...params, pageIndex: 1 })} />
				</div>

				<Menu mode="vertical">
					<div className="category-document-list-wrap">
						{categoryDoc.map((cate) => {
							return (
								<div
									className={
										activeID == cate.ID
											? 'd-flex justify-content-between category-document-item-wrap doc__list-active'
											: 'd-flex justify-content-between category-document-item-wrap'
									}
								>
									<div
										style={{ cursor: 'pointer', width: '100%' }}
										className={'d-flex justify-content-between align-items-center doc__list-container'}
										onClick={() => {
											setActiveID(cate.ID)
											getDocList(cate.ID)
											setDocInfo({ CategoryID: cate.ID, DocumentName: cate.CategoryName })
											setCategoryID(cate.ID)
										}}
									>
										<div className="title doc__list-menu">
											<p className="text-uppercase">
												{' '}
												<img
													style={{ width: 30, height: 30 }}
													src={cate.Icon && cate.Icon.length > 0 ? cate.Icon : '/Images/1-listening.png'}
												/>{' '}
												{cate.CategoryName}
											</p>
										</div>
										<Dropdown
											className={'d-flex justify-content-between align-items-center pr-1'}
											overlay={() => menu(cate)}
											trigger={['click']}
											placement="topRight"
										>
											<a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
												<DashOutlined />
											</a>
										</Dropdown>
									</div>
								</div>
							)
						})}
					</div>
				</Menu>
			</div>
		)
	}

	useEffect(() => {
		getDataCategoryDoc()
	}, [params])

	const showAdd = () => {
		return !!userInformation && (userInformation.RoleID == 1 || userInformation.RoleID == 2) ? true : false
	}

	return (
		<div className="h-100">
			<TitlePage title="Danh sách tài liệu" />

			<Card
				title="Tài liệu"
				className="h-100 card-document-list"
				extra={
					<>
						{showAdd() && (
							<DocModal type="ADD_DOC" CategoryName={null} cateID={null} onFetchData={() => setParams({ ...params, pageIndex: 1 })} />
						)}
						<div className="d-md-none d-inline-block col-md-3 w-25">
							<Dropdown overlay={menuCateMD} trigger={['click']}>
								<a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
									<EllipsisOutlined />
								</a>
							</Dropdown>
						</div>
					</>
				}
			>
				<div className="row">
					<div className="d-none d-md-block col-md-4 col-lg-3 document-menu">
						<div className="category-document-list-wrap p-1">
							{categoryDoc.map((cate) => {
								return (
									<div
										className={`d-flex mb-2 justify-content-between category-document-item-wrap ${
											activeID == cate.ID && 'doc__list-active'
										}`}
									>
										<div
											style={{ cursor: 'pointer' }}
											className={'d-flex w-100 justify-content-between align-items-center doc__list-container'}
											onClick={() => {
												setActiveID(cate.ID)
												getDocList(cate.ID)
												setDocInfo({ CategoryID: cate.ID, DocumentName: cate.CategoryName })
												setCategoryID(cate.ID)
											}}
										>
											<div className="title doc__list-menu">
												<div className="text-uppercase">
													<img
														className="mr-3"
														style={{ width: 30, height: 30 }}
														src={!!cate?.Icon && cate.Icon.length > 0 ? cate.Icon : '/Images/1-listening.png'}
													/>
													{cate.CategoryName}
												</div>
											</div>

											{showAdd() && (
												<div
													onClick={(e: any) => e.stopPropagation()} // THÊM QQ NÀY VÔ THÌ CLICK VÔ MENU KHÔNG CLICK ITEM
													className="category-document-action"
												>
													<Dropdown overlay={() => menu(cate)} trigger={['hover']} placement="topRight">
														<a onClick={(e: any) => e.stopPropagation()} className="ant-dropdown-link pt-3 pb-4 pl-3">
															<DashOutlined />
														</a>
													</Dropdown>
												</div>
											)}
										</div>
									</div>
								)
							})}
						</div>
					</div>

					<div className="col-12 col-md-8 col-lg-9">
						{categoryID ? (
							<FileExtension
								docList={docList}
								isLoading={isLoading}
								docInfo={docInfo}
								categoryID={categoryID}
								onFetchData={() => getDocList(categoryID)}
								showAdd={showAdd}
							/>
						) : (
							<h4 className="col-12">Hãy chọn danh mục!</h4>
						)}
					</div>
				</div>
			</Card>
		</div>
	)
}

DocumentList.layout = LayoutBase
export default DocumentList

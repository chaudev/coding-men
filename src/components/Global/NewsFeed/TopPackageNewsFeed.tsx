import { Image, List, Skeleton } from 'antd'
import React from 'react'
import 'swiper/swiper.min.css'
import { numberWithCommas } from '~/utils/functions'
import Link from 'next/link'

function TopPackageNewsFeed(props: any) {
	const { topPackageList, isLoading } = props

	return (
		<>
			{isLoading && (
				<ul className="list-nf skeleton">
					<li className="item-nf">
						<div className="newsfeed">
							<Skeleton avatar paragraph={{ rows: 0 }} active />
							<Skeleton active paragraph={{ rows: 2 }} />
						</div>
					</li>
					<li className="item-nf">
						<div className="newsfeed">
							<Skeleton avatar paragraph={{ rows: 0 }} active />
							<Skeleton active paragraph={{ rows: 2 }} />
						</div>
					</li>
					<li className="item-nf">
						<div className="newsfeed">
							<Skeleton avatar paragraph={{ rows: 0 }} active />
							<Skeleton active paragraph={{ rows: 2 }} />
						</div>
					</li>
				</ul>
			)}
			<List
				className="list-eth"
				itemLayout="horizontal"
				dataSource={topPackageList}
				grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
				renderItem={(item: any) => {
					const params = {
						Category: item.CategoryName,
						CategoryID: item.CategoryID,
						Level: item.LevelName,
						Create: item.CreatedOn,
						Thum: item.ImageThumbnails,
						AverageRating: item.AverageRating,
						TotalFeedBack: item.TotalFeedBack,
						slug: item.ID,
						Original: item.OriginalPrice,
						Sell: item.SellPrice,
						Active: item.StatusActive,
						TotalVideo: item.TotalVideoCourseSold,
						TotalVideoViews: item?.TotalVideoViews,
						TeacherID: item?.TeacherID,
						CurriculumID: item?.CurriculumID
					}
					return (
						<List.Item style={{ width: '100%' }}>
							<div className="nf-package">
								<div className="img">
									<Image
										width="100%"
										height="100%"
										src={item?.ImageThumbnails || '/images/logo-thumnail.jpg'}
										title="Ảnh bìa bộ đề"
										alt="Ảnh bìa bộ đề"
										style={{ objectFit: 'cover' }}
									/>
								</div>
								<div className="content">
									<h6 className="title in-1-line">{item?.VideoCourseName}</h6>
									<ul className="list">
										<li className="price">
											Giá:<span>{numberWithCommas(item?.SellPrice)} VNĐ</span>
										</li>
									</ul>
									<Link href={{ pathname: '/video-course/[slug]', query: params }}>
										<div className="btn btn-primary">Xem khóa học</div>
									</Link>
								</div>
							</div>
						</List.Item>
					)
				}}
				style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
			/>
		</>
	)
}

export default TopPackageNewsFeed

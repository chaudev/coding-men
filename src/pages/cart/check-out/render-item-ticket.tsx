import React from 'react'
import { parseToMoney } from '~/utils/functions'
import moment from 'moment'

type IItemTicket = {
	item: any
	onClick: Function
	selected: any
	Total: number
}

const RenderItemTicket = (props: IItemTicket) => {
	const { item, onClick, selected, Total } = props

	const _getStatus = (type: number) => {
		if (item?.MeetTheCondition == true && type == 2) {
			onClick(item)
		}
		if (item?.MeetTheCondition == true) {
			return ''
		} else {
			return 'cac'
		}
	}

	return (
		<>
			<div onClick={() => _getStatus(2)} className="ticket-wrap">
				<div className="tkbg">
					<div className={`left-part ${selected == item && 'selected'}`}></div>
					<div className={`center-part ${selected == item && 'selected-center'}`}></div>
					<div className={`right-part ${selected == item && 'selected'}`}></div>
				</div>
				<div className="content noselect">
					<div className="w-code flex-center">
						<img
							src={!!item?.Images ? item?.Images : '/images/logo-square.png'}
							alt="avt"
							style={{ width: 90, height: 90, opacity: _getStatus(1) == '' ? 1 : 0.5 }}
						/>
					</div>

					<div className="main">
						<div className="info">
							<div className="main-info">
								<div className={`code row-center bold size-16 in-1-line w-100 ${_getStatus(1) !== '' && 'disable-text'}`}>
									Giảm:
									<div className="ml-2">
										{item?.DiscountType == 2 ? item?.Discount + '%' : parseToMoney(item?.Discount)}
										{item?.DiscountType == 2 && !!item?.MaxDiscountPrice && (
											<span className="ml-1">
												- Tối đa:<span className="ml-2">{parseToMoney(item?.MaxDiscountPrice)}</span>
											</span>
										)}
									</div>
								</div>
								<div className={`code row-center ${_getStatus(1) !== '' && 'disable-text'}`}>
									Áp dụng cho
									{item?.Style == 1 ? ' đơn hàng lẻ' : item?.Style == 2 ? ' đơn hàng combo' : ' tất cả đơn hàng'}
								</div>
								<div className={`code row-center ${_getStatus(1) !== '' && 'disable-text'}`}>
									Đơn tối thiểu:<div className="ml-2">{parseToMoney(item?.MinimumOrder)}</div>
								</div>
							</div>
							<div className={`code row-center ${_getStatus(1) !== '' && 'disable-text'}`}>
								Hạn sử dụng:<div className="ml-2">{moment(item?.DeadLine).format('DD/MM/YYYY')}</div>
							</div>
						</div>
						<div className="status disable-text" style={{ width: 80, marginLeft: -80 }}>
							{_getStatus(1) !== '' && (
								<div className="water-mark">
									<div className="around">
										<div className="inner">
											<div className="text bold">
												KHÔNG ĐỦ<div className="xaoo">ĐIỀU KIỆN</div>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default RenderItemTicket

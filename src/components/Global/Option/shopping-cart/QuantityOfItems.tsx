import React, { useState } from 'react'

type IItemsQuantity = {
	item: {
		ExpiryDays: number
		ID: number
		ImageThumbnails: string
		Price: number
		Quantity: number
		VideoCourseID: number
		VideoCourseName: string
	}
	index: number
	decreseItem: any
	increseItem: any
}

const QuantityOfItems = (props: IItemsQuantity) => {
	const { item, index, decreseItem, increseItem } = props

	const [count, setCount] = useState<number>(item.Quantity)

	const _minus = () => {
		decreseItem(item.ID, count)
		count === 1 ? setCount(1) : setCount(count - 1)
	}

	const _plus = () => {
		increseItem(item.ID, count)
		setCount(count + 1)
	}

	return (
		<div key={index}>
			<span className="quantity-btn" style={{ userSelect: 'none' }} onClick={_minus}>
				-
			</span>
			<span className="cart__item-quantity font-weight-green">{count}</span>
			<span className="quantity-btn" style={{ userSelect: 'none' }} onClick={_plus}>
				+
			</span>
		</div>
	)
}

export default QuantityOfItems

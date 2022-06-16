import React from 'react'
import ReactStars from 'react-rating-stars-component'

function RatingStar(props) {
	const { AverageRating, TotalFeedBack } = props

	return (
		<div style={{ display: 'flex' }}>
			<ReactStars
				count={5}
				value={AverageRating}
				isHalf={true}
				emptyIcon={<i className="far fa-star"></i>}
				halfIcon={<i className="fa fa-star-half-alt"></i>}
				fullIcon={<i className="fa fa-star"></i>}
				activeColor="#ffd700"
			/>
			{!!TotalFeedBack && <span>{`(${TotalFeedBack})`}</span>}
		</div>
	)
}

export default RatingStar

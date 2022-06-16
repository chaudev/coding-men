import WrapFilter from '~/components/Global/CheckRoom/WrapFilter'
import React from 'react'
import { Card } from 'antd'
import LayoutBase from '~/components/LayoutBase'

const CheckRoom = () => {
	return (
		<div className="row">
			<div className="col-12">
				<Card title="Kiểm tra phòng">
					<WrapFilter showFilter={false} />
				</Card>
			</div>
		</div>
	)
}

CheckRoom.layout = LayoutBase
export default CheckRoom

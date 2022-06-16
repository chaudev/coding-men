import React, { useState } from 'react'
import { Image, Tooltip } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { useWrap } from '~/context/wrap'

type IViewImage = {
	url: string
}

const ViewImage = (props: IViewImage) => {
	const { showNoti } = useWrap()

	const [visible, setVisible] = useState(false)

	const _click = () => {
		if (!!props.url) {
			setVisible(true)
		} else {
			showNoti('danger', 'Không có hình ảnh')
		}
	}

	return (
		<>
			<Tooltip title="Xem hình ảnh">
				<button className="btn btn-icon" onClick={_click}>
					<EyeOutlined />
				</button>
			</Tooltip>

			{visible && (
				<Image
					width={200}
					style={{ display: 'none' }}
					src={props.url}
					preview={{
						visible,
						src: props.url,
						onVisibleChange: (value) => {
							setVisible(value)
						}
					}}
				/>
			)}
		</>
	)
}

export default ViewImage

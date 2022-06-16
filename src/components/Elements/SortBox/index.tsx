import { Select } from 'antd'

const SortBox = (props: any) => {
	const { Option } = Select
	const { dataOption, handleSort, width, space } = props

	function handleChange(value, option) {
		if (!handleSort) return
		handleSort(option)
	}

	return (
		<>
			<Select
				style={{ marginLeft: space ? '10px' : '', width: width ? width : '130px' }}
				className="style-input"
				placeholder="Sắp xếp"
				onChange={handleChange}
				size="large"
			>
				{dataOption?.length > 0 &&
					dataOption.map((option: any, index) => (
						<Option title={option.dataSort} value={index} key={index}>
							{option.text}
						</Option>
					))}
			</Select>
		</>
	)
}

export default SortBox

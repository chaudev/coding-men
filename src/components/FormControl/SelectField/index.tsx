import { Form, Select } from 'antd'
import React from 'react'
import { Controller } from 'react-hook-form'

const SelectField = (props: ISelectField) => {
	const { isDynamicField, disabled, mode, style, optionDisabledList } = props

	const { Option } = Select
	const { errors } = props.form.formState

	let hasError
	let errorMessage

	if (isDynamicField) {
		const nameSlice = props.name.slice(0, props.name.indexOf('.'))
		const index = props.name.slice(props.name.indexOf('.') + 1, props.name.lastIndexOf('.'))
		const key = props.name.slice(props.name.lastIndexOf('.') + 1)
		if (errors[nameSlice] && errors[nameSlice][index]) {
			hasError = errors[nameSlice][index][key]
			errorMessage = errors[nameSlice][index][key]?.message
		}
	} else {
		hasError = errors[props.name]
		errorMessage = errors[props.name]?.message
	}

	const checkOnChangeSelect = (value) => {
		if (!props.onChangeSelect) return
		props.onChangeSelect(value)
	}

	return (
		<Form.Item
			style={style}
			label={props.label}
			className={`${!!props?.className} ${hasError ? 'ant-form-item-with-help ant-form-item-has-error' : ''}`}
			required={!!props?.isRequired}
		>
			<Controller
				name={props.name}
				control={props.form.control}
				render={({ field }) => {
					let temp: any = 'fuck'

					if (field?.value == null || field?.value == undefined) {
						temp = { ...field, value: null }
					} else {
						temp = field
					}

					return (
						<Select
							{...temp}
							mode={mode}
							className="style-input"
							showSearch
							loading={!!props?.isLoading}
							style={{ width: '100%' }}
							placeholder={props?.placeholder}
							optionFilterProp="children"
							disabled={disabled}
							onChange={(value) => {
								checkOnChangeSelect(value)
								field.onChange(value)
							}}
						>
							{props.optionList.map((o, idx) => (
								<Option key={idx} value={o.value} disabled={o.disabled || optionDisabledList?.includes(o.value)}>
									{o.title}
								</Option>
							))}
						</Select>
					)
				}}
			/>

			{hasError && (
				<div className="ant-form-item-explain ant-form-item-explain-error font-color-error">
					<div role="alert">{errorMessage}</div>
				</div>
			)}
		</Form.Item>
	)
}

export default SelectField

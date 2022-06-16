import { Form } from 'antd'
import React from 'react'
import { Controller } from 'react-hook-form'
import NumberFormat from 'react-number-format'

type IProps = {
	form: any
	name: string
	label: string
	placeholder: string
	disabled: boolean
	handleChange: Function
	style: any
	className: string
	isDynamicField: boolean
	isRequired: boolean
	error?: string
	setError?: Function
}

const PriceField = (props: IProps) => {
	const { form, name, label, placeholder, disabled, handleChange, style, className, isDynamicField, isRequired } = props

	const { errors } = form.formState
	let hasError
	let errorMessage
	if (isDynamicField) {
		// NAME.INDEX.KEY;
		const nameSlice = name.slice(0, name.indexOf('.'))
		const index = name.slice(name.indexOf('.') + 1, name.lastIndexOf('.'))
		const key = name.slice(name.lastIndexOf('.') + 1)
		// IF HAVE NAME SLICE
		if (errors[nameSlice] && errors[nameSlice][index]) {
			hasError = errors[nameSlice][index][key]
			errorMessage = errors[nameSlice][index][key]?.message
		}
	} else {
		hasError = errors[name]
		errorMessage = errors[name]?.message
	}

	const checkHandleChange = (value) => {
		if (!handleChange) return
		handleChange(value)
	}

	return (
		<Form.Item
			style={style}
			label={label}
			className={`${hasError ? 'ant-form-item-with-help ant-form-item-has-error' : ''}`}
			required={isRequired}
			colon
		>
			<Controller
				name={name}
				control={form.control}
				render={({ field }) => (
					<NumberFormat
						{...field}
						placeholder={placeholder}
						disabled={disabled}
						className={className}
						onChange={(e) => {
							if (!!props?.setError) {
								props?.setError('')
							}
							checkHandleChange(e.target.value)
							field.onChange(e.target.value)
						}}
						thousandSeparator={true}
					/>
				)}
			/>
			{(!!props?.error || hasError) && (
				<div className="ant-form-item-explain ant-form-item-explain-error font-color-error">
					<div role="alert">{errorMessage || props?.error}</div>
				</div>
			)}
		</Form.Item>
	)
}

PriceField.defaultProps = {
	label: '',
	placeholder: '',
	disabled: false,
	handleChange: null,
	style: {},
	className: 'ant-input style-input w-100',
	allowClear: true,
	isDynamicField: false,
	isRequired: false
}

export default PriceField

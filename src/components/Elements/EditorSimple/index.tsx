import React from 'react'
import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(() => import('./Editor'), {
	ssr: false
})

const EditorSimple = (props) => {
	const { handleChange, isReset, questionContent, isTranslate, defaultValue, isSimpleTool, height, isFull } = props
	return (
		<div className="summernote-style">
			<DynamicComponentWithNoSSR
				getDataEditor={(value: any) => handleChange(value)}
				isReset={isReset}
				questionContent={questionContent}
				isTranslate={isTranslate}
				defaultValue={defaultValue}
				isSimpleTool={isSimpleTool}
				height={height}
				isFull={isFull}
			/>
		</div>
	)
}

export default EditorSimple

import React from 'react'
import 'antd/dist/antd.css'
import ReactHtmlParser from 'react-html-parser'

type IInformation = {
	lesson: any
}

const Information = (props: IInformation) => {
	return <div className="ml-5 mr-5">{ReactHtmlParser(props.lesson.Description)}</div>
}

export default Information

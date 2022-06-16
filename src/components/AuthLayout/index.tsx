import React, { useState, useEffect } from 'react'
import styles from './AuthLayout.module.scss'
import { Modal } from 'antd'
import ReactHtmlParser from 'react-html-parser'
import { rulesApi } from '~/apiBase'
import _ from '~/appConfig'

function AuthLayout({ children }) {
	const [isVisible, setIsVisible] = useState<boolean>(false)
	const [termContent, setTermContent] = useState<any>(null)

	const getTermsInformation = async () => {
		try {
			let res = await rulesApi.getAll({})
			!!res?.status && setTermContent(res.data.data)
		} catch (error) {
			console.log('/api/Rules: ', error)
		}
	}

	useEffect(() => {
		getTermsInformation()
	}, [])

	return (
		<>
			<Modal
				style={{ overflow: 'hidden' }}
				zIndex={99999}
				width={1000}
				footer={false}
				visible={isVisible}
				onCancel={() => setIsVisible(false)}
			>
				<div className="row ">
					<div className="col-12 term__service mb-4">{ReactHtmlParser(termContent && termContent.RulesContent)}</div>
					<div className="col-12">
						<button className="btn btn-primary w-100" onClick={() => setIsVisible(false)}>
							Xác nhận
						</button>
					</div>
				</div>
			</Modal>

			<div className={styles.wrapper}>
				<div className={styles['image-wrapper']}>
					<img src="/images/login-top-icon.png" />
					<img src="/images/login-bottom-icon.png" />
				</div>
				<div className={styles.content}>{children}</div>
			</div>
		</>
	)
}

export default AuthLayout

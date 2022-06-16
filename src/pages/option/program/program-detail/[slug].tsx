import React, { useEffect, useState } from 'react'

import TitlePage from '~/components/TitlePage'
import LayoutBase from '~/components/LayoutBase'

import Curriculum from '~/components/Global/Option/ProgramDetail/Curriculum'
import Subject from '~/components/Global/Option/ProgramDetail/Subject'

import { Tabs, Radio, Card } from 'antd'

const { TabPane } = Tabs

const ProgramDetail = () => {
	const [keyTab, setKeyTab] = useState(null)
	function callback(key) {
		setKeyTab(key)
	}

	return (
		<>
			<div className="row">
				<div className="col-12">
					<TitlePage title="Giáo trình - Bài học" />
				</div>
			</div>
			<Card className="w-100">
				<Tabs defaultActiveKey="1" onChange={callback} type="card">
					<TabPane tab="Bài học" key="1">
						<Subject key={keyTab} />
					</TabPane>
					<TabPane tab="Giáo trình" key="2">
						<Curriculum key={keyTab} />
					</TabPane>
				</Tabs>
			</Card>
		</>
	)
}
ProgramDetail.layout = LayoutBase
export default ProgramDetail

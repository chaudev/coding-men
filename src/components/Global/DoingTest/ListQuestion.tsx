import React from 'react'
import ChoiceList from '~/components/Global/ExamList/ExamShow/ChoiceList'
import MultipleList from '~/components/Global/ExamList/ExamShow/MultipleList'
import MapList from '~/components/Global/ExamList/ExamShow/MapList'
import DragList from '~/components/Global/ExamList/ExamShow/DragList'
import TypingList from '~/components/Global/ExamList/ExamShow/TypingList'
import WrittingList from '~/components/Global/ExamList/ExamShow/WrittingList'
import { ListAlphabet } from '~/lib/list-alphabet/ListAlphabet'
import SpeakingList from '../ExamList/ExamShow/Speaking'
import { useDoneTest } from '~/context/useDoneTest'

type IListQuestion = {
	dataQuestion: IQuestion
	listQuestionID: any
	isMarked: boolean
	showScore: boolean
	setChild?: any
	openPagi?: any
}

const ListQuestion = (props: any): JSX.Element => {
	const { dataQuestion, listQuestionID, isMarked, showScore, setChild, openPagi } = props
	const { doneTestData } = useDoneTest()

	// RETURN QUESTION TYPE
	const returnQuestionType = (dataQuestion: IQuestion) => {
		const type: number = dataQuestion.Type
		switch (type) {
			case 1:
				return (
					<ChoiceList
						showScore={showScore}
						isDoingTest={doneTestData ? false : true}
						listQuestionID={listQuestionID}
						dataQuestion={dataQuestion}
						listAlphabet={ListAlphabet}
					/>
				)
			case 2:
				return (
					<DragList
						isDoingTest={doneTestData ? false : true}
						listQuestionID={listQuestionID}
						dataQuestion={dataQuestion}
						listAlphabet={ListAlphabet}
						setChild={setChild}
						openPagi={openPagi}
					/>
				)
			case 3:
				return (
					<TypingList
						isDoingTest={doneTestData ? false : true}
						listQuestionID={listQuestionID}
						dataQuestion={dataQuestion}
						listAlphabet={ListAlphabet}
					/>
				)
			case 4:
				return (
					<MultipleList
						isDoingTest={doneTestData ? false : true}
						listQuestionID={listQuestionID}
						dataQuestion={dataQuestion}
						listAlphabet={ListAlphabet}
					/>
				)
			case 5:
				return (
					<MapList
						isDoingTest={doneTestData ? false : true}
						listQuestionID={listQuestionID}
						dataQuestion={dataQuestion}
						listAlphabet={ListAlphabet}
					/>
				)
			case 6:
				return (
					<WrittingList
						hideScore={!showScore}
						isDoingTest={doneTestData ? false : true}
						listQuestionID={listQuestionID}
						dataQuestion={dataQuestion}
						listAlphabet={ListAlphabet}
						isMarked={isMarked}
					/>
				)
			case 7:
				return (
					<SpeakingList
						hideScore={!showScore}
						isDoingTest={doneTestData ? false : true}
						listQuestionID={listQuestionID}
						dataQuestion={dataQuestion}
						listAlphabet={ListAlphabet}
						isMarked={isMarked}
					/>
				)
			default:
				return
		}
	}

	return (
		<div className="question-create">
			<div className="card-detail-exam card-detail-question" style={{ height: '100%' }}>
				<div className="question-list" style={{ height: '100%' }}>
					{returnQuestionType(dataQuestion)}
				</div>
			</div>
		</div>
	)
}

export default ListQuestion

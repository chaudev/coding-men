import LayoutBase from '~/components/LayoutBase'
import NewsFeed from '~/components/Global/NewsFeed/NewsFeed'
import React from 'react'

function Home() {
	return (
		<>
			<NewsFeed />
		</>
	)
}

Home.layout = LayoutBase

export default Home

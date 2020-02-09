import React from 'react'
import { Grid, Header } from 'semantic-ui-react'
import Logo from './logo'
import Account from './account'

const IntroPage = () => (
	<Grid centered verticalAlign='middle' className='fullheight'>
		<Grid.Column width={8}>
			<Header>
				<Logo />
			</Header>
			<Header as='h2'>Your bucket list of movies.</Header>
			<p>
				Tell us the movies you want to see before you die, get a group together,
				and we'll decide what's showing at your movie night.
			</p>
			<Account />
		</Grid.Column>
	</Grid>
)

export default IntroPage

import React from 'react'
import { Grid } from 'semantic-ui-react'
import Logo from './logo'
import Account from './account'

const IntroPage = () => (
	<Grid className='middle aligned center aligned fullheight'>
		<Grid.Column className='six wide'>
			<Logo />
			<div className='tagline'></div>
			<Account />
		</Grid.Column>
	</Grid>
)

export default IntroPage

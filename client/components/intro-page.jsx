import React from 'react'
import { Grid } from 'semantic-ui-react'
import Logo from './logo'
import Account from './account'

const IntroPage = () => (
	<Grid centered verticalAlign='middle' className='fullheight'>
		<Grid.Column width={8}>
			<Logo />
			<Account />
		</Grid.Column>
	</Grid>
)

export default IntroPage

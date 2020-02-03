import React from 'react'
import { Grid } from 'semantic-ui-react'
import { route_ } from 'boulevard'
import history from './history'

export default route_({
	getUrl() {
		return history.url
	},

	fourOhFour() {
		return (
			<Grid className='middle aligned center aligned fullheight'>
				<Grid.Column className='six wide'>{history.url} not found</Grid.Column>
			</Grid>
		)
	},
})

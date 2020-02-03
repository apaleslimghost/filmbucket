import React from 'react'
import SearchContainer from './search'
import ListContainer from './movie-list'
import GroupContainer from './group'
import { link } from '../history'
import { Container, Grid, Menu, Item, Header, Icon } from 'semantic-ui-react'

const Dashboard = () => (
	<Container>
		<Grid className='two column divided relaxed stackable'>
			<Grid.Column>
				<Menu className='secondary'>
					<Item className='fitted'>
						<Header>Your list</Header>
					</Item>
					<Item className='right fitted'>
						<SearchContainer />
					</Item>
				</Menu>
				<ListContainer showRemove className='divided relaxed' />
			</Grid.Column>
			<Grid.Column>
				<Menu className='secondary'>
					<Item className='fitted'>
						<Header>Your group</Header>
					</Item>
					<div className='right menu'>
						<Item className='fitted'>
							<a className='ui button primary' href='/choose' onClick={link}>
								<Icon className='film' />
								Choose a movie
							</a>
						</Item>
						<Item className='fitted'>
							<a className='ui button basic' href='/invite' onClick={link}>
								<Icon className='add user' />
								Invite
							</a>
						</Item>
					</div>
				</Menu>
				<GroupContainer />
			</Grid.Column>
		</Grid>
	</Container>
)

export default Dashboard

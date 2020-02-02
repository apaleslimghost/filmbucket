import React from 'react'
import SearchContainer from './search'
import ListContainer from './movie-list'
import GroupContainer from './group'
import { link } from '../history'
import {
	Container,
	Grid,
	Column,
	Menu,
	Item,
	Header,
	Icon,
} from 'react-semantify'

const Dashboard = () => (
	<Container>
		<Grid className='two column divided relaxed stackable'>
			<Column>
				<Menu className='secondary'>
					<Item className='fitted'>
						<Header>Your list</Header>
					</Item>
					<Item className='right fitted'>
						<SearchContainer />
					</Item>
				</Menu>
				<ListContainer className='divided relaxed' showRemove />
			</Column>
			<Column>
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
			</Column>
		</Grid>
	</Container>
)

export default Dashboard

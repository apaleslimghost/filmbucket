import React from 'react';
import Account from './account';
import SearchContainer from './search';
import ListContainer from './movie-list';
import Logo from './logo';
import {Container, Grid, Column, Menu, Item, Header} from 'react-semantify';

const Dashboard = () => <Container>
	<Menu className="text">
		<Item><Header><Logo /></Header></Item>
		<Item className="right"><Account /></Item>
	</Menu>

	<Grid className="two column divided relaxed stackable">
		<Column>
			<Menu className="secondary">
				<Item className="fitted"><Header>Your list</Header></Item>
				<Item className="right fitted"><SearchContainer /></Item>
			</Menu>
			<ListContainer className="divided relaxed" />
		</Column>
		<Column>
			<Menu className="secondary">
				<Item className="fitted"><Header>Your group</Header></Item>
			</Menu>
		</Column>
	</Grid>

</Container>;

export default Dashboard;

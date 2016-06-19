import React from 'react';
import SearchContainer from './search';
import ListContainer from './movie-list';
import GroupContainer from './group';
import {Container, Grid, Column, Menu, Item, Header} from 'react-semantify';

const Dashboard = () => <Container>
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
			<GroupContainer />
		</Column>
	</Grid>
</Container>;

export default Dashboard;

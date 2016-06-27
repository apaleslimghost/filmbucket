import React from 'react';
import SearchContainer from './search';
import ListContainer from './movie-list';
import GroupContainer from './group';
import Invite from './invite';
import {Container, Grid, Column, Menu, Item, Header, Button, Icon} from 'react-semantify';

const Dashboard = () => <Container>
	<Grid className="two column divided relaxed stackable">
		<Column>
			<Menu className="secondary">
				<Item className="fitted"><Header>Your list</Header></Item>
				<Item className="right fitted"><SearchContainer /></Item>
			</Menu>
			<ListContainer className="divided relaxed" showRemove />
		</Column>
		<Column>
			<Menu className="secondary">
				<Item className="fitted"><Header>Your group</Header></Item>
				<div className="right menu">
					<Item className="fitted">
						<Button className="primary">
							<Icon className="film" />
							Choose a movie
						</Button>
					</Item>
					<Item className="fitted">
						<Invite groupId={'lololol'} />
					</Item>
				</div>
			</Menu>
			<GroupContainer />
		</Column>
	</Grid>
</Container>;

export default Dashboard;

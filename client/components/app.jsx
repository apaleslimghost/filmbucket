import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import React, {PropTypes} from 'react';
import IntroPage from './intro-page';
import Logo from './logo';
import Account from './account';
import {Container, Menu, Item, Header} from 'react-semantify';

export const App = ({children, showMenu = true}) => <Container>
	{showMenu && <Menu className="text">
		<Item><Header><Logo /></Header></Item>
		<Item className="right"><Account /></Item>
	</Menu>}

	{children}
</Container>;

App.propTypes = {
	children: PropTypes.node.isRequired,
	showMenu: PropTypes.bool,
};

const AppContainer = createContainer(({router}) => ({
	children: Meteor.user() ? router() : <IntroPage />,
	showMenu: !!Meteor.user(),
}), App);

export default AppContainer;

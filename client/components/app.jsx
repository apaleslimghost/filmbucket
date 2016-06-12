import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import React, {PropTypes} from 'react';
import Dashboard from './dashboard';
import IntroPage from './intro-page';
import Logo from './logo';
import Account from './account';
import {Container, Menu, Item, Header} from 'react-semantify';

export const App = ({loggedIn}) => (loggedIn ? <Container>
	<Menu className="text">
		<Item><Header><Logo /></Header></Item>
		<Item className="right"><Account /></Item>
	</Menu>

	<Dashboard />
</Container> : <IntroPage />);

App.propTypes = {
	loggedIn: PropTypes.bool,
};

const AppContainer = createContainer(() => ({
	loggedIn: !!Meteor.user(),
}), App);

export default AppContainer;

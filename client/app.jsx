import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import React, {PropTypes} from 'react';
import Dashboard from './dashboard';
import IntroPage from './intro-page';

export const App = ({loggedIn}) => (loggedIn ? <Dashboard /> : <IntroPage />);

App.propTypes = {
	loggedIn: PropTypes.bool,
};

const AppContainer = createContainer(() => ({
	loggedIn: !!Meteor.user(),
}), App);

export default AppContainer;

import {Meteor} from 'meteor/meteor';
import React, {PropTypes} from 'react';
import {render} from 'react-dom';
import App from './app';

Meteor.startup(() => {
	render(<App />, document.querySelector('main'));
});

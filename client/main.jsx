import {Meteor} from 'meteor/meteor';
import React from 'react';
import {render} from 'react-dom';
import App from './components/app';

Meteor.startup(() => {
	render(<App />, document.querySelector('main'));
});

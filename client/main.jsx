import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import React from 'react';
import {render} from 'react-dom';
import App from './components/app';
import {Groups} from '../shared/collections';

Meteor.startup(() => {
	render(<App />, document.querySelector('main'));
});

Accounts.onLogin(() => {
	if (!Groups.find({members: Meteor.userId()}).count()) {
		Groups.insert({members: [Meteor.userId()]});
	}
});

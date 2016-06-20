import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import React from 'react';
import {render} from 'react-dom';
import App from './components/app';
import qs from 'querystring';
import {Groups} from '../shared/collections';

Meteor.startup(() => {
	render(<App />, document.querySelector('main'));
});

Accounts.onLogin(() => {
	if (location.search) {
		const {group} = qs.parse(location.search.slice(1));
		Groups.update({_id: group}, {$addToSet: {members: Meteor.userId()}});
	}
});

import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Accounts} from 'meteor/accounts-base';
import React from 'react';
import {render} from 'react-dom';
import App from './components/app';
import qs from 'querystring';

Meteor.startup(() => {
	render(<App />, document.querySelector('main'));
});

Accounts.onLogin(() => {
	const {group} = qs.parse(location.search.slice(1));
	Meteor.call('ensureGroup', group);
});

Template.loginReplacement.replaces('_loginButtonsLoggedInSingleLogoutButton');

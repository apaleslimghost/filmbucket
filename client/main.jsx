import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Accounts} from 'meteor/accounts-base';
import React from 'react';
import {render} from 'react-dom';
import qs from 'querystring';
import route from './router';

import App from './components/app';
import Dashboard from './components/dashboard';

const router = route({
	'/': () => <Dashboard />,
	'/test': () => <h1>Test</h1>,
});

Meteor.startup(() => {
	render(<App router={router} />, document.querySelector('main'));
});

Accounts.onLogin(() => {
	const {group} = qs.parse(location.search.slice(1));
	Meteor.call('ensureGroup', group);
});

Template.loginReplacement.replaces('_loginButtonsLoggedInSingleLogoutButton');

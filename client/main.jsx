import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Accounts} from 'meteor/accounts-base';
import {ReactiveDict} from 'meteor/reactive-dict';
import {ReactiveVar} from 'meteor/reactive-var';
import React from 'react';
import {render} from 'react-dom';
import qs from 'querystring';
import route from './router';

import App from './components/app';
import Dashboard from './components/dashboard';
import Choose from './components/choose';

const router = route({
	'/': () => <Dashboard />,
	'/choose': () => {
		const selected = new ReactiveDict();
		const step = new ReactiveVar(0);
		const nextStep = () => step.set(step.get() + 1);
		const chooser = new ReactiveVar();
		return <Choose {...{selected, step, nextStep, chooser}} />;
	},
});

Meteor.startup(() => {
	render(<App router={router} />, document.querySelector('main'));
});

Accounts.onLogin(() => {
	const {group} = qs.parse(location.search.slice(1));
	Meteor.call('ensureGroup', group);
});

Template.loginReplacement.replaces('_loginButtonsLoggedInSingleLogoutButton');
// eslint-disable-next-line no-underscore-dangle
Template._loginButtonsLoggedInSingleLogoutButton.helpers({
	avatar() {
		if (Meteor.user()) {
			return Meteor.user().profile.picture;
		}
	},
});

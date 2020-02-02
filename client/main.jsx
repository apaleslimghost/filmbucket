import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Accounts } from 'meteor/accounts-base'
import { ReactiveDict } from 'meteor/reactive-dict'
import { ReactiveVar } from 'meteor/reactive-var'
import React from 'react'
import { render } from 'react-dom'
import qs from 'querystring'
import route from './router'

import App from './components/app'
import Dashboard from './components/dashboard'
import Choose from './components/choose'
import Invite from './components/invite'

const router = route({
	'/': () => <Dashboard />,
	'/choose': () => (
		<Choose
			selected={new ReactiveDict()}
			step={new ReactiveVar(0)}
			chooser={new ReactiveVar()}
			random={new ReactiveVar()}
			chosenMovie={new ReactiveVar()}
		/>
	),
	'/invite': () => <Invite />,
})

Meteor.startup(() => {
	render(<App router={router} />, document.querySelector('main'))
})

Accounts.onLogin(() => {
	const { group, invitedBy } = qs.parse(location.search.slice(1))
	Meteor.call('ensureGroup', group, invitedBy)
})

Template.loggedInSingleLogoutButtonReplacement.replaces(
	'_loginButtonsLoggedInSingleLogoutButton',
)
// eslint-disable-next-line no-underscore-dangle
Template._loginButtonsLoggedInSingleLogoutButton.helpers({
	avatar() {
		if (Meteor.user()) {
			return Meteor.user().profile.picture
		}
	},
})

Template.loggedOutSingleLoginButtonReplacement.replaces(
	'_loginButtonsLoggedOutSingleLoginButton',
)
// eslint-disable-next-line no-underscore-dangle
Template._loginButtonsLoggedOutSingleLoginButton.helpers({
	invitedBy() {
		return Template.instance().invitedBy
	},
})
// eslint-disable-next-line no-underscore-dangle
Template._loginButtonsLoggedOutSingleLoginButton.onRendered(
	function onRendered() {
		const { invitedBy } = qs.parse(location.search.slice(1))
		if (invitedBy) {
			this.autorun(() => {
				this.subscribe('invitedUser', invitedBy, () => {
					this.invitedBy = Meteor.users.findOne(invitedBy).profile.name
				})
			})
		}
	},
)

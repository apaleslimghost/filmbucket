import { Meteor } from 'meteor/meteor'
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

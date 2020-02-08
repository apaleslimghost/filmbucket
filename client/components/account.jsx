import React, { useState } from 'react'
import { Form, Button, Tab, Message } from 'semantic-ui-react'
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

const LoginFields = ({ email, setEmail, password, setPassword }) => (
	<>
		<Form.Input
			placeholder='user@example.com'
			iconPosition='left'
			icon='at'
			type='email'
			name='email'
			value={email}
			onChange={event => setEmail(event.target.value)}
		/>
		<Form.Input
			placeholder='password'
			iconPosition='left'
			icon='lock'
			type='password'
			name='password'
			value={password}
			onChange={event => setPassword(event.target.value)}
		/>
	</>
)

function Login({ email, setEmail, password, setPassword }) {
	const [error, setError] = useState(null)
	function login(event) {
		event.preventDefault()

		Meteor.loginWithPassword(email, password, error => {
			if (error) {
				setError(error.reason || error.message)
			}
		})
	}

	return (
		<Form onSubmit={login}>
			{error && <Message negative>{error}</Message>}
			<LoginFields {...{ email, setEmail, password, setPassword }} />
			<Button
				positive
				icon='user'
				labelPosition='left'
				content='Log in'
				type='submit'
			/>
		</Form>
	)
}

function CreateAccount({ email, setEmail, password, setPassword }) {
	const [error, setError] = useState(null)
	const [name, setName] = useState('')

	function createAccount(event) {
		event.preventDefault()

		Accounts.createUser({ email, password, profile: { name } }, error => {
			if (error) {
				setError(error.reason || error.message)
			}
		})
	}

	return (
		<Form onSubmit={createAccount}>
			{error && <Message negative>{error}</Message>}
			<Form.Input
				iconPosition='left'
				icon='id badge'
				placeholder='Leia Organa'
				name='name'
				value={name}
				onChange={event => setName(event.target.value)}
			/>
			<LoginFields {...{ email, setEmail, password, setPassword }} />
			<Button
				icon='user plus'
				labelPosition='left'
				content='Create account'
				type='submit'
			/>
		</Form>
	)
}

export default function Account() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	return (
		<Tab
			menu={{ secondary: true, pointing: true }}
			panes={[
				{
					menuItem: { key: 'login', icon: 'user', content: 'Log in' },
					render: () => (
						<Login {...{ email, setEmail, password, setPassword }} />
					),
				},
				{
					menuItem: {
						key: 'create',
						icon: 'user plus',
						content: 'Create account',
					},
					render: () => (
						<CreateAccount {...{ email, setEmail, password, setPassword }} />
					),
				},
			]}
		/>
	)
}

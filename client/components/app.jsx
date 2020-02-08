import { Meteor } from 'meteor/meteor'
import { withTracker, useTracker } from 'meteor/react-meteor-data'
import React from 'react'
import IntroPage from './intro-page'
import Logo from './logo'
import {
	Container,
	Menu,
	Item,
	Header,
	Image,
	Dropdown,
} from 'semantic-ui-react'
import c from 'classnames'
import { gravatarUrl } from '../../shared/image-url'

function User() {
	const user = useTracker(() => Meteor.user())
	const image = user && gravatarUrl(user.emails[0].address)

	return (
		user && (
			<Dropdown
				trigger={
					<div>
						<Image avatar src={image} alt={user.emails[0].address} />
						<span>{user.profile.name}</span>
					</div>
				}
				icon={null}
				options={[
					{
						key: 'logout',
						text: 'Log out',
						icon: 'sign out',
						onClick() {
							Meteor.logout()
						},
					},
				]}
			/>
		)
	)
}

export const App = ({ children, showMenu = true }) => (
	<Container className={c({ fullheight: !showMenu })}>
		{showMenu && (
			<Menu className='text'>
				<Item>
					<Header>
						<Logo size='small' />
					</Header>
				</Item>
				<Item className='right'>
					<User />
				</Item>
			</Menu>
		)}

		{children}
	</Container>
)

const connectApp = withTracker(({ router }) => ({
	children: Meteor.user() ? router() : <IntroPage />,
	showMenu: Boolean(Meteor.user()),
}))

export default connectApp(App)

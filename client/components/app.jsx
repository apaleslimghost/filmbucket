import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import IntroPage from './intro-page'
import Logo from './logo'
import Account from './account'
import { Container, Menu, Item, Header } from 'semantic-ui-react'
import c from 'classnames'

export const App = ({ children, showMenu = true }) => (
	<Container className={c({ fullheight: !showMenu })}>
		{showMenu && (
			<Menu className='text'>
				<Item>
					<Header>
						<Logo />
					</Header>
				</Item>
				<Item className='right'>
					<Account />
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

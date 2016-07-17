import React, {PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import {Button, Icon, Grid, Column, Loader, Input, Header} from 'react-semantify';
import copyToClipboard from 'copy-to-clipboard';
import qs from 'querystring';
import {Groups} from '../../shared/collections';

const Invite = ({inviteUrl, loading, selectInput}) => (loading ? <Loader /> : <Grid className="center aligned">
	<Column className="six wide">
		<Header>Invite users</Header>
		<p>{'Send new users the link below to invite them to your group. When they sign up, they\'ll automatically become a member. They\'ll see your name on the sign up page.'}</p>
		<Input className="right action large fluid">
			<input readOnly type="url" value={inviteUrl} onFocus={selectInput} />
			<Button className="blue icon" onClick={() => copyToClipboard(inviteUrl)}>
				<Icon className="copy" />
			</Button>
		</Input>
	</Column>
</Grid>);

Invite.propTypes = {
	inviteUrl: PropTypes.string.isRequired,
};

const InviteContainer = createContainer(() => {
	const sub = Meteor.subscribe('group');
	const group = Groups.findOne({members: Meteor.userId()});

	return {
		loading: !sub.ready(),
		inviteUrl: sub.ready() ? Meteor.absoluteUrl(`?${qs.stringify({
			group: group._id,
			invitedBy: Meteor.userId(),
		})}`) : '',

		selectInput(ev) {
			ev.currentTarget.select();
		},

		copyUrl() {

		},
	};
}, Invite);

export default InviteContainer;

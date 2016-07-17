import React, {PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import {Button, Icon, Grid, Column, Loader, Input, Header} from 'react-semantify';
import copyToClipboard from 'copy-to-clipboard';
import qs from 'querystring';
import {Groups} from '../../shared/collections';

const Invite = ({
	inviteUrl,
	loading,
	selectInput,
	copyUrl,
	helpText,
}) => (loading ? <Loader /> : <Grid className="center aligned">
	<Column className="six wide">
		<Header>Invite users</Header>
		<p>{helpText}</p>
		<Input className="right action large fluid">
			<input readOnly type="url" value={inviteUrl} onFocus={selectInput} />
			<Button className="blue icon" onClick={copyUrl}>
				<Icon className="copy" />
			</Button>
		</Input>
	</Column>
</Grid>);

Invite.propTypes = {
	inviteUrl: PropTypes.string.isRequired,
	selectInput: PropTypes.func,
	copyUrl: PropTypes.func,
	loading: PropTypes.bool,
	helpText: PropTypes.string,
};

const InviteContainer = createContainer(() => {
	const sub = Meteor.subscribe('group');
	const group = Groups.findOne({members: Meteor.userId()});
	const inviteUrl = sub.ready() ? Meteor.absoluteUrl(`?${qs.stringify({
		group: group._id,
		invitedBy: Meteor.userId(),
	})}`) : '';

	return {
		loading: !sub.ready(),
		inviteUrl,

		selectInput(ev) {
			ev.currentTarget.select();
		},

		copyUrl() {
			copyToClipboard(inviteUrl);
		},

		helpText: `Send new users the link below to invite them to your group. When
		they sign up, they'll automatically become a member. They'll see your name on
		the signup page.`,
	};
}, Invite);

export default InviteContainer;

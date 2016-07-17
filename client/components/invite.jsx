import React, {PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';
import {ReactiveVar} from 'meteor/reactive-var';
import {createContainer} from 'meteor/react-meteor-data';
import {Icon, Grid, Column, Loader, Input, Header, Label, Divider} from 'react-semantify';
import copyToClipboard from 'copy-to-clipboard';
import qs from 'querystring';
import {Groups} from '../../shared/collections';
import c from 'classnames';

const Invite = ({
	inviteUrl,
	loading,
	selectInput,
	copyUrl,
	helpText,
	copied,
}) => (loading ? <Loader /> : <Grid className="center aligned">
	<Column className="six wide">
		<Header>Invite users</Header>
		<div className="field">
			<Label className="right pointing outside basic blue">
				Send this link to invite
			</Label>
			<Input className="fluid icon muted">
				<input readOnly type="url" value={inviteUrl} onFocus={selectInput} />
				<Icon
					className={c(
						'circular link',
						{
							'check inverted green': copied,
							'copy inverted': !copied,
						}
					)}
					onClick={copyUrl}
				/>
			</Input>
		</div>
		<Divider className="section" />
		<p className="muted">{helpText}</p>
	</Column>
</Grid>);

Invite.propTypes = {
	inviteUrl: PropTypes.string.isRequired,
	selectInput: PropTypes.func,
	copyUrl: PropTypes.func,
	loading: PropTypes.bool,
	helpText: PropTypes.string,
	copied: PropTypes.bool,
};

const copied = new ReactiveVar(false);

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
		copied: copied.get(),

		selectInput(ev) {
			ev.currentTarget.select();
		},

		copyUrl() {
			copyToClipboard(inviteUrl);
			copied.set(true);
		},

		helpText: `Send new users the link to invite them to your group. When
		they sign up, they'll automatically become a member. They'll see your name on
		the signup page.`,
	};
}, Invite);

export default InviteContainer;

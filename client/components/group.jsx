import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {Groups} from '../../shared/collections';

export const Group = ({users}) => <ul>
{users.map(user => <li key={user._id}>{user.profile.name}</li>)}
</ul>;

const GroupContainer = createContainer(() => {
	const groupCursor = Meteor.subscribe('group');
	const group = Groups.findOne({members: Meteor.userId()});
	return {
		loading: !groupCursor.ready(),
		group,
		users: Meteor.users.find({_id: {$in: group ? group.members : []}}).fetch(),
	};
}, Group);

export default GroupContainer;

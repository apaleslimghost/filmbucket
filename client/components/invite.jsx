import React, {PropTypes} from 'react';
import {Button, Icon} from 'react-semantify';
import copyToClipboard from 'copy-to-clipboard';

const Invite = ({groupId}) => <div>
	<Button className="basic" onClick={() => copyToClipboard(groupId)}>
		<Icon className="add user" />
		Invite
	</Button>
</div>;

Invite.propTypes = {
	groupId: PropTypes.string.isRequired,
};

export default Invite;

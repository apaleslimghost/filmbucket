import React, {PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';
import {ReactiveDict} from 'meteor/reactive-dict';
import {ReactiveVar} from 'meteor/reactive-var';
import {createContainer} from 'meteor/react-meteor-data';
import {Header, Divider, List, Item, Image, Loader, Icon, Button} from 'react-semantify';
import {Groups} from '../../shared/collections';
import c from 'classnames';

export const Choose = ({
	users,
	loading,
	usersSelected,
	toggleSelected,
	nextStep,
	step,
}) => <div>
	{loading ? <Loader /> : <div>
		<Header>Who's here?</Header>
		<List className="horizontal">
			{users.map(user => <Item key={user._id}>
				<a
					className={c('ui label image large', {green: usersSelected[user._id]})}
					onClick={() => toggleSelected(user)}
				>
					<Image src={user.profile.picture} />
					{user.profile.name}
					{usersSelected[user._id] && <div className="detail"><Icon className="check" /></div>}
				</a>
			</Item>)}
		</List>

		{step >= 1 && <div>
			<Divider />
			<Header>Matt Brennan, it's your turn</Header>
		</div>}

		<Divider className="horizontal header">
			<Button className="basic green circular small" onClick={nextStep}>Next...</Button>
		</Divider>
	</div>}
</div>;

Choose.propTypes = {
	users: PropTypes.array,
	loading: PropTypes.bool,
	usersSelected: PropTypes.object,
	toggleSelected: PropTypes.func,
	nextStep: PropTypes.func,
	step: PropTypes.number,
};

const selected = new ReactiveDict();
const step = new ReactiveVar(0);

export default createContainer(() => {
	const groupCursor = Meteor.subscribe('group');
	const group = Groups.findOne({members: Meteor.userId()});

	return {
		loading: !groupCursor.ready(),
		users: Meteor.users.find({_id: {$in: group ? group.members : []}}).fetch(),
		usersSelected: selected.all(),
		toggleSelected({_id}) {
			selected.set(_id, !selected.get(_id));
		},
		nextStep() {
			step.set(step.get() + 1);
		},
		step: step.get(),
	};
}, Choose);

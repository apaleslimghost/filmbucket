import React, {PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';
import {createContainer} from 'meteor/react-meteor-data';
import {Header, Divider, List, Item, Image, Loader, Icon, Button} from 'react-semantify';
import {Groups} from '../../shared/collections';
import c from 'classnames';
import belowMedian from '@quarterto/below-median';
import intersection from 'lodash.intersection';
import size from 'lodash.size';
import joinAndKey from '../join-and-key';

export const Choose = ({
	users,
	loading,
	usersSelected,
	toggleSelected,
	getChooser,
	chooser,
	step,
}) => <div>
	{loading ? <Loader /> : <div>{joinAndKey([
		() => [
			<Header>Who's here?</Header>,
			<List className="horizontal">
				{users.map(user => <Item key={user._id}>
					<a
						className={c('ui label image large', {green: usersSelected[user._id]})}
						onClick={() => toggleSelected(user)}
					>
						<Image src={user.profile.picture} />
						{user.profile.name}
						{usersSelected[user._id] &&
							<div className="detail"><Icon className="fitted check" /></div>
						}
					</a>
				</Item>)}
			</List>,

			<Divider className={c({horizontal: step === 0 && !!size(usersSelected)}, 'header')}>
				{step === 0 && !!size(usersSelected) &&
					<Button className="basic green circular small" onClick={getChooser}>Next...</Button>}
			</Divider>,
		],
		() => [
			<Header>{chooser.profile.name}, it's your turn</Header>,
			<Divider className={c({horizontal: step === 1}, 'header')}>
				{step === 1 &&
					<div className="ui buttons small">
						<Button className="purple" onClick={() => alert('random')}>
							<Icon className="shuffle" />
							Random movie
						</Button>
						<div className="or" />
						<Button onClick={() => alert('choose')}>Choose a movie</Button>
					</div>}
			</Divider>,
		],
	].slice(0, step + 1).map(f => f()))}</div>}
</div>;

Choose.propTypes = {
	users: PropTypes.array,
	loading: PropTypes.bool,
	usersSelected: PropTypes.object,
	toggleSelected: PropTypes.func,
	getChooser: PropTypes.func,
	step: PropTypes.number,
	chooser: PropTypes.object,
};

export default createContainer(({selected, step, nextStep, chooser}) => {
	const groupCursor = Meteor.subscribe('group');
	const group = Groups.findOne({members: Meteor.userId()});
	const selectedUsers = Object.keys(selected.all());

	return {
		loading: !groupCursor.ready(),
		users: Meteor.users.find({_id: {$in: group ? group.members : []}}).fetch(),
		usersSelected: selected.all(),
		toggleSelected({_id}) {
			selected.set(_id, !selected.get(_id));
		},
		step: step.get(),
		chooser: Meteor.users.findOne({_id: chooser.get()}),
		getChooser() {
			const chosen = group.chosen || [];
			const notChosenMuch = belowMedian(intersection(chosen, selectedUsers));
			const validChoosers = notChosenMuch.length ? notChosenMuch : selectedUsers;
			chooser.set(Random.choice(validChoosers));
			nextStep();
		},
	};
}, Choose);

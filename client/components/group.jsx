import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {Groups, UserMovies, Movies} from '../../shared/collections';
import {List, Item, Header, Content} from 'react-semantify';
import groupBy from 'lodash.groupby';
import mapValues from 'lodash.mapvalues';

const Member = ({user, movies}) => <Item>
	<Header>{user.profile.name}</Header>
	{
		movies.length ?
		<List className="horizontal">
			{movies.map(movie => <Item key={movie._id}>{movie.Title}</Item>)}
		</List> :
		<Content>
			No movies yet! {
				user._id === Meteor.userId() && 'Add some on the left.'
			}
		</Content>
	}
</Item>;

export const Group = ({users, movies}) => <List>
{users.map(user => <Member key={user._id} user={user} movies={movies[user._id] || []} />)}
</List>;

const GroupContainer = createContainer(() => {
	const groupCursor = Meteor.subscribe('group');
	const group = Groups.findOne({members: Meteor.userId()});
	const userMovies = UserMovies.find({
		owner: {
			$in: group ? group.members : [],
		},
	}).fetch();
	const userMoviesByOwner = groupBy(userMovies, userMovie => userMovie.owner);
	const moviesByOwner = mapValues(
		userMoviesByOwner,
		movies => movies.map(
			({movie}) => Movies.findOne(movie) || {}
		)
	);

	return {
		loading: !groupCursor.ready(),
		group,
		movies: moviesByOwner,
		users: Meteor.users.find({_id: {$in: group ? group.members : []}}).fetch(),
	};
}, Group);

export default GroupContainer;

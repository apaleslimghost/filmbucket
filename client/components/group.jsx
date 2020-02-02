import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import { Groups, UserMovies, Movies } from '../../shared/collections'
import { List, Item, Header, Content, Divider } from 'react-semantify'
import groupBy from 'lodash.groupby'
import mapValues from 'lodash.mapvalues'
import HorizontalMovieList from './horizontal-movie-list'

const Member = ({ user, movies, seeMovie, group }) => (
	<Item>
		<Header>{user._id === Meteor.userId() ? 'You' : user.profile.name}</Header>
		{movies.length ? (
			<div>
				<HorizontalMovieList
					movies={movies}
					seen={group.seen}
					selectMovie={seeMovie}
				/>
			</div>
		) : (
			<Content>
				<p className='muted'>
					No movies yet!{' '}
					{user._id === Meteor.userId() && 'Add some on the left.'}
				</p>
			</Content>
		)}
	</Item>
)

const MemberContainer = createContainer(() => {
	const group = Groups.findOne({ members: Meteor.userId() })
	return {
		group,
		seeMovie(id) {
			const seen = (group.seen || []).indexOf(id) >= 0
			Groups.update(
				{ _id: group._id },
				{
					[seen ? '$pull' : '$addToSet']: {
						seen: id,
					},
				},
			)
		},
	}
}, Member)

export const Group = ({ users, moviesByOwner }) => (
	<div>
		<List>
			{users.map(user => (
				<MemberContainer
					key={user._id}
					user={user}
					movies={moviesByOwner[user._id] || []}
				/>
			))}
		</List>
		<Divider />
		<p className='muted'>Tap the movies your group's already seen.</p>
	</div>
)

const GroupContainer = createContainer(() => {
	const groupCursor = Meteor.subscribe('group')
	const group = Groups.findOne({ members: Meteor.userId() })
	const userMovies = UserMovies.find({
		owner: {
			$in: group ? group.members : [],
		},
	}).fetch()
	const userMoviesByOwner = groupBy(userMovies, userMovie => userMovie.owner)
	const moviesByOwner = mapValues(userMoviesByOwner, movies =>
		movies.map(({ movie }) => Movies.findOne(movie) || {}),
	)

	return {
		loading: !groupCursor.ready(),
		group,
		moviesByOwner,
		users: Meteor.users
			.find({ _id: { $in: group ? group.members : [] } })
			.fetch(),
	}
}, Group)

export default GroupContainer

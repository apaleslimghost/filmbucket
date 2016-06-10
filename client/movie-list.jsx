import React, {PropTypes} from 'react';
import {List} from 'react-semantify';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import Movie from './movie';
import {Movies, UserMovies} from '../shared/collections';
import component from './component';

export const MovieList = ({
	movies,
	selectMovie,
	itemWrapper,
	wrapper: Wrap = List,
}) => <Wrap>
	{movies.map(
		movie => <Movie movie={movie} selectMovie={selectMovie} key={movie._id} wrapper={itemWrapper} />
	)}
</Wrap>;

MovieList.propTypes = {
	movies: PropTypes.array.isRequired,
	selectMovie: PropTypes.func,
	itemWrapper: component,
	wrapper: component,
};

const ListContainer = createContainer(() => {
	const userMoviesCursor = Meteor.subscribe('usermovies');
	const userMovieIds = UserMovies.find({
		owner: Meteor.userId(),
	}).fetch().map(({movie}) => movie);

	return {
		movies: Movies.find({
			_id: {$in: userMovieIds},
		}).fetch(),
		loading: !userMoviesCursor.ready(),
	};
}, MovieList);

export default ListContainer;

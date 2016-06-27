import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import React, {PropTypes} from 'react';
import {Content, Header, Icon, Image, Item, Label, Button} from 'react-semantify';
import component from '../component';
import imageUrl from '../../shared/image-url';
import {UserMovies} from '../../shared/collections';
import keyBy from 'lodash.keyby';

export const Movie = ({
	movie,
	selectMovie = () => {},
	showContent = true,
	wrapper: Wrap = Item,
	removeMovie,
	showRemove,
}) => <Wrap onClick={() => selectMovie(movie._id)} movie={movie}>
	{movie.posterPath &&
		<Image src={imageUrl(movie.posterPath, {size: 'w92'})} className="mini rounded" />
	}
	{showContent && <Content>
		<Header className="small">{movie.title}</Header>
		<div className="description">
			{movie.releaseDate && <Label className="small">
				<Icon className="calendar" />
				{new Date(movie.releaseDate).getFullYear()}
			</Label>}
			{!!movie.voteCount && <Label className="small">
				<Icon className="star" />
				{movie.voteAverage}
			</Label>}
			{showRemove &&
				<Button onClick={() => removeMovie(movie)} className="small negative right">
					<Icon className="remove" />
					Remove from list
				</Button>
			}
		</div>
	</Content>}
</Wrap>;

Movie.propTypes = {
	movie: PropTypes.object.isRequired,
	selectMovie: PropTypes.func,
	showContent: PropTypes.bool,
	wrapper: component,
	showRemove: PropTypes.bool,
	removeMovie: PropTypes.func,
};

const MovieContainer = createContainer(({showRemove}) => {
	const userMoviesCursor = Meteor.subscribe('usermovies');
	const userMovies = UserMovies.find({
		owner: Meteor.userId(),
	}).fetch();
	const movieMap = keyBy(userMovies, 'movie');

	return {
		showRemove: userMoviesCursor.ready() && showRemove,
		removeMovie({_id}) {
			const userMovie = movieMap[_id];
			UserMovies.remove(userMovie._id);
		},
	};
}, Movie);

export default MovieContainer;

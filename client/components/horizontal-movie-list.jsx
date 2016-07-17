import React, {PropTypes} from 'react';
import {List} from 'react-semantify';
import Movie from './movie';
import {Result} from './result';
import SeenDim from './seen-dim';

const HorizontalMovieList = ({
	movies,
	seen,
	selectMovie,
}) => <List className="horizontal">
	{movies.map(movie =>
		<Movie
			key={movie._id}
			movie={movie}
			showContent={false}
			selectMovie={selectMovie}
			wrapper={Result}
			wrapProps={{
				className: 'item',
				dim: seen && seen.indexOf(movie._id) >= 0,
				dimmer: SeenDim,
				dimBlocksClick: false,
			}}
		/>
	)}
</List>;

HorizontalMovieList.propTypes = {
	movies: PropTypes.array.isRequired,
	seen: PropTypes.array,
	selectMovie: PropTypes.func,
};

export default HorizontalMovieList;

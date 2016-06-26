import React, {PropTypes} from 'react';
import {Content, Header, Icon, Image, Item, Label} from 'react-semantify';
import component from '../component';
import imageUrl from '../../shared/image-url';

const Movie = ({
	movie,
	selectMovie = () => {},
	showContent = true,
	wrapper: Wrap = Item,
}) => <Wrap onClick={() => selectMovie(movie._id)} movie={movie}>
	{movie.posterPath &&
		<Image src={imageUrl(movie.posterPath, {size: 'w92'})} className="mini rounded" />
	}
	{showContent && <Content>
		<Header className="small">{movie.title}</Header>
		<div className="description">
			{movie.releaseDate && <Label>
				<Icon className="calendar" />
				{new Date(movie.releaseDate).getFullYear()}
			</Label>}
			{!!movie.voteCount && <Label>
				<Icon className="star" />
				{movie.voteAverage}
			</Label>}
		</div>
	</Content>}
</Wrap>;

Movie.propTypes = {
	movie: PropTypes.object.isRequired,
	selectMovie: PropTypes.func,
	showContent: PropTypes.bool,
	wrapper: component,
};

export default Movie;

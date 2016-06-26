import React, {PropTypes} from 'react';
import {Content, Header, Icon, Image, Item, Label, Button} from 'react-semantify';
import component from '../component';
import imageUrl from '../../shared/image-url';

const Movie = ({
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

export default Movie;

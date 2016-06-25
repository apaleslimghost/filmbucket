import React, {PropTypes} from 'react';
import {Content, Header, Icon, Image, Item, Label} from 'react-semantify';
import component from '../component';
import imageUrl from '../../shared/image-url';

const Movie = ({
	movie: {title, posterPath, releaseDate, _id},
	selectMovie = () => {},
	showContent = true,
	wrapper: Wrap = Item,
}) => <Wrap onClick={() => selectMovie(_id)}>
	{posterPath && <Image src={imageUrl(posterPath, {size: 'w92'})} className="mini" />}
	{showContent && <Content>
		<Header className="small">{title}</Header>
		<div className="description">
			<Label>
				<Icon className="calendar" />
				{new Date(releaseDate).getFullYear()}
			</Label>
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

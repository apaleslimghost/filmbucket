import React, {PropTypes} from 'react';
import {Content, Header, Icon, Image, Item, Label} from 'react-semantify';
import component from '../component';

const Movie = ({
	movie: {Title, Poster, Year, _id},
	selectMovie = () => {},
	showContent = true,
	wrapper: Wrap = Item,
}) => <Wrap onClick={() => selectMovie(_id)}>
	{Poster !== 'N/A' && <Image src={Poster} className="mini" />}
	{showContent && <Content>
		<Header className="small">{Title}</Header>
		<div className="description">
			<Label>
				<Icon className="calendar" />
				{Year}
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

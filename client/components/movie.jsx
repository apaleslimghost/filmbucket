import React, {PropTypes} from 'react';
import {Content, Header, Icon, Image, Item, Label} from 'react-semantify';
import component from '../component';

const Movie = ({
	movie: {title, poster, year, _id},
	selectMovie = () => {},
	showContent = true,
	wrapper: Wrap = Item,
}) => <Wrap onClick={() => selectMovie(_id)}>
	{poster !== 'N/A' && <Image src={poster} className="mini" />}
	{showContent && <Content>
		<Header className="small">{title}</Header>
		<div className="description">
			<Label>
				<Icon className="calendar" />
				{year}
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

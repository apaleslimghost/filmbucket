import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import {
	Container,
	Header,
	Icon,
	Image,
	Item,
	Label,
	Button,
} from 'semantic-ui-react'
import imageUrl from '../../shared/image-url'
import { UserMovies } from '../../shared/collections'
import keyBy from 'lodash.keyby'

export const Movie = ({
	movie,
	selectMovie = () => {},
	showContent = true,
	wrapper: Wrap = Item,
	removeMovie,
	showRemove,
	wrapProps = {},
	imageSize = 'mini',
}) => (
	<Wrap
		movie={movie}
		className='movie'
		onClick={() => selectMovie(movie._id)}
		{...wrapProps}
	>
		{movie.posterPath && (
			<Item.Image
				rounded
				src={imageUrl(movie.posterPath, { size: 'w92' })}
				size={imageSize}
			/>
		)}
		{showContent && (
			<Item.Content>
				<Item.Header>{movie.title}</Item.Header>
				<Item.Extra>{movie.tagline}</Item.Extra>
				<Item.Description>
					{movie.releaseDate && (
						<Label className='small'>
							<Icon className='calendar' />
							<span>{new Date(movie.releaseDate).getFullYear()}</span>
						</Label>
					)}
					{Boolean(movie.voteCount) && (
						<Label className='small'>
							<Icon className='star' />
							<span>{movie.voteAverage}</span>
						</Label>
					)}
				</Item.Description>
			</Item.Content>
		)}
		{showRemove && (
			<Item.Extra>
				<Button
					floated='right'
					className='mini red circular basic icon'
					onClick={() => removeMovie(movie)}
				>
					<Icon className='remove' />
				</Button>
			</Item.Extra>
		)}
	</Wrap>
)

const MovieContainer = withTracker(({ showRemove }) => {
	const userMoviesCursor = Meteor.subscribe('usermovies')
	const userMovies = UserMovies.find({
		owner: Meteor.userId(),
	}).fetch()
	const movieMap = keyBy(userMovies, 'movie')

	return {
		showRemove: userMoviesCursor.ready() && showRemove,
		removeMovie({ _id }) {
			const userMovie = movieMap[_id]
			UserMovies.remove(userMovie._id)
		},
	}
})(Movie)

export default MovieContainer

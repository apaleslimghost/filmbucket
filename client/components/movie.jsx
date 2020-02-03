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
		onClick={() => selectMovie(movie._id)}
		movie={movie}
		className='movie'
		{...wrapProps}
	>
		{showRemove && (
			<Container className='right floated'>
				<Button
					onClick={() => removeMovie(movie)}
					className='mini red circular basic icon'
				>
					<Icon className='remove' />
				</Button>
			</Container>
		)}
		{movie.posterPath && (
			<div className='image'>
				<Image
					src={imageUrl(movie.posterPath, { size: 'w92' })}
					className={`${imageSize} rounded`}
				/>
			</div>
		)}
		{showContent && (
			<Container>
				<Header className='small'>{movie.title}</Header>
				<p className='muted'>{movie.tagline}</p>
				<div className='description'>
					{movie.releaseDate && (
						<Label className='small'>
							<Icon className='calendar' />
							<span>{new Date(movie.releaseDate).getFullYear()}</span>
						</Label>
					)}
					{!!movie.voteCount && (
						<Label className='small'>
							<Icon className='star' />
							<span>{movie.voteAverage}</span>
						</Label>
					)}
				</div>
			</Container>
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

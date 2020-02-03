import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import { Input, Icon } from 'semantic-ui-react'
import c from 'classnames'
import { debounce } from 'lodash'

import Result from './result'
import { MovieList } from './movie-list'
import { SearchMovies, UserMovies } from '../../shared/collections'

export const MovieSearch = ({
	displayQuery,
	movies,
	search,
	selectMovie,
	loading,
	noResults,
	ready,
	clearSearch,
}) => (
	<div className={c('ui', 'search', 'right', 'aligned', { loading })}>
		<Input className='icon'>
			<input
				value={displayQuery}
				type='search'
				className='prompt'
				placeholder='Add a movie&hellip;'
				onChange={ev => search(ev.target.value)}
			/>
			<Icon
				className={ready ? 'circular remove link' : 'search'}
				onClick={clearSearch}
			/>
		</Input>
		<div className={c('results', 'transition', { visible: ready })}>
			{noResults ? (
				<div className='message empty'>
					<div className='header'>No Results</div>
					<div className='description'>Your search returned no results</div>
				</div>
			) : (
				<MovieList
					{...{ movies, selectMovie }}
					wrapper='div'
					itemWrapper={Result}
				/>
			)}
		</div>
	</div>
)

Session.setDefault('query', '')
Session.setDefault('displayQuery', '')
const updateQuery = debounce(q => Session.set('query', q), 200)

const clearSearch = () => {
	Session.set('query', '')
	Session.set('displayQuery', '')
}

const SearchContainer = withTracker(() => {
	const query = Session.get('query')
	const displayQuery = Session.get('displayQuery')
	const search = Meteor.subscribe('searchmovie', query)
	const movies = SearchMovies.find({})
	const ready = Boolean(query) && search.ready()
	const noResults = ready && !movies.count()

	return {
		displayQuery,
		noResults,
		loading: Boolean(query) && !search.ready(),
		ready,
		movies: movies.fetch(),

		search: q => {
			Session.set('displayQuery', q)
			updateQuery(q)
		},

		selectMovie(movie) {
			UserMovies.insert({
				owner: Meteor.userId(),
				movie,
			})
			clearSearch()
		},

		clearSearch,
	}
})(MovieSearch)

export default SearchContainer

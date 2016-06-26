import {Meteor} from 'meteor/meteor';
import {Session} from 'meteor/session';
import {createContainer} from 'meteor/react-meteor-data';
import React, {PropTypes} from 'react';
import {Input, Icon} from 'react-semantify';
import c from 'classnames';
import {debounce} from 'lodash';

import Result from './result';
import {MovieList} from './movie-list';
import {SearchMovies, UserMovies} from '../../shared/collections';

export const MovieSearch = ({
	displayQuery, movies, search, selectMovie, loading, noResults, ready, clearSearch,
}) => <div className={c('ui', 'search', 'right', 'aligned', {loading})}>
	<Input className="icon">
		<input
			value={displayQuery}
			onChange={ev => search(ev.target.value)}
			type="search"
			className="prompt"
			placeholder="Add a movie&hellip;"
		/>
		<Icon className={ready ? 'circular remove link' : 'search'} onClick={clearSearch} />
	</Input>
	<div className={c('results', 'transition', {visible: ready})}>
		{noResults ?
			<div className="message empty">
				<div className="header">No Results</div>
				<div className="description">Your search returned no results</div>
			</div>
		: <MovieList
			{...{movies, selectMovie}}
			wrapper="div"
			itemWrapper={Result}
		/>}
	</div>
</div>;

MovieSearch.propTypes = {
	displayQuery: PropTypes.string,
	movies: PropTypes.array,
	search: PropTypes.func,
	selectMovie: PropTypes.func,
	loading: PropTypes.bool,
	noResults: PropTypes.bool,
	ready: PropTypes.bool,
	clearSearch: PropTypes.func,
};

Session.setDefault('query', '');
Session.setDefault('displayQuery', '');
const updateQuery = debounce(q => Session.set('query', q), 200);

const clearSearch = () => {
	Session.set('query', '');
	Session.set('displayQuery', '');
};

const SearchContainer = createContainer(() => {
	const query = Session.get('query');
	const displayQuery = Session.get('displayQuery');
	const search = Meteor.subscribe('searchmovie', query);
	const movies = SearchMovies.find({});
	const ready = !!query && search.ready();
	const noResults = ready && !movies.count();

	return {
		displayQuery,
		noResults,
		loading: !!query && !(search.ready()),
		ready,
		movies: movies.fetch(),

		search: (q) => {
			Session.set('displayQuery', q);
			updateQuery(q);
		},

		selectMovie(movie) {
			UserMovies.insert({
				owner: Meteor.userId(),
				movie,
			});
			clearSearch();
		},

		clearSearch,
	};
}, MovieSearch);

export default SearchContainer;

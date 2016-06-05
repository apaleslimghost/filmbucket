import {Meteor} from 'meteor/meteor';
import {Session} from 'meteor/session';
import React, {PropTypes} from 'react';
import {render} from 'react-dom';
import Blaze from 'meteor/gadicc:blaze-react-component';
import {createContainer} from 'meteor/react-meteor-data';
import DebounceInput from 'react-debounce-input';

import {Movies, UserMovies, SearchMovies} from '../shared/collections';

const Account = (props) => <Blaze template="loginButtons" {...props} />;

const Logo = () => <a href="/" className="logo">muerte.club</a>;

const IntroPage = () => <div>
	<Logo />
	<div className="tagline">Movie nights with a random twist</div>
	<Account />
</div>;

const Movie = ({Title}) => <h1>{Title}</h1>;

const List = ({movies, selectMovie}) => <ul>
	{movies.map(movie => <li key={movie._id}>
		{
			selectMovie
			? <a href={`#select-${movie._id}`} onClick={() => selectMovie(movie)}><Movie {...movie} /></a>
			: <Movie {...movie} />
		}
	</li>)}
</ul>;

const ListContainer = createContainer(() => {
	const userMoviesCursor = Meteor.subscribe('usermovies');
	const userMovieIds = UserMovies.find({
		owner: Meteor.userId(),
	}).fetch().map(({movie}) => movie);

	return {
		movies: Movies.find({
			_id: {$in: userMovieIds},
		}).fetch(),
		loading: !userMoviesCursor.ready(),
	};
}, List);

const Search = ({query, movies, search, selectMovie, loading}) => <div>
	<DebounceInput value={query} onChange={ev => search(ev.target.value)} type="search" />
	{loading && 'loading'}
	{movies.length > 0 && <List {...{movies, selectMovie}} />}
</div>;

Session.setDefault('query', '');

const SearchContainer = createContainer(() => {
	const query = Session.get('query');
	const search = Meteor.subscribe('searchmovie', query);
	return {
		query,
		loading: !!query && !search.ready(),
		movies: SearchMovies.find({}).fetch(),
		search(q) {
			Session.set('query', q);
		},
		selectMovie(movie) {
			UserMovies.insert({
				owner: Meteor.userId(),
				movie: movie._id,
			});
			Session.set('query', '');
		},
	};
}, Search);

const MyPage = () => <div>
	<h1>your list</h1>
	<SearchContainer />
	<ListContainer />
</div>;

const App = ({loggedIn}) => (loggedIn ? <MyPage /> : <IntroPage />);
App.propTypes = {
	loggedIn: PropTypes.bool,
};

const AppContainer = createContainer(() => ({
	loggedIn: !!Meteor.user(),
}), App);

Meteor.startup(() => {
	render(<AppContainer />, document.querySelector('main'));
});

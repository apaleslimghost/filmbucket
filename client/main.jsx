import {Meteor} from 'meteor/meteor';
import {Session} from 'meteor/session';
import React, {PropTypes} from 'react';
import {render} from 'react-dom';
import Blaze from 'meteor/gadicc:blaze-react-component';
import {createContainer} from 'meteor/react-meteor-data';
import {debounce} from 'lodash';
import {Grid,
	Column,
	Loader,
	Input,
	Icon,
	List,
	Item,
	Content,
	Header,
	Image,
	Label,
} from 'react-semantify';
import c from 'classnames';

import {Movies, UserMovies, SearchMovies} from '../shared/collections';

const Account = (props) => <Blaze template="loginButtons" {...props} />;

const Logo = () => <a href="/" className="logo">muerte.club</a>;

const IntroPage = () => <Grid className="middle aligned center aligned fullheight">
	<Column className="six wide">
		<Logo />
		<div className="tagline">Movie nights with a random twist</div>
		<Account />
	</Column>
</Grid>;

const Result = ({children, onClick}) => <a onClick={onClick} className="result">{children}</a>;

const Movie = ({
	movie: {Title, Poster, Year, _id},
	selectMovie,
	wrapper: Wrap = Item,
}) => <Wrap onClick={selectMovie && (() => selectMovie(_id))}>
	{Poster !== 'N/A' && <Image src={Poster} className="mini" />}
	<Content>
		<Header>{Title}</Header>
		<div className="description">
			<Label>
				<Icon className="calendar" />
				{Year}
			</Label>
		</div>
	</Content>
</Wrap>;

const MovieList = ({
	movies,
	selectMovie,
	itemWrapper,
	wrapper: Wrap = List,
}) => <Wrap>
	{movies.map(
		movie => <Movie movie={movie} selectMovie={selectMovie} key={movie._id} wrapper={itemWrapper} />
	)}
</Wrap>;

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
}, MovieList);

const MovieSearch = ({displayQuery, movies, search, selectMovie, loading, noResults, ready}) =>
	<div className={c('ui', 'search', {loading})}>
		<Input className="icon">
			<input
				value={displayQuery}
				onChange={ev => search(ev.target.value)}
				type="search"
				className="prompt"
			/>
			<Icon className="search" />
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

Session.setDefault('query', '');
Session.setDefault('displayQuery', '');
const updateQuery = debounce(q => Session.set('query', q), 200);

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
		loading: !!query && !search.ready(),
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
			Session.set('query', '');
		},
	};
}, MovieSearch);

const MyPage = () => <div>
	<Account />
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

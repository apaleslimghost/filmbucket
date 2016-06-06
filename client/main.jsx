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

const Movie = (movie) => {
	const {Title, Poster, Year, _id, selectMovie} = movie;
	return (<Item>
		<Image src={Poster} className="mini" />
		<Content>
			{selectMovie
				? <a href={`#select-${_id}`} className="header" onClick={() => selectMovie(movie)}>{Title}</a>
				: <Header>{Title}</Header>
			}
			<div className="description">
				<Label>
					<Icon className="calendar" />
					{Year}
				</Label>
			</div>
		</Content>
	</Item>);
};

const MovieList = ({movies, selectMovie}) => <List>
	{movies.map(movie => <Movie {...movie} {...{selectMovie}} key={movie._id} />)}
</List>;

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

const MovieSearch = ({displayQuery, movies, search, selectMovie, loading}) => <div>
	<Input className="icon">
		<input value={displayQuery} onChange={ev => search(ev.target.value)} type="search" />
		<Icon className="search" />
	</Input>
	<Loader active={loading} />
	{movies.length > 0 && <MovieList {...{movies, selectMovie}} />}
</div>;

Session.setDefault('query', '');
Session.setDefault('displayQuery', '');
const updateQuery = debounce(q => Session.set('query', q), 200);

const SearchContainer = createContainer(() => {
	const query = Session.get('query');
	const displayQuery = Session.get('displayQuery');
	const search = Meteor.subscribe('searchmovie', query);
	return {
		displayQuery,
		loading: !!query && !search.ready(),
		movies: SearchMovies.find({}).fetch(),
		search: (q) => {
			Session.set('displayQuery', q);
			updateQuery(q);
		},
		selectMovie(movie) {
			UserMovies.insert({
				owner: Meteor.userId(),
				movie: movie._id,
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

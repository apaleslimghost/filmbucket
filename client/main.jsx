import {Meteor} from 'meteor/meteor';
import React, {PropTypes} from 'react';
import {render} from 'react-dom';
import Blaze from 'meteor/gadicc:blaze-react-component';
import {createContainer} from 'meteor/react-meteor-data';

import {UserMovies} from '../shared/collections';

const Account = (props) => <Blaze template="loginButtons" {...props} />;

const Logo = () => <a href="/" className="logo">muerte.club</a>;

const IntroPage = () => <div>
	<Logo />
	<div className="tagline">Movie nights with a random twist</div>
	<Account />
</div>;

const Movie = ({title}) => <h1>{title}</h1>;

const List = ({movies}) => <ul>
	{movies.map(movie => <li key={movie._id}><Movie {...movie} /></li>)}
</ul>;

const ListContainer = createContainer(() => {
	const userMovies = Meteor.subscribe('usermovies');
	return {
		movies: UserMovies.find({owner: Meteor.userId()}).fetch(),
		loading: !userMovies.ready(),
	};
}, List);

const MyPage = () => <div>
	<h1>your list</h1>
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

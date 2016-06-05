import {Meteor} from 'meteor/meteor';
import {HTTP} from 'meteor/http';
import {UserMovies} from '../shared/collections';

const omdb = query => HTTP.get('https://www.omdbapi.com', {query}).data;

const getMovie = i => omdb({i});
const search = s => omdb({s});

Meteor.publish('movie', id => {
	this.added('movies', id, getMovie(id));
	this.ready();
});

Meteor.publish('searchmovie', q => {
	const {Search: results} = search(q);

	results.filter(({Type}) => Type === 'movie')
	.forEach(movie => {
		this.added('searchmovies', movie.imdbID, Object.assign(movie, getMovie(movie.imdbID)));
	});

	this.ready();
});

Meteor.publish('usermovies', function usermoviesPublish() {
	return UserMovies.find({owner: this.userId});
});

import {Meteor} from 'meteor/meteor';
import {HTTP} from 'meteor/http';
import {UserMovies, Movies} from '../shared/collections';
import url from 'url';

const omdbUrl = query => url.format({
	protocol: 'https',
	hostname: 'www.omdbapi.com',
	query,
});

const omdb = query => {
	const result = HTTP.get(omdbUrl(query));
	if (!result.data) {
		throw new Error(`No JSON returned for query ${JSON.stringify(query)}`);
	}
	if (result.data.Response === 'False') {
		throw new Error(`OMDB Error for query ${JSON.stringify(query)}: ${result.data.Error}`);
	}
	return result.data;
};

const getMovie = i => omdb({i});
const search = s => omdb({s});

function moviePublish(id) {
	this.added('movies', id, getMovie(id));
	this.ready();
}

Meteor.publish('movie', moviePublish);

Meteor.publish('searchmovie', function searchmoviePublish(q) {
	if (!q) {
		return this.ready();
	}

	const results = search(q).Search;

	results.filter(({Type}) => Type === 'movie')
	.forEach(movie => {
		this.added('searchmovies', movie.imdbID, movie);
	});

	this.ready();
});

Meteor.publishComposite('usermovies', {
	find() {
		return UserMovies.find({owner: this.userId});
	},

	children: [{
		find(userMovie) {
			moviePublish.call(this, userMovie.movie);
		},
	}],
});

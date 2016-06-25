import {Meteor} from 'meteor/meteor';
import {search} from '../movie-api';

Meteor.publish('searchmovie', function searchmoviePublish(q) {
	const query = q.trim();

	if (!query || query.length <= 2) {
		return this.ready();
	}

	let results;

	try {
		results = search(query).Search;
	} catch (e) {
		if (e.result && e.result.data && e.result.data.Error === 'Movie not found!') {
			results = [];
		} else {
			throw e;
		}
	}

	results.filter(({Type}) => Type === 'movie')
	.forEach(movie => {
		this.added('searchmovies', movie.imdbID, movie);
	});

	this.ready();
});

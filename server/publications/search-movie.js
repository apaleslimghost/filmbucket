import {Meteor} from 'meteor/meteor';
import {search} from '../movie-api';

Meteor.publish('searchmovie', function searchmoviePublish(q) {
	const query = q.trim();

	if (!query || query.length <= 2) {
		return this.ready();
	}

	let results;

	try {
		results = search(query);
	} catch (e) {
		if (e.result && e.result.data && e.result.data.error === 'Movie not found!') {
			results = [];
		} else {
			throw e;
		}
	}

	results.filter(({type}) => type === 'movie')
	.forEach(movie => {
		this.added('searchmovies', movie.imdbId, movie);
	});

	this.ready();
});

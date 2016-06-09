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
		const err = new Error(`OMDB Error for query ${JSON.stringify(query)}: ${result.data.Error}`);
		err.result = result;
		throw err;
	}
	return result.data;
};

const getMovie = i => omdb({i});
const search = s => omdb({s});

function moviePublish(_id) {
	const cached = Movies.find({_id});
	if (cached.count()) {
		return cached;
	}

	const movie = getMovie(_id);
	movie._id = _id;
	this.added('movies', _id, movie);
	Movies.insert(movie);
	this.ready();
}

Meteor.publish('movie', moviePublish);

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

Meteor.publishComposite('usermovies', {
	find() {
		return UserMovies.find({owner: this.userId});
	},

	children: [{
		find(userMovie) {
			return moviePublish.call(this, userMovie.movie);
		},
	}],
});

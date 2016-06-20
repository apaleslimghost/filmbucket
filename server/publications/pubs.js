import {Meteor} from 'meteor/meteor';
import {UserMovies, Movies, Groups} from '../../shared/collections';
import omdb from '../omdb';

const getMovie = i => omdb({i});

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

const userMoviePublish = getUserIds => ({
	find() {
		return UserMovies.find({owner: {$in: [].concat(getUserIds.call(this))}});
	},

	children: [{
		find(userMovie) {
			return moviePublish.call(this, userMovie.movie);
		},
	}],
});

Meteor.publishComposite('usermovies', userMoviePublish(function () {
	return this.userId;
}));

Meteor.publishComposite('group', {
	find() {
		const cursor = Groups.find({members: this.userId});
		if (!cursor.count()) {
			Groups.insert({members: [this.userId]});
		}

		return cursor;
	},

	children: [{
		find(group) {
			return Meteor.users.find({_id: {$in: group ? group.members : []}});
		},
	}, userMoviePublish(group => group ? group.members : [])],
});

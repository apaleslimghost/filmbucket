import {Meteor} from 'meteor/meteor';
import {UserMovies, Movies, Groups} from '../../shared/collections';
import {getById} from '../movie-api';

function moviePublish(_id) {
	const cached = Movies.find({_id});
	if (cached.count()) {
		return cached;
	}

	const movie = getById(_id);
	console.log(movie);
	movie._id = _id;
	this.added('movies', _id, movie);
	Movies.upsert({_id}, movie);
	this.ready();
}

Meteor.publish('movie', moviePublish);

const userMoviePublish = getUserIds => ({
	find(group) {
		return UserMovies.find({owner: {$in: [].concat(getUserIds.call(this, group))}});
	},

	children: [{
		find(userMovie) {
			return moviePublish.call(this, userMovie.movie);
		},
	}],
});

Meteor.publishComposite('usermovies', userMoviePublish(function getUserIds() {
	return this.userId;
}));

Meteor.publishComposite('group', {
	find() {
		return Groups.find({members: this.userId});
	},

	children: [{
		find(group) {
			return Meteor.users.find({_id: {$in: group ? group.members : []}});
		},
	}, userMoviePublish(group => (group ? group.members : []))],
});

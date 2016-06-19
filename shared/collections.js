import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';

export const Groups = new Mongo.Collection('groups');
export const Movies = new Mongo.Collection('movies');
export const SearchMovies = new Mongo.Collection('searchmovies');
export const UserMovies = new Mongo.Collection('usermovies');

UserMovies.allow({
	insert: (userId, doc) => doc.owner === userId,
	remove: (userId, doc) => doc.owner === userId,
	update: (userId, doc) => doc.owner === userId,
	fetch: ['owner'],
});

Groups.allow({
	insert: (userId, doc) => doc.members.indexOf(userId) !== -1,
	remove: (userId, doc) => doc.members.indexOf(userId) !== -1,
	update: () => true, // TODO: 🙈
	fetch: ['members'],
});

function debugCollection(name, collection) {
	/* eslint no-console: "off" */
	console.log(name);
	console.table(collection.find().fetch());
}

if (Meteor.isClient) {
	window.debugCollections = () => {
		Object.keys(exports).forEach(collection => {
			if (exports[collection] instanceof Mongo.Collection) {
				debugCollection(collection, exports[collection]);
			}
		});
	};
}

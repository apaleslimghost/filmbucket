import {Mongo} from 'meteor/mongo';

export const Groups = new Mongo.Collection('groups');
export const Movies = new Mongo.Collection('movies');
export const SearchMovies = new Mongo.Collection('searchmovies');
export const UserMovies = new Mongo.Collection('usermovies');

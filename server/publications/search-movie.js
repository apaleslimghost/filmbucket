import { Meteor } from 'meteor/meteor'
import { search } from '../movie-api'

Meteor.publish('searchmovie', function(q) {
	const query = q.trim()

	if (!query || query.length <= 2) {
		return this.ready()
	}

	let results

	try {
		results = search(query)
	} catch (e) {
		if (e.response && e.response.data && e.response.data.errors) {
			if (e.response.data.errors.indexOf('query must be provided') >= 0) {
				results = []
			} else {
				this.error(e.response.data.errors.join(', '))
			}
		} else {
			this.error(e)
		}
	}

	results.forEach(movie => {
		this.added('searchmovies', movie.id, movie)
	})

	this.ready()
})

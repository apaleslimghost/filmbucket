import url from 'url'
import path from 'path'

export default (file, { size } = {}) =>
	url.format({
		protocol: 'https',
		hostname: 'image.tmdb.org',
		pathname: path.join('/t/p', size || 'w500', file),
	})

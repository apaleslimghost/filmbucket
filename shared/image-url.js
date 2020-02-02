import url from 'url'
import path from 'path'
import crypto from 'crypto'

export default (file, { size } = {}) =>
	url.format({
		protocol: 'https',
		hostname: 'image.tmdb.org',
		pathname: path.join('/t/p', size || 'w500', file),
	})

const gravatarHash = email =>
	crypto
		.createHash('md5')
		.update(email.trim().toLowerCase())
		.digest('hex')

export const gravatarUrl = email =>
	url.format({
		scheme: 'https',
		host: 'www.gravatar.com',
		pathname: `/avatar/${gravatarHash(email)}`,
		query: {
			d: 'identicon',
		},
	})

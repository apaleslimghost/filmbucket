import {HTTP} from 'meteor/http';
import url from 'url';
import path from 'path';
import mapKeys from 'deep-map-keys';
import camelCase from 'camel-case';
import assertEnv from '@quarterto/assert-env';

assertEnv(['TMDB_API_KEY']);

const formatUrl = (pathname, query) => url.format({
	protocol: 'https',
	hostname: 'api.themoviedb.org',
	query: Object.assign({
		api_key: process.env.TMDB_API_KEY,
	}, query),
	pathname: path.join('/3', pathname),
});

export const call = (pathname, query) => {
	const result = HTTP.get(formatUrl(pathname, query));
	if (!result.data) {
		throw new Error(`No JSON returned for ${pathname} ${JSON.stringify(query)}`);
	}
	return mapKeys(result.data, camelCase);
};

export const getById = id => call(`movie/${id}`);
export const search = query => call('search/movie', {query}).results;

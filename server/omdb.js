import {HTTP} from 'meteor/http';
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

export default omdb;

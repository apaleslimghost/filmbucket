import React from 'react';
import {Grid, Column} from 'react-semantify';
import {route_} from 'boulevard';
import history from './history';

export default route_({
	getUrl() {
		return history.url;
	},

	fourOhFour() {
		return (<Grid className="middle aligned center aligned fullheight">
			<Column className="six wide">
				{history.url} not found
			</Column>
		</Grid>);
	},
});

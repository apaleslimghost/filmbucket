import React from 'react';
import {Grid, Column} from 'react-semantify';
import Logo from './logo';
import Account from './account';

const IntroPage = () => <Grid className="middle aligned center aligned fullheight">
	<Column className="six wide">
		<Logo />
		<div className="tagline">Movie nights with a random twist</div>
		<Account />
	</Column>
</Grid>;

export default IntroPage;

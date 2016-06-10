import React from 'react';
import Account from './account';
import SearchContainer from './search';
import ListContainer from './movie-list';

const Dashboard = () => <div>
	<Account />
	<h1>Your list</h1>
	<SearchContainer />
	<ListContainer />
</div>;

export default Dashboard;

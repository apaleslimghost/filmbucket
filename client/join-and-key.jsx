import React from 'react';
import OnlyChild from './components/only-child';

export default arrays => arrays
	.reduce((ys, x) => ys.concat(x), [])
	.map((child, i) => <OnlyChild key={i}>{child}</OnlyChild>);

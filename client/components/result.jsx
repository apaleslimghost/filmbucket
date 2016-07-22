import {Meteor} from 'meteor/meteor';
import React, {PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {UserMovies} from '../../shared/collections';
import ListDim from './list-dim';
import component from '../component';

export const Result = ({
	children,
	onClick,
	dim,
	loading,
	className,
	movie = {},
	dimmer: Dim = ListDim,
	dimBlocksClick = true,
}) => (dimBlocksClick ? <div className={`result dimmable ${className}`}>
	<Dim dim={dim} loading={loading} />
	<a onClick={onClick} title={movie.title}>
		{children}
	</a>
</div> : <a onClick={onClick} className={`result dimmable ${className}`} title={movie.title}>
	<Dim dim={dim} loading={loading} />
	<div>{children}</div>
</a>);

Result.propTypes = {
	children: PropTypes.node.isRequired,
	onClick: PropTypes.func,
	dim: PropTypes.bool,
	loading: PropTypes.bool,
	className: PropTypes.string,
	movie: PropTypes.object,
	dimmer: component,
	dimBlocksClick: PropTypes.bool,
};

const ResultContainer = createContainer(({movie}) => {
	const sub = Meteor.subscribe('usermovies');
	return {
		loading: !sub.ready(),
		dim: sub.ready() && !!UserMovies.findOne({movie: movie && movie._id}),
	};
}, Result);

export default ResultContainer;

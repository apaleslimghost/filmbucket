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
	dimmer: Dim = ListDim,
}) => <div className={`result dimmable ${className}`}>
	<Dim dim={dim} loading={loading} />
	<a onClick={onClick}>
		{children}
	</a>
</div>;

Result.propTypes = {
	children: PropTypes.node.isRequired,
	onClick: PropTypes.func,
	dim: PropTypes.bool,
	loading: PropTypes.bool,
	className: PropTypes.string,
	dimmer: component,
};

const ResultContainer = createContainer(({movie}) => {
	const sub = Meteor.subscribe('usermovies');
	return {
		loading: !sub.ready(),
		dim: sub.ready() && !!UserMovies.findOne({movie: movie._id}),
	};
}, Result);

export default ResultContainer;

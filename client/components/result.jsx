import {Meteor} from 'meteor/meteor';
import React, {PropTypes} from 'react';
import {Dimmer, Content, Icon, Loader} from 'react-semantify';
import {createContainer} from 'meteor/react-meteor-data';
import c from 'classnames';
import {UserMovies} from '../../shared/collections';

export const Result = ({
	children,
	onClick,
	dim,
	loading,
	className,
}) => <div className={`result dimmable ${className}`}>
	<Dimmer className={c('inverted', {'active visible': loading || dim})}>
		{loading && <Loader />}
		{dim && <Content>
			<div className="center">
				<div className="header"><Icon className="check circle big green" /></div>
				<div className="description">In your list!</div>
			</div>
		</Content>}
	</Dimmer>
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
};

const ResultContainer = createContainer(({movie}) => {
	const sub = Meteor.subscribe('usermovies');
	return {
		loading: !sub.ready(),
		dim: sub.ready() && !!UserMovies.findOne({movie: movie._id}),
	};
}, Result);

export default ResultContainer;

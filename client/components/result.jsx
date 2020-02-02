import { Meteor } from 'meteor/meteor'
import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { UserMovies } from '../../shared/collections'
import ListDim from './list-dim'

export const Result = ({
	children,
	onClick,
	dim,
	loading,
	className,
	movie = {},
	dimmer: Dim = ListDim,
	dimBlocksClick = true,
}) =>
	dimBlocksClick ? (
		<div className={`result dimmable ${className}`}>
			<Dim dim={dim} loading={loading} />
			<a onClick={onClick} title={movie.title}>
				{children}
			</a>
		</div>
	) : (
		<a
			onClick={onClick}
			className={`result dimmable ${className}`}
			title={movie.title}
		>
			<Dim dim={dim} loading={loading} />
			<div>{children}</div>
		</a>
	)

const ResultContainer = createContainer(({ movie }) => {
	const sub = Meteor.subscribe('usermovies')
	return {
		loading: !sub.ready(),
		dim:
			sub.ready() &&
			!!UserMovies.findOne({
				owner: Meteor.userId(),
				movie: movie && movie._id,
			}),
	}
}, Result)

export default ResultContainer

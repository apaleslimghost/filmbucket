import React, {PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';
import {createContainer} from 'meteor/react-meteor-data';
import {
	Header,
	Divider,
	List,
	Item,
	Image,
	Loader,
	Icon,
	Button,
	Grid,
	Column,
} from 'react-semantify';
import {Movies, UserMovies, Groups} from '../../shared/collections';
import c from 'classnames';
import belowMedian from '@quarterto/below-median';
import intersection from 'lodash.intersection';
import groupBy from 'lodash.groupby';
import mapValues from 'lodash.mapvalues';
import some from 'lodash.some';
import joinAndKey from '../join-and-key';
import HorizontalMovieList from './horizontal-movie-list';
import Movie from './movie';
import {navigate} from '../history';

export const Choose = ({
	group,
	users,
	loading,
	usersSelected,
	toggleSelected,
	getChooser,
	chooser,
	step,
	random,
	moviesByOwner,
	randomChoice,
	manualChoice,
	prevStep,
	movieChoice,
	chooseMovie,
	finished,
}) => <Grid className="center aligned">
	<Column className="six wide left aligned">
	{loading ? <Loader /> : <div>{joinAndKey([
		({currentStep, previousStep}) => [
			<Header>Who's here?</Header>,
			<p className="muted">Who's in the room tonight? Filmbucket will pick someone at random.</p>,
			<List className="horizontal">
				{users.map(user => <Item key={user._id}>
					<a
						className={c('ui label image large', {
							green: usersSelected[user._id],
							disabled: !currentStep,
						})}
						onClick={() => toggleSelected(user)}
					>
						<Image src={user.profile.picture} />
						{user.profile.name}
						{usersSelected[user._id] &&
							<div className="detail"><Icon className="fitted check" /></div>
						}
					</a>
				</Item>)}
			</List>,

			<Divider
				className={c({
					horizontal: currentStep ? some(usersSelected) : previousStep,
				}, 'header')}
			>
				{currentStep ?
					(some(usersSelected) &&
						<Button className="small" onClick={getChooser}>
							<Icon className="group" />
							That's everyone
						</Button>) :
					(previousStep &&
						<Icon className="angle up link" onClick={prevStep} />)
					}
			</Divider>,
		],
		({currentStep, previousStep}) => [
			<Header>{chooser.profile.name}, it's your turn</Header>,
			<p className="muted">Do you want Filmbucket to choose the movie? Or do you have something in mind?</p>,
			<Divider className={c({horizontal: currentStep || previousStep}, 'header')}>
				{currentStep ?
					<div className="ui buttons small">
						<Button className="purple" onClick={randomChoice}>
							<Icon className="shuffle" />
							Random movie
						</Button>
						<div className="or" />
						<Button onClick={manualChoice}>Choose a movie</Button>
					</div> :
					(previousStep &&
						<Icon className="angle up link" onClick={prevStep} />)
				}
			</Divider>,
		],
		() => (random ? [
			<Header>How about <em>{movieChoice.title}</em>?</Header>,
			<List><Movie movie={movieChoice} /></List>,
		] : [
			<Header>Your movies</Header>,
			<HorizontalMovieList
				movies={moviesByOwner[chooser._id]}
				seen={group.seen}
				selectMovie={chooseMovie}
			/>,
		].concat(
			movieChoice ? [
				<Divider className="section" />,
				<List><Movie movie={movieChoice} /></List>,
			] : []
		)).concat(movieChoice ? <Divider className="horizontal header">
			<Button className="blue" onClick={finished}>
				<Icon className="film" />
				Sounds good!
			</Button>
		</Divider> : []),
	].slice(0, step + 1).map((f, i) => f({
		currentStep: step === i,
		previousStep: step - 1 === i,
	})))}</div>}
</Column>
</Grid>;

Choose.propTypes = {
	group: PropTypes.object,
	users: PropTypes.array,
	loading: PropTypes.bool,
	usersSelected: PropTypes.object,
	toggleSelected: PropTypes.func,
	getChooser: PropTypes.func,
	step: PropTypes.number,
	chooser: PropTypes.object,
	random: PropTypes.bool,
	moviesByOwner: PropTypes.object,
	randomChoice: PropTypes.func,
	manualChoice: PropTypes.func,
	prevStep: PropTypes.func,
	chooseMovie: PropTypes.func,
	movieChoice: PropTypes.object,
	finished: PropTypes.func,
};

export default createContainer(({selected, step, chooser, random, chosenMovie}) => {
	const groupCursor = Meteor.subscribe('group');
	const group = Groups.findOne({members: Meteor.userId()});
	const selectedUsers = Object.keys(selected.all());
	const userMovies = UserMovies.find({
		owner: {
			$in: group ? group.members : [],
		},
	}).fetch();
	const userMoviesByOwner = groupBy(userMovies, userMovie => userMovie.owner);
	const moviesByOwner = mapValues(
		userMoviesByOwner,
		movies => movies.map(
			({movie}) => Movies.findOne(movie) || {}
		)
	);

	const movieChoice = Movies.findOne(chosenMovie.get());

	const nextStep = () => step.set(step.get() + 1);
	const prevStep = () => step.set(Math.max(step.get() - 1, 0));

	return {
		loading: !groupCursor.ready(),
		group,
		users: Meteor.users.find({_id: {$in: group ? group.members : []}}).fetch(),
		usersSelected: selected.all(),
		toggleSelected({_id}) {
			selected.set(_id, !selected.get(_id));
		},
		step: step.get(),
		random: random.get(),
		chooser: Meteor.users.findOne({_id: chooser.get()}),
		getChooser() {
			const chosen = group.chosen || [];
			const notChosenMuch = belowMedian(intersection(chosen, selectedUsers));
			const validChoosers = notChosenMuch.length ? notChosenMuch : selectedUsers;

			chooser.set(Random.choice(validChoosers));
			nextStep();
		},
		randomChoice() {
			const yourMovies = moviesByOwner[chooser.get()];
			const unseenMovies = yourMovies
				.filter(({_id}) => group.seen.indexOf(_id) === -1);
			const validMovies = unseenMovies.length ? unseenMovies : yourMovies;

			chosenMovie.set(Random.choice(validMovies)._id);
			random.set(true);
			nextStep();
		},
		manualChoice() {
			chosenMovie.set(false);
			random.set(false);
			nextStep();
		},
		chooseMovie: chosenMovie.set.bind(chosenMovie),
		moviesByOwner,
		prevStep,
		movieChoice,
		finished() {
			Groups.update(group._id, {
				$addToSet: {seen: chosenMovie.get()},
				$push: {chosen: chooser.get()},
			});
			navigate('/');
		},
	};
}, Choose);

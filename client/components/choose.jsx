import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { withTracker } from 'meteor/react-meteor-data'
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
} from 'semantic-ui-react'
import { Movies, UserMovies, Groups } from '../../shared/collections'
import c from 'classnames'
import groupBy from 'lodash.groupby'
import mapValues from 'lodash.mapvalues'
import some from 'lodash.some'
import pickBy from 'lodash.pickby'
import joinAndKey from '../join-and-key'
import HorizontalMovieList from './horizontal-movie-list'
import Movie from './movie'
import { navigate } from '../history'
import { gravatarUrl } from '../../shared/image-url'

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
}) => (
	<Grid className='center aligned stackable'>
		<Grid.Column className='eight wide left aligned'>
			{loading ? (
				<Loader />
			) : (
				<div>
					{joinAndKey(
						[
							({ currentStep, previousStep }) => [
								<Header>Who's here?</Header>,
								<p className='muted'>
									Who's in the room tonight? Filmbucket will pick someone at
									random.
								</p>,
								<List className='horizontal'>
									{users.map(user => (
										<Item key={user._id}>
											<a
												className={c('ui label image large', {
													green: usersSelected[user._id],
													disabled: !currentStep,
												})}
												onClick={() => toggleSelected(user)}
											>
												<Image src={gravatarUrl(user.emails[0].address)} />
												{user.profile.name}
												{usersSelected[user._id] && (
													<div className='detail'>
														<Icon className='fitted check' />
													</div>
												)}
											</a>
										</Item>
									))}
								</List>,

								<Divider
									className={c(
										{
											horizontal: currentStep
												? some(usersSelected)
												: previousStep,
										},
										'header',
									)}
								>
									{currentStep
										? some(usersSelected) && (
												<Button className='small' onClick={getChooser}>
													<Icon className='group' />
													That's everyone
												</Button>
										  )
										: previousStep && (
												<Icon className='angle up link' onClick={prevStep} />
										  )}
								</Divider>,
							],
							({ currentStep, previousStep }) => [
								<Header>{chooser.profile.name}, it's your turn</Header>,
								<p className='muted'>
									Do you want Filmbucket to choose the movie? Or do you have
									something in mind?
								</p>,
								<Divider
									className={c(
										{ horizontal: currentStep || previousStep },
										'header',
									)}
								>
									{currentStep ? (
										<div className='ui buttons small'>
											<Button className='purple' onClick={randomChoice}>
												<Icon className='shuffle' />
												Random movie
											</Button>
											<div className='or' />
											<Button onClick={manualChoice}>Choose a movie</Button>
										</div>
									) : (
										previousStep && (
											<Icon className='angle up link' onClick={prevStep} />
										)
									)}
								</Divider>,
							],
							() =>
								(random
									? [
											<Header>
												How about <em>{movieChoice.title}</em>?
											</Header>,
											<List>
												<Movie movie={movieChoice} />
											</List>,
									  ]
									: [
											<Header>Your movies</Header>,
											<HorizontalMovieList
												movies={moviesByOwner[chooser._id]}
												seen={group.seen}
												selectMovie={chooseMovie}
											/>,
									  ].concat(
											movieChoice
												? [
														<Divider className='section' />,
														<List>
															<Movie movie={movieChoice} />
														</List>,
												  ]
												: [],
									  )
								).concat(
									movieChoice ? (
										<Divider className='horizontal header'>
											<Button className='blue' onClick={finished}>
												<Icon className='film' />
												Sounds good!
											</Button>
										</Divider>
									) : (
										[]
									),
								),
						]
							.slice(0, step + 1)
							.map((f, i) =>
								f({
									currentStep: step === i,
									previousStep: step - 1 === i,
								}),
							),
					)}
				</div>
			)}
		</Grid.Column>
	</Grid>
)

export default withTracker(
	({ selected, step, chooser, random, chosenMovie }) => {
		const groupCursor = Meteor.subscribe('group')
		const group = Groups.findOne({ members: Meteor.userId() })
		const selectedUsers = Object.keys(pickBy(selected.all()))
		const userMovies = UserMovies.find({
			owner: {
				$in: group ? group.members : [],
			},
		}).fetch()
		const userMoviesByOwner = groupBy(userMovies, userMovie => userMovie.owner)
		const moviesByOwner = mapValues(userMoviesByOwner, movies =>
			movies.map(({ movie }) => Movies.findOne(movie) || {}),
		)

		const movieChoice = Movies.findOne(chosenMovie.get())

		const nextStep = () => step.set(step.get() + 1)
		const prevStep = () => step.set(Math.max(step.get() - 1, 0))

		return {
			loading: !groupCursor.ready(),
			group,
			users: Meteor.users
				.find({ _id: { $in: group ? group.members : [] } })
				.fetch(),
			usersSelected: selected.all(),
			toggleSelected({ _id }) {
				selected.set(_id, !selected.get(_id))
			},
			step: step.get(),
			random: random.get(),
			chooser: Meteor.users.findOne({ _id: chooser.get() }),
			getChooser() {
				const chosen = group.chosen ? [...group.chosen].reverse() : []
				const chosenSet = new Set(chosen)
				const selectedSet = new Set(selectedUsers)

				const haventChosen = selectedUsers.filter(user => !chosenSet.has(user))

				const leastRecent = chosen.find(person => {
					selectedSet.delete(person)
					return selectedSet.size === 0
				})

				chooser.set(
					(!!haventChosen.length ? Random.choice(haventChosen) : leastRecent) ||
						Random.choice(selectedUsers),
				)

				nextStep()
			},
			randomChoice() {
				const yourMovies = moviesByOwner[chooser.get()]
				const unseenMovies = yourMovies.filter(
					({ _id }) => group.seen.indexOf(_id) === -1,
				)
				const validMovies = unseenMovies.length ? unseenMovies : yourMovies

				chosenMovie.set(Random.choice(validMovies)._id)
				random.set(true)
				nextStep()
			},
			manualChoice() {
				chosenMovie.set(false)
				random.set(false)
				nextStep()
			},
			chooseMovie: chosenMovie.set.bind(chosenMovie),
			moviesByOwner,
			prevStep,
			movieChoice,
			finished() {
				Groups.update(group._id, {
					$addToSet: { seen: chosenMovie.get() },
					$push: { chosen: chooser.get() },
				})
				navigate('/')
			},
		}
	},
)(Choose)

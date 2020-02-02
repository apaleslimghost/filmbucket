import React from 'react'
import { Dimmer, Content, Icon, Loader } from 'react-semantify'
import c from 'classnames'

const ListDim = ({ loading, dim }) => (
	<Dimmer className={c('inverted', { 'active visible': loading || dim })}>
		{loading && <Loader />}
		{dim && (
			<Content>
				<div className='center'>
					<div className='header'>
						<Icon className='check circle big green' />
					</div>
					<div className='description'>In your list!</div>
				</div>
			</Content>
		)}
	</Dimmer>
)

export default ListDim

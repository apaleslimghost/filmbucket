import React from 'react'
import { Dimmer, Container, Icon, Loader } from 'semantic-ui-react'
import c from 'classnames'

const ListDim = ({ loading, dim }) => (
	<Dimmer className={c('inverted', { 'active visible': loading || dim })}>
		{loading && <Loader />}
		{dim && (
			<Container>
				<div className='center'>
					<div className='header'>
						<Icon className='check circle big green' />
					</div>
					<div className='description'>In your list!</div>
				</div>
			</Container>
		)}
	</Dimmer>
)

export default ListDim

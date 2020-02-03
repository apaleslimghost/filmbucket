import React from 'react'
import { Dimmer, Container, Icon } from 'semantic-ui-react'
import c from 'classnames'

const SeenDim = ({ dim }) => (
	<Dimmer className={c({ 'active visible': dim }, 'rounded semi transparent')}>
		<Container>
			<div className='center'>
				<div className='header'>
					<Icon className='unhide teal large' />
				</div>
				<div className='description tiny'>Seen</div>
			</div>
		</Container>
	</Dimmer>
)

export default SeenDim

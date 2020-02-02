import React from 'react'
import { Dimmer, Content, Icon } from 'react-semantify'
import c from 'classnames'

const SeenDim = ({ dim }) => (
	<Dimmer className={c({ 'active visible': dim }, 'rounded semi transparent')}>
		<Content>
			<div className='center'>
				<div className='header'>
					<Icon className='unhide teal large' />
				</div>
				<div className='description tiny'>Seen</div>
			</div>
		</Content>
	</Dimmer>
)

export default SeenDim

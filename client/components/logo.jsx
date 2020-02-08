import React from 'react'
import { Image } from 'semantic-ui-react'
import { link } from '../history'

const Logo = props => (
	<a href='/' className='logo' onClick={link}>
		<Image src='/logo.svg' alt='Filmbucket' {...props} />
	</a>
)

export default Logo

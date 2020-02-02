import React from 'react'
import { link } from '../history'

const Logo = () => (
	<a href='/' onClick={link} className='logo'>
		filmbucket
	</a>
)

export default Logo

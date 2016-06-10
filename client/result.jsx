import React, {PropTypes} from 'react';

const Result = ({children, onClick}) => <a onClick={onClick} className="result">{children}</a>;

Result.propTypes = {
	children: PropTypes.node.isRequired,
	onClick: PropTypes.func,
};

export default Result;

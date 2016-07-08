import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Header} from 'react-semantify';

export const Choose = () => <Header>Choose a movie</Header>;

export default createContainer(() => ({}), Choose);

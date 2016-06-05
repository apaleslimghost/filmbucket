import {Meteor} from 'meteor/meteor';
import React from 'react';
import {render} from 'react-dom';

const App = () => <h1>It works</h1>;

Meteor.startup(() => {
  render(<App />, document.querySelector('main'));
});

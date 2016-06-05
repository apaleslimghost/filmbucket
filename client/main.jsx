import {Meteor} from 'meteor/meteor';
import React, {PropTypes} from 'react';
import {render} from 'react-dom';
import Blaze from 'meteor/gadicc:blaze-react-component';
import {createContainer} from 'meteor/react-meteor-data';

const Account = (props) => <Blaze template="loginButtons" {...props} />;

const Logo = () => <a href="/" className="logo">muerte.club</a>;

const IntroPage = () => <div>
  <Logo />
  <div className="tagline">Movie nights with a random twist</div>
  <Account />
</div>;

const App = ({loggedIn}) => (loggedIn ? <Account /> : <IntroPage />);
App.propTypes = {
  loggedIn: PropTypes.bool,
};

const AppContainer = createContainer(() => ({
  loggedIn: !!Meteor.user(),
}), App);

Meteor.startup(() => {
  render(<AppContainer />, document.querySelector('main'));
});

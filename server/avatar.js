import {Accounts} from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
	if (options.profile) {
		options.profile.picture = `https://graph.facebook.com/${user.services.facebook.id}/picture`;
		user.profile = options.profile;
	}
	return user;
});

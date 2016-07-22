import {Meteor} from 'meteor/meteor';
import {HTTP} from 'meteor/http';
import {Accounts} from 'meteor/accounts-base';

const getAvatarUrl = fbid => {
	const result = HTTP.get(`https://graph.facebook.com/${fbid}/picture?redirect=false`);

	if (result.data && result.data.data) {
		return result.data.data.url;
	}
};

Accounts.onCreateUser((options, user) => {
	if (options.profile) {
		options.profile.picture = getAvatarUrl(user.services.facebook.id);
		user.profile = options.profile;
	}

	return user;
});

Accounts.onLogin(() => {
	const {_id, profile, services} = Meteor.user();
	if (!profile.picture || /^https:\/\/graph.facebook.com/.test(profile.picture)) {
		Meteor.users.update({_id}, {
			$set: {'profile.picture': getAvatarUrl(services.facebook.id)},
		});
	}
});

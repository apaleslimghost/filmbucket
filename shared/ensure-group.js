import {Meteor} from 'meteor/meteor';
import {Groups} from './collections';

Meteor.methods({
	ensureGroup(groupId) {
		if (this.userId) {
			if (groupId) {
				Groups.update({_id: groupId}, {$addToSet: {members: this.userId}});
			} else if (!Groups.findOne({members: this.userId})) {
				Groups.insert({members: [this.userId]});
			}
		}
	},
});

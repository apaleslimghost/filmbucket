import { Meteor } from 'meteor/meteor'
import { Groups } from './collections'

Meteor.methods({
	ensureGroup(group, invitedBy) {
		if (this.userId) {
			if (group) {
				if (Groups.findOne({ _id: group, members: invitedBy })) {
					Groups.update({ _id: group }, { $addToSet: { members: this.userId } })
				}
			} else if (!Groups.findOne({ members: this.userId })) {
				Groups.insert({ members: [this.userId] })
			}
		}
	},
})

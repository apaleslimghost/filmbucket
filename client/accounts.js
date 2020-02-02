Accounts.ui.config({
	extraSignupFields: [
		{
			fieldName: 'name',
			fieldLabel: 'Name',
			inputType: 'text',
			visible: true,
			saveToProfile: true,
			validate: function(value, errorFunction) {
				if (value.trim() == '') {
					errorFunction('Please give your name')
					return false
				} else {
					return true
				}
			},
		},
	],
})

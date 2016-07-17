import {ReactiveVar} from 'meteor/reactive-var';

const currentUrl = new ReactiveVar(location.pathname);
const state = {
	get url() {
		return currentUrl.get();
	},

	set url(url) {
		currentUrl.set(url);
	},
};

export const navigate = url => {
	state.url = url;
	history.pushState({}, null, url);
};

export const link = ev => {
	ev.preventDefault();
	navigate(ev.currentTarget.pathname);
};

export const start = () => {
	state.url = location.pathname;
	window.addEventListener('popstate', () => {
		state.url = location.pathname;
	});
};

export default state;

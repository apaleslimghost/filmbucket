# filmbucket

## requirements

- [Meteor](https://meteor.com/install)
- a [TMDB](https://www.themoviedb.org/) API key
- a Facebook app for login

Create a file called `.env.sh` containing `export TMDB_API_KEY=[your api key]`.

## running

```sh
meteor npm install
meteor npm start
```

Open [localhost:3000](http://localhost:3000) and you should see a button that says "Configure Facebook Login". Click it and follow the steps.

## how it works

Meteor loads every single file in `client`, `shared` and `server`. Files in `client` and `shared` are bundled and sent to browsers when they load the app. `shared` and `server` are run on the server.

When the Meteor runtime starts, it calls the function we pass to [`Meteor.startup`](https://github.com/quarterto/filmbucket/blob/c79c9b0ec31a7c1b478eaee29363ec97e05dc2dd/client/main.jsx#L28-L30). This tells React to render the app into the [`<main>` element](https://github.com/quarterto/filmbucket/blob/c79c9b0ec31a7c1b478eaee29363ec97e05dc2dd/client/templates/main.html#L6).

If you're new to React, my [Crash Course](http://blog.153.io/2016/07/31/react-crash-course) should teach you enough to get by. It doesn't cover Meteor-specific bits however.

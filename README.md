# simple login one server

This is the one server implementation of the simple login app (MERN stack), where
both frontend and backend are hosted on the same server.

[[Demo Link]](https://lapel-ray.cyclic.app)

## Step 1: Install node modules

There are 2 node directories:

1. root folder
2. `client` folder

### Action:

Go into root folder and run `npm install`. <br>
Then go into `client/` folder and run `npm install`

## Step 2: Set the `.env` file

There are 2 `.env` files:

1. one `.env` file to be created in the root folder with the following content:

```
CLIENT_URI=http://localhost:5000
MONGO_URI=
SESSION_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

2. another `.env` is already in the `client` folder with the content:

```
REACT_APP_BACKEND_URI=http://localhost:5000/api
```

### Action:

Create that `.env` file in the root folder and fill in the parameters with appropriate values.

## Step 3: Build the frontend into static files

Because we're going to host both the frontend and the backend on the same server, we need to turn those React files into simple static files that we can serve from the server.

### Action:

Go into `client/` folder and run `npm run build`.
This will populate the `client/build/` folder with static files of the frontend.

## Step 4: Start the site on localhost

Go into the root folder and run `npm start`.
This will start the site on http://localhost:5000

## After changing frontend

Later if we make changes to the frontend, ie within the `client/` folder, be sure to then run `npm run build` so that the `client/build/` folder will have the latest static files.

## Deploy onto heroku

Before deploying to heroku, be sure to update the `.env` file within the `client/` folder so that it points to the site URI, and then run `npm run build`.

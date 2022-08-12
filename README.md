# Valtech's Future Studio Pong Game

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## How to run this project

In order to be able to run this project you need to create a .env.local file in the project's root folder with the following structure:

```
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGE_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_GAME_ID=
```

As you can see, the first six env vars are Firebase/Firestore related variables so you have to have a Firebase project already created. You will be able to get all the needed values from your project's settings page.

The last env variable is just a string that represents the name of the board (it can be something like where is this board located, which brand is using it).

Once you have this env file created, you only need to run:

```
npm start
```

This runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Also the page will reload if you make edits and you will also see any lint errors in the console.

## Tools being used

This is the list of tools we have used:

- Create React App: for scaffolding the react project
- HTML Canvas: for drawing the ball and paddles into the screen
- React Webcam: for showing a `<video>` html element that shows what the user's webcam is seeing
- Tensorflow + CocoSSD: for detecting common objects off of the webcam's captured video. We are just taking into account cellphones but as you can see in CocoSSD's model classes, it comes with a lot of objects it can detect.

## Pong logic

We have used [this video](https://www.youtube.com/watch?v=nl0KXCa5pJk) as a reference for building our basic game logic.

Once we have that in place we only had to detect where the cellphones were (based on what tensorflow detects) and use those coordinates to place the paddles where we want them to be.

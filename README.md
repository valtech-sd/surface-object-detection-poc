## Getting Started

1. Install the dependencies

```
yarn install
```

2. Create a `.env.local` file with the following values, using your own firebase credentials

```
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGE_SENDER_ID==
REACT_APP_FIREBASE_APP_ID=
REACT_APP_GAME_ID=
REACT_APP_NGROK_URL=
```

3. Run the project

```
yarn start
```

## NGROK

**IMPORTANT: This doesn't apply when being on build/production mode**

When developing, in case you want to use the scan-QR-codes feature for connecting to the game, we strongly recommend using [Ngrok](https://ngrok.com/) (or a similar tool). Basically what Ngrok does is exposing your local environment to the internet.

For starting this ngrok process you have to open a terminal tab and run:

```
./ngrok http --log-level "info" 3000
```

As you can see we are using the port 3000, but in case your pong project is being run in a different port then change it to the one you are using.

Then you need to open your `.env.local` file and set the ngrok url as the `REACT_APP_NGROK_URL` env variable value and run the game app again (via `npm run start` or `yarn start`).

## Features

This repository is 🔋 battery packed with:

- ⚛️ React 18
- ✨ TypeScript

## Libraries

| Category         | Technology                                                                |
| ---------------- | ------------------------------------------------------------------------- |
| Object detection | [Tensorflow](https://github.com/tensorflow/tfjs)                          |
| Model            | [CocoSSD](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd) |
| QR Codes         | [QRcode.react](https://zpao.github.io/qrcode.react/)                      |
| Sounds           | [use-sound](https://github.com/joshwcomeau/use-sound)                     |
| Webcam           | [react-webcam](https://github.com/mozmorris/react-webcam)                 |

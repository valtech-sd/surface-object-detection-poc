import { getFirestore } from "firebase/firestore";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  FirebaseAppProvider,
  FirestoreProvider,
  useFirebaseApp,
} from "reactfire";
import { BrowserRouter } from "react-router-dom";

import AppContent from "./App";
import reportWebVitals from "./reportWebVitals";

const firebaseConfig = {
  apiKey: "AIzaSyB_n3_r5G1je5jQK1lSiuIyd4X09-GIiOk",
  authDomain: "pong-board.firebaseapp.com",
  projectId: "pong-board",
  storageBucket: "pong-board.appspot.com",
  messagingSenderId: "554737791241",
  appId: "1:554737791241:web:8f636b5b30d105213ba3d8",
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const App = () => {
  const firestoreInstance = getFirestore(useFirebaseApp());

  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <AppContent />
    </FirestoreProvider>
  );
};

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <App />
      </FirebaseAppProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";

import { ObjectDetection } from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import { doc, setDoc } from "firebase/firestore";
import { useFirestore } from "reactfire";

import { render } from "./utils/canvas";
import { Ball, User, ModelDetectionClasses } from "./types";
import { loadCocoSSDModel } from "./utils/cocoSSD";
import { isWebcamReady } from "./utils/webcam";
import { update } from "./utils/game";

import "./App.css";

const FLIPPED_VIDEO = false;

const videoConstraints = {
  width: window.innerWidth,
  height: window.innerHeight,
  facingMode: "user",
};

function App() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [cocoModel, setCocoModel] = useState<ObjectDetection>();
  const [userScore, setUserScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);

  const gameRef = doc(useFirestore(), "game", "nintendo");

  useEffect(() => {
    setDoc(gameRef, {
      player1: "not_connected",
      player2: "not_connected",
      status: "idle",
      sound: "none",
      winner: "none",
    });
  }, []);

  /*
  // subscribe to a document for realtime updates. just one line!
  const { status, data } = useFirestoreDocData(gameRef);

  useEffect(() => {
    if (data) {
      setDoc(gameRef, { player1: "Eric" }, { merge: true });
    }
  }, [data]);
  */

  const user = useRef<User>({
    x: 0,
    y: window.innerHeight / 2 - 50,
    width: 10,
    height: 100,
    color: "white",
  }).current;

  const computer = useRef<User>({
    x: window.innerWidth - 10,
    y: window.innerHeight / 2 - 50,
    width: 10,
    height: 100,
    color: "white",
  }).current;

  const ball = useRef<Ball>({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    radius: 10,
    color: "white",
    speed: 5,
    velocityX: 5,
    velocityY: 5,
  }).current;

  const canvasContext = canvasRef.current
    ? canvasRef.current.getContext("2d")
    : undefined;

  const detect = useCallback(async () => {
    if (isWebcamReady(webcamRef.current) && canvasContext && cocoModel) {
      const { video } = webcamRef.current;

      if (video) {
        cocoModel.detect(video, undefined, 0.2).then((detections) => {
          const detection = detections.find(
            (detection) => detection.class === ModelDetectionClasses.CELL_PHONE
          );

          if (detection) {
            const [, y] = detection.bbox;
            user.y = y - user.height / 2;
          }
        });
      }
    }
  }, [cocoModel, canvasContext]);

  useEffect(() => {
    loadCocoSSDModel().then(setCocoModel);
  }, []);

  const game = useCallback(() => {
    if (cocoModel) {
      detect();
    }

    update(ball, user, computer, setUserScore, setComputerScore);
    render(canvasContext, ball, user, computer);

    // Make this function recursive (and infinite)
    requestAnimationFrame(game);
  }, [detect, cocoModel]);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;

      game();
    }
  }, [canvasRef.current]);

  return (
    <>
      <h1 className="score">{userScore}</h1>
      <h1 className="score right">{computerScore}</h1>
      <span className="net"></span>
      <Webcam
        ref={webcamRef}
        muted
        mirrored={FLIPPED_VIDEO}
        imageSmoothing
        videoConstraints={videoConstraints}
        style={{ zIndex: 1 }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 2,
        }}
      />
    </>
  );
}

export default App;

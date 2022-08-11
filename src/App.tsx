/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";

import { ObjectDetection } from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";

import { render } from "./utils/canvas";
import { Ball, User, ModelDetectionClasses } from "./types";
import { loadCocoSSDModel } from "./utils/cocoSSD";
import { isWebcamReady } from "./utils/webcam";
import { update } from "./utils/game";
import Player1Paddle from "./Player1Paddle.png";
import Player2Paddle from "./Player2Paddle.png";

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
  const requestRef = useRef<number>();
  const player1PaddleRef = useRef<HTMLImageElement>(null);
  const player2PaddleRef = useRef<HTMLImageElement>(null);

  const [cocoModel, setCocoModel] = useState<ObjectDetection>();
  const [userScore, setUserScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const user = useRef<User>({
    x: 0,
    y: window.innerHeight / 2 - 50,
    width: 10,
    height: 100,
    color: "transparent",
  }).current;

  useEffect(() => {
    setTimeout(() => {
      setGameStarted(true);
    }, 10000);
  }, []);

  const computer = useRef<User>({
    x: window.innerWidth - 10,
    y: window.innerHeight / 2 - 50,
    width: 10,
    height: 100,
    color: "transparent",
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

  const detect = useCallback(async () => {
    if (isWebcamReady(webcamRef.current) && cocoModel) {
      const { video } = webcamRef.current;

      if (video) {
        cocoModel.detect(video, undefined, 0.2).then((detections) => {
          const detection = detections.find(
            (detection) => detection.class === ModelDetectionClasses.CELL_PHONE
          );

          if (detection) {
            const [x, y, width, height] = detection.bbox;

            user.x = x + (width - user.width) / 2;
            user.y = y + (height - user.height) / 2;
          }
        });
      }
    }
  }, [cocoModel]);

  useEffect(() => {
    loadCocoSSDModel().then(setCocoModel);
  }, []);

  const game = useCallback(() => {
    if (canvasRef.current) {
      if (cocoModel) {
        detect();
      }

      update(ball, user, computer, setUserScore, setComputerScore, gameStarted);
      render(
        canvasRef.current.getContext("2d"),
        ball,
        user,
        computer,
        player1PaddleRef,
        player2PaddleRef
      );

      requestRef.current = requestAnimationFrame(game);
    }
  }, [cocoModel, gameStarted, canvasRef.current]);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;

      requestRef.current = requestAnimationFrame(game);
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [canvasRef.current, game]);

  return (
    <>
      <h1 className="score">{userScore}</h1>
      <h1 className="score right">{computerScore}</h1>
      <span className="net"></span>
      <img
        src={Player1Paddle}
        alt="paddle user"
        className="paddle user"
        ref={player1PaddleRef}
      />
      <img
        src={Player2Paddle}
        alt="paddle com"
        className="paddle com"
        ref={player2PaddleRef}
      />
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

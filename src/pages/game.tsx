/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";

import { ObjectDetection } from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import { doc, setDoc } from "firebase/firestore";
import { useFirestore, useFirestoreDocData } from "reactfire";

import { render } from "../utils/canvas";
import { Ball, User, ModelDetectionClasses } from "../types";
import { loadCocoSSDModel } from "../utils/cocoSSD";
import { isWebcamReady } from "../utils/webcam";
import { update } from "../utils/game";

import Player1Paddle from "../Player1Paddle.png";
import Player2Paddle from "../Player2Paddle.png";

const FLIPPED_VIDEO = false;
const MAX_SCORE = 2;

const INITIAL_PLAYER1_STATE = {
  x: 0,
  y: window.innerHeight / 2 - 50,
  width: 10,
  height: 100,
  color: "white",
};

const INITIAL_PLAYER2_STATE = {
  x: window.innerWidth - 10,
  y: window.innerHeight / 2 - 50,
  width: 10,
  height: 100,
  color: "white",
};

const videoConstraints = {
  width: window.innerWidth,
  height: window.innerHeight,
  facingMode: "user",
};

function GamePage() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const player1PaddleRef = useRef<HTMLImageElement>(null);
  const player2PaddleRef = useRef<HTMLImageElement>(null);

  const [cocoModel, setCocoModel] = useState<ObjectDetection>();
  const [userScore, setUserScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);

  const gameRef = doc(useFirestore(), "game", "nintendo");
  const { data } = useFirestoreDocData(gameRef);

  const resetGame = useCallback(() => {
    user.x = INITIAL_PLAYER1_STATE.x;
    user.y = INITIAL_PLAYER1_STATE.y;

    computer.x = INITIAL_PLAYER2_STATE.x;
    computer.y = INITIAL_PLAYER2_STATE.y;

    setUserScore(0);
    setComputerScore(0);

    setDoc(gameRef, {
      player1: "not_connected",
      player2: "not_connected",
      status: "idle",
      sound: "none",
      winner: "none",
    });
  }, []);

  useEffect(() => resetGame(), []);

  const scoreText = useCallback(
    (score: number) => {
      if (data?.status === "finished") {
        return score === MAX_SCORE ? "WINNER" : "LOOSER";
      }

      return score;
    },
    [data?.status]
  );

  useEffect(() => {
    if (data?.status === "finished") {
      setTimeout(() => resetGame(), 6000);
    }
  }, [data?.status]);

  useEffect(() => {
    const player1Won = userScore === MAX_SCORE;
    const player2Won = computerScore === MAX_SCORE;

    if (player1Won || player2Won) {
      const winner = player1Won ? "player1" : "player2";

      setDoc(
        gameRef,
        {
          status: "finished",
          winner,
        },
        { merge: true }
      );
    }
  }, [userScore, computerScore]);

  const user = useRef<User>(INITIAL_PLAYER1_STATE).current;

  const computer = useRef<User>(INITIAL_PLAYER2_STATE).current;

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
        // Player 1 going to other side of the board
        if (user.x > window.innerWidth / 2) {
          user.x = window.innerWidth / 2 - user.width;
          return;
        }

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
    if (data?.status === "finished") {
      return;
    }

    if (cocoModel && data?.status === "playing") {
      detect();
    }

    if (canvasRef.current) {
      update(
        ball,
        user,
        computer,
        setUserScore,
        setComputerScore,
        data?.status === "playing"
      );
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
  }, [detect, cocoModel, data?.status]);

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
      <h1 className="score">{scoreText(userScore)}</h1>
      <h1 className="score right">{scoreText(computerScore)}</h1>
      <span className="net"></span>
      <img
        src={Player1Paddle}
        alt="paddle"
        className="paddle user"
        ref={player1PaddleRef}
      />
      <img
        src={Player2Paddle}
        alt="paddle"
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

export default GamePage;

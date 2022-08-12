/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

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
import {
  BALL_SPEED,
  FLIPPED_VIDEO,
  GAME_ID,
  MAX_SCORE,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
} from "../utils/config";

const videoConstraints = {
  width: window.innerWidth,
  height: window.innerHeight,
  facingMode: "user",
};

const NGROK_URL = "https://8465-181-170-248-208.ngrok.io";

interface GamePageProps {
  webcam?: boolean;
}

function GamePage({ webcam = false }: GamePageProps) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const player1PaddleRef = useRef<HTMLImageElement>(null);
  const player2PaddleRef = useRef<HTMLImageElement>(null);

  const [cocoModel, setCocoModel] = useState<ObjectDetection>();
  const [userScore, setUserScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);

  const gameRef = doc(useFirestore(), "game", GAME_ID);
  const { data } = useFirestoreDocData(gameRef);

  const resetGame = useCallback(() => {
    user.x = 0;
    computer.x = window.innerWidth - PADDLE_WIDTH;
    ball.speed = BALL_SPEED;

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

  const playHitSound = useCallback((user: "player1" | "player2") => {
    setDoc(
      gameRef,
      {
        sound: user,
      },
      { merge: true }
    );
  }, []);

  const getScoreText = useCallback(
    (score: number) => {
      if (data?.status === "finished") {
        return score === MAX_SCORE ? "WINNER" : "LOOSER";
      }

      return score;
    },
    [data?.status]
  );

  useEffect(() => {
    if (data?.sound !== "none") {
      setTimeout(
        () => setDoc(gameRef, { sound: "none" }, { merge: true }),
        1000
      );
    }
  }, [data?.sound]);

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

  const user = useRef<User>({
    x: 0,
    y: window.innerHeight / 2 - PADDLE_HEIGHT / 2,
  }).current;

  const computer = useRef<User>({
    x: window.innerWidth - PADDLE_WIDTH,
    y: window.innerHeight / 2 - PADDLE_HEIGHT / 2,
  }).current;

  const ball = useRef<Ball>({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    speed: BALL_SPEED,
    velocityX: 5,
    velocityY: 5,
  }).current;

  const detect = useCallback(async () => {
    if (isWebcamReady(webcamRef.current) && cocoModel) {
      const { video } = webcamRef.current;

      if (video) {
        // Player 1 going to other side of the board
        if (user.x > window.innerWidth / 2) {
          user.x = window.innerWidth / 2 - PADDLE_WIDTH;
          return;
        }

        cocoModel.detect(video, undefined, 0.2).then((detections) => {
          const phoneDetections = detections.filter(
            (detection) => detection.class === ModelDetectionClasses.CELL_PHONE
          );

          phoneDetections.forEach((detection) => {
            const [x, y, width, height] = detection.bbox;

            if (x < window.innerWidth / 2) {
              user.x = x + (width - PADDLE_WIDTH) / 2;
              user.y = y + (height - PADDLE_HEIGHT) / 2;
            } else {
              computer.x = x + (width - PADDLE_WIDTH) / 2;
              computer.y = y + (height - PADDLE_HEIGHT) / 2;
            }
          });
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
        playHitSound,
        data?.status === "playing",
        data.player2 === "connected"
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
      <div className="player-info">
        <h1 className="score">{getScoreText(userScore)}</h1>
        {data && data.status === "idle" && (
          <div className="qr-container">
            <p className="qr-text">Scan to play!</p>
            <QRCodeSVG includeMargin value={`${NGROK_URL}/player-1`} />
          </div>
        )}
      </div>
      <div className="player-info right">
        <h1 className="score">{getScoreText(computerScore)}</h1>
        {data && data.status === "idle" && (
          <div className="qr-container">
            <p className="qr-text">Scan to play!</p>
            <QRCodeSVG includeMargin value={`${NGROK_URL}/player-2`} />
          </div>
        )}
      </div>

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
        style={{ opacity: Number(webcam) }}
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

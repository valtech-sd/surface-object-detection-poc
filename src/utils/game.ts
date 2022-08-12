import { Dispatch, SetStateAction } from "react";
import { Ball, User } from "../types";
import {
  BALL_RADIUS,
  BOARD_HEIGHT,
  BOARD_X_FINISH,
  BOARD_X_MIDDLE,
  BOARD_Y_MIDDLE,
  COMPUTER_LEVEL,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
} from "./config";

export const collision = (ball: Ball, player: User) => {
  const p = {
    top: player.y - window.innerHeight * 0.1,
    bottom: player.y + PADDLE_HEIGHT - window.innerHeight * 0.1,
    left: player.x - window.innerHeight * 0.2,
    right: player.x + PADDLE_WIDTH - window.innerHeight * 0.2,
  };

  const b = {
    top: ball.y - BALL_RADIUS,
    bottom: ball.y + BALL_RADIUS,
    left: ball.x - BALL_RADIUS,
    right: ball.x + BALL_RADIUS,
  };

  return (
    b.right >= p.left &&
    b.top <= p.bottom &&
    b.left <= p.right &&
    b.bottom >= p.top
  );
};

export const update = (
  ball: Ball,
  user: User,
  computer: User,
  setUserScore: Dispatch<SetStateAction<number>>,
  setComputerScore: Dispatch<SetStateAction<number>>,
  playHitSound: (user: "player1" | "player2") => void,
  gameStarted: boolean,
  multiplayer: boolean
) => {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  if (!multiplayer) {
    computer.y =
      ball.y -
      (computer.y + PADDLE_HEIGHT / 2) * COMPUTER_LEVEL +
      window.innerHeight * 0.1;
  }

  if (!gameStarted) {
    user.y =
      ball.y -
      (user.y + PADDLE_HEIGHT / 2) * COMPUTER_LEVEL +
      window.innerHeight * 0.1;
  }

  if (ball.y + BALL_RADIUS > BOARD_HEIGHT || ball.y - BALL_RADIUS < 0) {
    ball.velocityY = -ball.velocityY;
  }

  const player = ball.x < BOARD_X_MIDDLE ? user : computer;

  if (collision(ball, player)) {
    if (gameStarted) {
      playHitSound(player === user ? "player1" : "player2");
    }

    let collidePoint =
      ball.y - (player.y + PADDLE_HEIGHT / 2 - window.innerHeight * 0.1);
    collidePoint = collidePoint / (PADDLE_HEIGHT / 2);
    const angleRad = collidePoint * (Math.PI / 4);
    let direction = ball.x < BOARD_X_MIDDLE ? 1 : -1;

    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);
    ball.speed += 0.1;
  }

  if (ball.x - BALL_RADIUS < 0) {
    setComputerScore((prevScore: number) => prevScore + 1);
    resetBall(ball);
  } else if (ball.x + BALL_RADIUS > BOARD_X_FINISH) {
    setUserScore((prevScore) => prevScore + 1);
    resetBall(ball);
  }
};

export const resetBall = (ball: Ball) => {
  ball.x = BOARD_X_MIDDLE;
  ball.y = BOARD_Y_MIDDLE;
  ball.speed = 5;
  ball.velocityX = -ball.velocityX;
};

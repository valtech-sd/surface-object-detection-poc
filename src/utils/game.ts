import { Dispatch, SetStateAction } from "react";
import { Ball, User } from "../types";
import { BALL_RADIUS, PADDLE_HEIGHT, PADDLE_WIDTH } from "./config";

const COMPUTER_LEVEL = 0.1;

export const collision = (ball: Ball, player: User, log = false) => {
  const p = {
    top: player.y,
    bottom: player.y + PADDLE_HEIGHT,
    left: player.x,
    right: player.x + PADDLE_WIDTH,
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
  gameStarted = false
) => {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  computer.y = ball.y - (computer.y + PADDLE_HEIGHT / 2) * COMPUTER_LEVEL;

  if (!gameStarted) {
    user.y = ball.y - (user.y + PADDLE_HEIGHT / 2) * COMPUTER_LEVEL;
  }

  if (ball.y + BALL_RADIUS > window.innerHeight || ball.y - BALL_RADIUS < 0) {
    ball.velocityY = -ball.velocityY;
  }

  const player = ball.x < window.innerWidth / 2 ? user : computer;

  if (collision(ball, player)) {
    let collidePoint = ball.y - (player.y + PADDLE_HEIGHT / 2);
    collidePoint = collidePoint / (PADDLE_HEIGHT / 2);
    const angleRad = collidePoint * (Math.PI / 4);
    let direction = ball.x < window.innerWidth / 2 ? 1 : -1;

    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);
    ball.speed += 0.1;
  }

  if (ball.x - BALL_RADIUS < 0) {
    setComputerScore((prevScore: number) => prevScore + 1);
    resetBall(ball);
  } else if (ball.x + BALL_RADIUS > window.innerWidth) {
    setUserScore((prevScore) => prevScore + 1);
    resetBall(ball);
  }
};

export const resetBall = (ball: Ball) => {
  ball.x = window.innerWidth / 2;
  ball.y = window.innerHeight / 2;
  ball.speed = 5;
  ball.velocityX = -ball.velocityX;
};

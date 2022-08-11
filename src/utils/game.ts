import { Dispatch, SetStateAction } from "react";
import { Ball, User } from "../types";
import { setDoc } from "firebase/firestore";

const COMPUTER_LEVEL = 0.1;

export const collision = (ball: Ball, player: User, log = false) => {
  const p = {
    top: player.y,
    bottom: player.y + player.height,
    left: player.x,
    right: player.x + player.width,
  };

  const b = {
    top: ball.y - ball.radius,
    bottom: ball.y + ball.radius,
    left: ball.x - ball.radius,
    right: ball.x + ball.radius,
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
  gameStarted = false,
  gameRef: any
) => {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  computer.y = ball.y - (computer.y + computer.height / 2) * COMPUTER_LEVEL;

  if (!gameStarted) {
    user.y = ball.y - (user.y + user.height / 2) * COMPUTER_LEVEL;
  }

  if (ball.y + ball.radius > window.innerHeight || ball.y - ball.radius < 0) {
    ball.velocityY = -ball.velocityY;
  }

  const player = ball.x < window.innerWidth / 2 ? user : computer;

  if (collision(ball, player)) {
    if (player === user) {
      setDoc(gameRef, { sound: "player1" }, { merge: true });
      setTimeout(
        () => setDoc(gameRef, { sound: "none" }, { merge: true }),
        1000
      );
    }
    let collidePoint = ball.y - (player.y + player.height / 2);
    collidePoint = collidePoint / (player.height / 2);
    const angleRad = collidePoint * (Math.PI / 4);
    let direction = ball.x < window.innerWidth / 2 ? 1 : -1;

    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);
    ball.speed += 0.1;
  }

  if (ball.x - ball.radius < 0) {
    setComputerScore((prevScore: number) => prevScore + 1);
    resetBall(ball);
  } else if (ball.x + ball.radius > window.innerWidth) {
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

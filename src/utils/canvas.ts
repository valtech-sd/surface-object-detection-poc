import { DetectedObject } from "@tensorflow-models/coco-ssd";
import { RefObject } from "react";
import { Ball, User, ModelDetectionClasses } from "../types";

export const drawDetection = (
  detection: DetectedObject,
  canvasContext: CanvasRenderingContext2D
) => {
  const { class: text, bbox, score } = detection;
  const [x, y, width, height] = bbox;

  if (text === ModelDetectionClasses.CELL_PHONE) {
    const color = "black";

    canvasContext.strokeStyle = color;
    canvasContext.font = "18px Arial";
    canvasContext.fillStyle = color;

    canvasContext.beginPath();
    canvasContext.fillText(`${text}-${x}-${y}-${score * 100}`, x, y);
    canvasContext.rect(x, y, width, height);
    canvasContext.stroke();
  }
};

export const drawRect = (
  canvasContext: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) => {
  canvasContext!.fillStyle = color;
  canvasContext!.fillRect(x, y, w, h);
};

export const drawCircle = (
  canvasContext: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string
) => {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(x, y, r, 0, Math.PI * 2, false);
  canvasContext.closePath();
  canvasContext.fill();
};

export const clearCanvas = (canvasContext: CanvasRenderingContext2D) =>
  canvasContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

export const render = (
  canvasContext: CanvasRenderingContext2D | null | undefined,
  ball: Ball,
  user: User,
  computer: User,
  player1PaddleRef: RefObject<HTMLImageElement>,
  player2PaddleRef: RefObject<HTMLImageElement>
) => {
  if (canvasContext && player1PaddleRef && player2PaddleRef) {
    clearCanvas(canvasContext);

    player1PaddleRef.current!.style.visibility = "visible";
    player1PaddleRef.current!.style.top = (user.y - 5).toString() + "px";
    player1PaddleRef.current!.style.left = user.x.toString() + "px";

    player2PaddleRef.current!.style.visibility = "visible";
    player2PaddleRef.current!.style.top = (computer.y - 5).toString() + "px";
    player2PaddleRef.current!.style.left = computer.x.toString() + "px";

    drawRect(
      canvasContext,
      user.x,
      user.y,
      user.width,
      user.height,
      user.color
    );
    drawRect(
      canvasContext,
      window.innerWidth - 10,
      computer.y,
      computer.width,
      computer.height,
      computer.color
    );
    drawCircle(canvasContext, ball.x, ball.y, ball.radius, ball.color);
  }
};

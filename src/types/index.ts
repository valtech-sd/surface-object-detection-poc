export type User = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

export type Ball = {
  x: number;
  y: number;
  radius: number;
  color: string;
  speed: number;
  velocityX: number;
  velocityY: number;
};

export { default as ModelDetectionClasses } from "./modelDetectionClasses";

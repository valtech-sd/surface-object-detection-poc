export type User = {
  x: number;
  y: number;
};

export type Ball = {
  x: number;
  y: number;
  speed: number;
  velocityX: number;
  velocityY: number;
};

export type GameState = {
  player1: "connected" | "not_connected";
  player2: "connected" | "not_connected";
  status: "idle" | "playing" | "finished";
  sound: "none" | "sound_player_1" | "sound_player_2";
  winner: "none" | "player_1" | "player_2";
};

export { default as ModelDetectionClasses } from "./modelDetectionClasses";

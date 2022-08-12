export const FLIPPED_VIDEO = false;
export const MAX_SCORE = 2;
export const PADDLE_WIDTH = 10;
export const PADDLE_HEIGHT = 100;
export const PADDLE_COLOR = "transparent";
export const BALL_RADIUS = 10;
export const BALL_COLOR = "white";
export const BALL_SPEED = 5;
export const COMPUTER_LEVEL = 0.1;
export const GAME_ID = process.env.REACT_APP_GAME_ID as string;

export const BOARD_X_START = window.innerWidth * 0.1 + 10;
export const BOARD_X_MIDDLE = window.innerWidth / 2;
export const BOARD_X_FINISH = window.innerWidth * 0.9 - 10;
export const BOARD_WIDTH = BOARD_X_FINISH - BOARD_X_START;

export const BOARD_Y_START = window.innerHeight * 0.1 + 10;
export const BOARD_Y_MIDDLE = window.innerHeight / 2;
export const BOARD_Y_FINISH = window.innerHeight * 0.9 - 10;
export const BOARD_HEIGHT = BOARD_Y_FINISH - BOARD_Y_START;

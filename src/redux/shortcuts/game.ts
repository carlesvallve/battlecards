import StateObserver from "../StateObserver";

export const getGameSate = () => {
  return StateObserver.getState().game.gameState;
};

export const isGamePaused = () => {
  return StateObserver.getState().game.gameState === 'Pause';
};

export const isGameOver = () => {
  return StateObserver.getState().game.gameState === 'GameOver';
};


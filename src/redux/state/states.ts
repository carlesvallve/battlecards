import StateObserver from 'src/redux/StateObserver';

// user

export const getScore = () => {
  return StateObserver.getState().user.score;
};

export const getStars = () => {
  return StateObserver.getState().user.stars;
};

export const getHearts = () => {
  return StateObserver.getState().user.hearts;
};

// game

export const isGamePaused = () => {
  return StateObserver.getState().game.gameState === 'Pause';
};

export const isGameOver = () => {
  return StateObserver.getState().game.gameState === 'GameOver';
};

export const isGameActive = () => {
  return (
    StateObserver.getState().game.gameState === 'Play' ||
    StateObserver.getState().game.gameState === 'GameOver'
  );
};

// ninja

export const getNinjaGoal = () => {
  return StateObserver.getState().ninja.goal;
};

// ninja states

export const isNinjaIdle = () => {
  return StateObserver.getState().ninja.entityState === 'Idle';
};

export const isNinjaRunning = () => {
  return StateObserver.getState().ninja.entityState === 'Run';
};

export const isNinjaJumping = () => {
  return StateObserver.getState().ninja.entityState === 'Jump';
};

export const isNinjaAttacking = () => {
  return StateObserver.getState().ninja.entityState === 'Attack';
};

export const isNinjaRespawning = () => {
  return StateObserver.getState().ninja.respawning;
};

export const isNinjaDead = () => {
  return StateObserver.getState().ninja.entityState === 'Die';
};

// ui

export const getScene = () => {
  return StateObserver.getState().ui.scene;
};

export const isLoading = () => {
  return StateObserver.getState().ui.isLoading;
};

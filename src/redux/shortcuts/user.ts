import StateObserver from 'src/redux/StateObserver';

export const getScore = () => {
  return StateObserver.getState().user.score;
};

export const getLevel = () => {
  return StateObserver.getState().user.level;
};

export const getHP = () => {
  return StateObserver.getState().user.HP;
};

export const getEP = () => {
  return StateObserver.getState().user.HP;
};
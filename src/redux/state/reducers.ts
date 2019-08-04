import { combineReducers } from 'redux';

import game from './reducers/game';
import ui from './reducers/ui';
import user from './reducers/user';
import combat from './reducers/combat';
import cards from './reducers/cards';

export default combineReducers({ game, ui, user, combat, cards });

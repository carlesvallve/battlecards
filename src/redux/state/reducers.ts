import { combineReducers } from 'redux';

import user from './reducers/user';
import game from './reducers/game';
import ui from './reducers/ui';
import ninja from './reducers/ninja';

export default combineReducers({ user, game, ui, ninja });

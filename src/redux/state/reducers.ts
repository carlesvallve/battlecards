import { combineReducers } from 'redux';

import user from './reducers/user';
import game from './reducers/game';
import ui from './reducers/ui';

export default combineReducers({ user, game, ui });

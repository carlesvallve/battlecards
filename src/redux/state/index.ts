import reducers from './reducers';
import { Immutable } from '../utils/immutable';

export type State = Immutable<ReturnType<typeof reducers>>;

// usage example in Hud

// StateObserver.dispatch(selectScene('mapUpgrade'));
// StateObserver.createSelector(
//   (state) => state.user.playing === true,
// ).addListener((active) => {
// });

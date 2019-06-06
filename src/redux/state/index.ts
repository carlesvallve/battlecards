import reducers from './reducers';
import { Immutable } from '../utils/immutable';

export type State = Immutable<ReturnType<typeof reducers>>;

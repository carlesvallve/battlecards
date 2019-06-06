import {
  configureStore,
  getDefaultMiddleware,
  AnyAction,
} from 'redux-starter-kit';

// import reduxSentryMiddleware from 'src/state/utils/reduxSentryMiddleware';

import reducers from './state/reducers';
import { State } from './state';
import { update } from './state/user';

// import {
//   createClientReplicant,
//   ReplicantOpts,
//   ClientReplicant,
//   dev_fetchAllIDsOffline,
// } from '@blackstormlabs/replicant';
// import replicantConfig from 'src/replicant/config';
// import { State as ReplicantState } from 'src/replicant/State';

export type Flag<T extends string> = T | '' | false | null | undefined;
export type Listener<TSubState = State> = (state: TSubState) => void;

// const simulatedLatencyOffline = 0;

// function createReplicantOpts(
//   signature: string,
//   checkForMessagesInterval: number,
// ): ReplicantOpts {
//   const offline = !!process.env.REPLICANT_OFFLINE;
//   if (offline) {
//     return {
//       offline: true,
//       checkForMessagesInterval,
//       latency: simulatedLatencyOffline,
//     };
//   }

//   if (!process.env.REPLICANT_ENDPOINT) {
//     throw new Error('Invalid replicant endpoint');
//   }

//   return {
//     offline: false,
//     endpoint: process.env.REPLICANT_ENDPOINT,
//     signature,
//     checkForMessagesInterval,
//   };
// }

export class Selector<TSubState> {
  private listeners: Array<Listener<TSubState>> = [];

  private subState: TSubState = null;

  constructor(
    private stateObserver: StateObserver,
    private emitter: (state: State) => TSubState,
  ) {}

  addListener(listener: Listener<TSubState>, noInit?: Flag<'noInit'>) {
    if (this.listeners.includes(listener)) {
      throw new Error(
        'Selector.removeListener Error: Listener already subscribed.',
      );
    }

    if (!this.listeners.length) {
      this.stateObserver.addListener(this.onStateChange);
    }

    this.listeners.push(listener);

    noInit || listener(this.subState);
  }

  removeListener(listener: Listener<TSubState>) {
    const index = this.listeners.indexOf(listener);

    if (index < 0) {
      throw new Error('Selector.removeListener Error: Listener not found.');
    }

    this.listeners.splice(index, 1);

    if (!this.listeners.length) {
      this.stateObserver.removeListener(this.onStateChange);
    }
  }

  private onStateChange: Listener = (state) => {
    const subState = this.emitter(state);

    if (!this.statesEqual(this.subState, subState)) {
      this.subState = subState;

      this.listeners.forEach((listener) => listener(this.subState));
    }
  };

  private statesEqual(a: TSubState, b: TSubState) {
    const aType = typeof a;
    const bType = typeof b;

    if (aType === 'function' || bType === 'function') {
      // Equality checks for functions don't work as expected
      throw new Error('Do not emit functions.');
    }

    if (aType !== bType) {
      return false;
    }

    if (aType !== 'object') {
      return a === b;
    }

    if (a === b) {
      return true;
    }

    // `typeof null === 'object', so we need this check as well
    if (a === null || b === null) {
      return false;
    }

    if (Array.isArray(a)) {
      return (
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((x, i) => b[i] === x)
      );
    }

    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) {
      return false;
    }

    return aKeys.every((key) => key in b && a[key] === b[key]);
  }
}

const reducer: typeof reducers = (state, action) => {
  if (action.type === 'RESET_APP') {
    state = undefined;
  }

  return reducers(state, action);
};

const middleware = () => {
  const middlewares = getDefaultMiddleware();

  // if (process.env.SENTRY_ENVIRONMENT) {
  //   middlewares.push(reduxSentryMiddleware);
  // }

  return middlewares;
};

class StateObserver {
  private store = configureStore<ReturnType<typeof reducer>, AnyAction>({
    reducer,
    middleware: middleware(),
  });

  // private replicant?: ClientReplicant<
  //   ReplicantState,
  //   typeof replicantConfig.actions
  // >;

  private listeners: Array<Listener>;
  //

  private errorHandler: (error: string) => void = () => {};
  private networkErrorHandler: (error: string) => void = () => null;

  async init(opts: {
    playerId: string;
    signature: string;
    // errorHandler: (error: string) => void;
    // networkErrorHandler: (error: string) => void;
  }) {
    // this.errorHandler = opts.errorHandler;
    // this.networkErrorHandler = opts.networkErrorHandler;

    if (this.listeners) {
      throw new Error('StateObserver.init Error: Already initialized.');
    }

    this.listeners = [];

    this.store.subscribe(() =>
      this.listeners.forEach((x) => x(this.store.getState())),
    );

    const checkForMessagesInterval = 10000;

    // this.replicant = await createClientReplicant(
    //   replicantConfig,
    //   opts.playerId,
    //   createReplicantOpts(opts.signature, checkForMessagesInterval),
    // );

    // this.replicant.setOnReplicationError(this.errorHandler);
    // this.replicant.setOnNetworkError(this.networkErrorHandler);

    this.store.dispatch(update(opts)); // this.replicant.state

    // this.replicant.onStateChanged((state) =>
    //   this.store.dispatch(update(state)),
    // );
  }

  //

  addListener(listener: Listener, noInit?: Flag<'noInit'>) {
    if (!this.listeners) {
      throw new Error('StateObserver.addListener Error: Not initialized.');
    }

    if (this.listeners.includes(listener)) {
      throw new Error(
        'this.removeListener Error: Listener already subscribed.',
      );
    }

    this.listeners.push(listener);

    noInit || listener(this.store.getState());
  }

  removeListener(listener: Listener) {
    if (!this.listeners) {
      throw new Error('StateObserver.removeListener Error: Not initialized.');
    }

    const index = this.listeners.indexOf(listener);

    if (index < 0) {
      throw new Error('this.removeListener Error: Listener not found.');
    }

    this.listeners.splice(index, 1);
  }

  //

  createSelector<TSubState>(emitter: (state: State) => TSubState) {
    return new Selector<TSubState>(this, emitter);
  }

  //

  getState() {
    return this.store.getState();
  }

  readonly dispatch = this.store.dispatch.bind(this.store);

  // get invoke() {
  //   return this.replicant.invoke;
  // }

  // get fetchStates() {
  //   return this.replicant.fetchStates.bind(this.replicant);
  // }

  // now() {
  //   return this.replicant.now();
  // }

  // //

  // dev_fetchOfflineUserIDs(): string[] {
  //   return dev_fetchAllIDsOffline(this.replicant);
  // }

  //

  resetStore() {
    this.store.dispatch({ type: 'RESET_APP' });
  }

  // Reset the state without the user state.
  resetAppState() {
    const userState = this.store.getState().user;
    this.resetStore();
    this.dispatch(update(userState));
  }

  // async refresh() {
  //   try {
  //     await this.replicant.refresh();
  //     return true;
  //   } catch (reason) {
  //     this.networkErrorHandler(reason);
  //     return false;
  //   }
  // }

  // async reconnect() {
  //   return this.replicant.retryLastRequest();
  // }

  // async waitForEmptyQueue() {
  //   return this.replicant.waitForEmptyQueue();
  // }

  // async refreshMessages() {
  //   await this.replicant.flush();
  //   await this.replicant.checkForMessages();
  // }
}

export default new StateObserver();

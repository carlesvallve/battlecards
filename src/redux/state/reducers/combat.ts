import {
  createSlice,
  PayloadAction,
  createSerializableStateInvariantMiddleware,
} from 'redux-starter-kit';
import { Target, TargetData, TargetStat, Combat } from 'src/types/custom';
import { CardNum } from 'src/game/components/cards/CardNumber';
import { MonsterID } from 'src/redux/ruleset/monsters';
import ruleset from 'src/redux/ruleset';
// import ruleset from 'src/redux/ruleset';

const initialState = {
  index: 0,

  target: null,
  enemy: null,

  hero: {
    id: 'hero',
    meter: 0,
    maxSteps: 12,
    overhead: 0,
    resolved: false,
    stats: {
      hp: { current: 20, max: 20, last: 20 },
      ep: { current: 20, max: 20, last: 20 },
      attack: { current: 5, max: 5 },
      defense: { current: 2, max: 5 },
      status: [],
    },
  },

  monster: {
    id: null,
    meter: 0,
    maxSteps: 12,
    overhead: 0,
    resolved: false,
    stats: {
      hp: { current: 20, max: 20, last: 12 },
      ep: { current: 20, max: 20, last: 12 },
      attack: { current: 3, max: 5 },
      defense: { current: 1, max: 5 },
      status: [],
    },
  },
} as Combat;

const slice = createSlice({
  initialState,

  reducers: {
    // update: (_, { payload }: PayloadAction<any>) => payload,

    action_setMonsterID: (
      state,
      { payload }: PayloadAction<{ id: MonsterID }>,
    ) => {
      const { id } = payload;
      state.monster.id = id;
      state.monster.maxSteps = ruleset.monsters[id].maxSteps;
    },

    action_newCombat: (
      state,
      { payload }: PayloadAction<{ monsterID: MonsterID }>,
    ) => {
      const { monsterID } = payload;

      state.index = 0; // state.index === 1 ? 2 : 1;

      state.target = 'hero';
      state.enemy = 'monster';

      state.hero.meter = 0;
      state.hero.overhead = 0;
      state.hero.resolved = false;

      state.monster.id = monsterID;
      state.monster.meter = 0;
      state.monster.maxSteps = 8; // ruleset.monsters[monsterID].maxSteps;
      state.monster.overhead = 0;
      state.monster.resolved = false;

      // state.hero.stats = {
      //   hp: { current: 20, max: 20 },
      //   ep: { current: 20, max: 20 },
      //   attack: { current: 3, max: 5 },
      //   defense: { current: 1, max: 5 },
      // };

      // todo: generate a monster and fill this from monster ruleset, slightly randomized
      state.monster.stats = {
        hp: { current: 12, max: 20, last: 12 },
        ep: { current: 12, max: 20, last: 12 },
        attack: { current: 3, max: 5 },
        defense: { current: 1, max: 5 },
        status: state.monster.stats.status,
      };

      console.log('=========================');
      console.log('action > newCombat', { ...state });
    },

    action_resetCombatTurn: (state) => {
      console.log('action > resetCombatTurn');

      state.index = 0;

      state.hero.meter = 0;
      state.hero.overhead = 0;
      state.hero.resolved = false;

      state.monster.meter = 0;
      state.monster.overhead = 0;
      state.monster.resolved = false;
    },

    action_changeTarget: (
      state,
      { payload }: PayloadAction<{ newTarget?: Target }>,
    ) => {
      if (payload.newTarget) {
        state.target = payload.newTarget;
      } else {
        state.target = state.target === 'hero' ? 'monster' : 'hero';
      }
      state.enemy = state.target === 'hero' ? 'monster' : 'hero';

      console.log('action > changeTarget:', state.target);
    },

    action_throwDice: (
      state,
      { payload }: PayloadAction<{ target: Target; value: number }>,
    ) => {
      const { target, value } = payload;

      if (!state.target) {
        state.target = target;
        state.enemy = state.target === 'hero' ? 'monster' : 'hero';
      }

      state[target].overhead = 0;
      state[target].meter += value;

      if (state[target].meter > state[target].maxSteps) {
        state[target].overhead = state[target].meter - state[target].maxSteps;
        state[target].meter = 0;
      }

      state.index += 1;

      console.log('action > throwDice:', target, { ...state[target] });
    },

    action_setResolved: (
      state,
      { payload }: PayloadAction<{ target: Target }>,
    ) => {
      const { target } = payload;
      state[target].resolved = true;
      state.index += 1;
      console.log('action > setResolved:', target, { ...state[target] });
    },

    // =============

    // =============

    action_addStat: (
      state,
      {
        payload,
      }: PayloadAction<{ target: Target; type: string; value: TargetStat }>,
    ) => {
      const { target, type, value } = payload;
      const stat = state[target].stats[type];

      if (stat.last) stat.last = stat.current;

      if (value.current) stat.current += value.current;
      if (stat.current > stat.max) stat.current = stat.max;

      if (value.max) stat.max += value.max;
    },

    action_setStat: (
      state,
      {
        payload,
      }: PayloadAction<{ target: Target; type: string; value: TargetStat }>,
    ) => {
      const { target, type, value } = payload;
      if (value.current) state[target].stats[type].current = value.current;
      if (value.max) state[target].stats[type].max = value.max;
    },
  },
});

export const {
  action_setMonsterID,
  action_newCombat,
  action_resetCombatTurn,
  action_changeTarget,
  action_throwDice,
  action_setResolved,

  action_addStat,
  action_setStat,
} = slice.actions;
export default slice.reducer;

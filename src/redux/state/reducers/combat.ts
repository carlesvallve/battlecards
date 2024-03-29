import {
  createSlice,
  PayloadAction,
} from 'redux-starter-kit';
import { Target, TargetStat, Combat } from 'src/types/custom';
import { MonsterID } from 'src/redux/ruleset/monsters';
import ruleset from 'src/redux/ruleset';
import { getRandomInt } from 'src/lib/utils';
// import ruleset from 'src/redux/ruleset';

const initialState = {
  index: {
    combat: 0,
    turn: 0,
  },

  target: null,
  enemy: null,

  hero: {
    id: 'hero',
    meter: 0,

    overhead: 0,
    attacks: 0,
    resolved: false,
    isDead: false,
    stats: {
      maxSteps: 12,
      maxCards: 4,
      hp: { current: 20, max: 20 },
      ep: { current: 20, max: 20 },
      attack: { current: 5, max: 5 },
      defense: { current: 2, max: 5 },
      status: [],
    },
  },

  monster: {
    id: null,
    meter: 0,

    attacks: 0,
    overhead: 0,
    resolved: false,
    isDead: false,
    stats: {
      maxSteps: 12,
      maxCards: 4,
      hp: { current: 20, max: 20 },
      ep: { current: 20, max: 20 },
      attack: { current: 5, max: 5 },
      defense: { current: 1, max: 5 },
      status: [],
    },
  },
} as Combat;

const slice = createSlice({
  initialState,

  reducers: {
    // update: (_, { payload }: PayloadAction<any>) => payload,

    // =====================================================================
    // Combat flow

    action_setMonsterID: (
      state,
      { payload }: PayloadAction<{ id: MonsterID }>,
    ) => {
      const { id } = payload;
      state.monster.id = id;
      state.monster.stats.maxSteps = ruleset.monsters[id].maxSteps;
    },

    action_newCombat: (
      state,
      { payload }: PayloadAction<{ monsterID: MonsterID }>,
    ) => {
      const { monsterID } = payload;

      // update combat index
      state.index.combat += 1;
      state.index.turn = 1;

      state.target = 'hero';
      state.enemy = 'monster';

      //  ========= hero =========

      state.hero.meter = 0;
      state.hero.overhead = 0;
      state.hero.resolved = false;
      state.hero.isDead = false;

      // reset hero stats if it's the first combat
      if (state.index.combat === 1) {
        state.hero.stats = {
          maxSteps: 12,
          maxCards: 4,
          hp: { current: 20, max: 20 },
          ep: { current: 20, max: 20 },
          attack: { current: 5, max: 5 },
          defense: { current: 1, max: 5 },
          status: state.monster.stats.status,
        };
      }

      //  ========= monster =========

      state.monster.id = monsterID;

      state.monster.meter = 0;
      state.monster.overhead = 0;
      state.monster.resolved = false;
      state.monster.isDead = false;

      state.monster.stats = {
        maxSteps: 5 + getRandomInt(0, 6), // ruleset.monsters[monsterID].maxSteps;
        maxCards: 4,
        hp: { current: 12, max: 20 },
        ep: { current: 20, max: 20 },
        attack: { current: 5, max: 5 },
        defense: { current: 1, max: 5 },
        status: state.monster.stats.status,
      };
    },

    action_resetCombatTurn: (state) => {
      state.index.turn += 1; // updating turn index

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

      if (state[target].meter > state[target].stats.maxSteps) {
        state[target].overhead =
          state[target].meter - state[target].stats.maxSteps;
        state[target].meter = 0;
      }

      state.index.turn += 1; // updating turn index
    },

    action_setResolved: (
      state,
      { payload }: PayloadAction<{ target: Target }>,
    ) => {
      const { target } = payload;
      state[target].resolved = true;

      state.index.turn += 1; // updating turn index
    },

    action_setMeter: (
      state,
      { payload }: PayloadAction<{ target: Target; value: number }>,
    ) => {
      const { target, value } = payload;
      state[target].meter = value;
    },

    action_kill: (state, { payload }: PayloadAction<{ target: Target }>) => {
      const { target } = payload;
      state[target].isDead = true;
      if (target === 'hero') state.index.combat = 0;
    },

    // =====================================================================
    // Stats

    action_addStat: (
      state,
      {
        payload,
      }: PayloadAction<{ target: Target; type: string; value: TargetStat }>,
    ) => {
      const { target, type, value } = payload;
      const stat = state[target].stats[type];

      if (value.current) stat.current += value.current;
      if (stat.current > stat.max) stat.current = stat.max;

      if (value.max) stat.max += value.max;
    },
  },

  // =====================================================================
});

export const {
  action_setMonsterID,
  action_newCombat,
  action_resetCombatTurn,
  action_changeTarget,
  action_throwDice,
  action_setResolved,
  action_setMeter,
  action_kill,
  action_addStat,
} = slice.actions;
export default slice.reducer;

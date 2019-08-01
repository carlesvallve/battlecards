import { createSlice, PayloadAction } from 'redux-starter-kit';
import { CardID } from 'src/ruleset/cards';

const slice = createSlice({
  initialState: {
    score: 0,
    highscore: 0,
    stars: 0,
    hearts: 3,
    countdown: 10,

    cards: [],
    deck: [],
    hand: [],
    discardPile: [],
  },
  reducers: {
    // update: (_, { payload }: PayloadAction<any>) => payload,

    setScore: (state, { payload }: PayloadAction<number>) => {
      state.score = payload;
    },

    addScore: (state, { payload }: PayloadAction<number>) => {
      state.score += payload;
    },
    setHighscore: (state, { payload }: PayloadAction<number>) => {
      state.highscore = payload;
    },

    setStars: (state, { payload }: PayloadAction<number>) => {
      state.stars = payload;
    },
    addStars: (state, { payload }: PayloadAction<number>) => {
      state.stars += payload;
    },

    setHearts: (state, { payload }: PayloadAction<number>) => {
      state.hearts = payload;
    },
    addHearts: (state, { payload }: PayloadAction<number>) => {
      state.hearts += payload;
    },

    setCountdown: (state, { payload }: PayloadAction<number>) => {
      state.countdown = payload;
    },

    // ============= cards ===============

    addCardToDeck: (state, { payload }: PayloadAction<CardID>) => {
      state.deck.push(payload);
    },

    addCardToHand: (state, { payload }: PayloadAction<CardID>) => {
      state.deck.push(payload);
    },

    addCardToDiscardPile: (state, { payload }: PayloadAction<CardID>) => {
      state.discardPile.push(payload);
    },

    generateDeck: (state, { payload }: PayloadAction<CardID>) => {
      // shuffle all available cards
      // pick N cards,
      // add them to deck array
    },

    drawHand: (state, { payload }: PayloadAction<CardID>) => {
      // shuffle all available cards in deck
      // pick N cards,
      // add them to hand array
    },

    drawCard: (state, { payload }: PayloadAction<CardID>) => {
      // pick first card in deck
      // remove card from deck array
      // add card to hand array
    },

    discardCard: (state, { payload }: PayloadAction<CardID>) => {
      // remove card from hand array
      // add card to discardPile array
    },
  },
});

export const {
  setScore,
  addScore,
  setHighscore,
  setStars,
  addStars,
  setHearts,
  addHearts,
  setCountdown,
} = slice.actions;
export default slice.reducer;

import { createSlice, PayloadAction } from 'redux-starter-kit';
import { CardID } from 'src/redux/ruleset/cards';

const slice = createSlice({
  initialState: {
    cards: [],
    deck: [],
    hand: [],
    discardPile: [],
  },

  reducers: {
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
  addCardToDeck,
  addCardToHand,
  addCardToDiscardPile,
  generateDeck,
  drawHand,
  drawCard,
  discardCard,
} = slice.actions;
export default slice.reducer;

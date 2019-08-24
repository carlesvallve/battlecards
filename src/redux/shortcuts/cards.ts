import ruleset from '../ruleset';
import { CardID } from '../ruleset/cards';
import { getRandomItemFromArray } from 'src/lib/utils';

export const getRandomCardID = (): CardID => {
  return getRandomItemFromArray(ruleset.cardIds);
};

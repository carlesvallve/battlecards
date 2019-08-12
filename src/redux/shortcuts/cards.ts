import ruleset from '../ruleset';
import { CardID } from '../ruleset/cards';
import { getRandomItemFromArray } from 'src/lib/utils';

export const getRandomCardID = (): CardID => {
  // console.log('>>>', ruleset.cardIds);
  return getRandomItemFromArray(ruleset.cardIds);
};

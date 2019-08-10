import SceneBasic from './SceneBasic';
import ButtonView from 'ui/widget/ButtonView';
import { getScreenDimensions } from 'src/lib/utils';
import { navigateToScene } from 'src/redux/shortcuts/ui';

import BattleFooter from '../components/battle/BattleFooter';
import BattleHeader from '../components/battle/BattleHeader';
import BattleArena from '../components/battle/BattleArena';
import BattleCardHand from '../components/battle/BattleCardHand';
import { getRandomMonster } from 'src/redux/shortcuts/combat';

export default class SceneGame extends SceneBasic {
  constructor() {
    super();
    this.createViews();
    this.createNavSelector('game');
  }

  protected init() {
    console.log('Init game');
  }

  private createViews() {
    const screen = getScreenDimensions();

    const bg = new ButtonView({
      superview: this.container,
      width: screen.width,
      height: screen.height,
      backgroundColor: '#222',
      onClick: () => navigateToScene('title'),
    });

    const monsterData = getRandomMonster();

    const battleArea = new BattleArena({
      superview: this.container,
      monsterData,
    });

    const header = new BattleHeader({
      superview: this.container,
      monsterData,
    });

    const footer = new BattleFooter({
      superview: this.container,
    });

    const cards = new BattleCardHand({
      superview: this.container,
    });
  }
}

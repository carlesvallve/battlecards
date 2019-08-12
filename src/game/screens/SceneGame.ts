import SceneBasic from './SceneBasic';
import ButtonView from 'ui/widget/ButtonView';
import { getScreenDimensions } from 'src/lib/utils';
import { getRandomMonster } from 'src/redux/shortcuts/combat';
import BattleArena from '../components/battle/BattleArena';

export default class SceneGame extends SceneBasic {
  private battleArena: BattleArena;

  constructor() {
    super();
    this.createViews();
    this.createNavSelector('game');
  }

  protected init() {
    console.log('Init game');
    this.battleArena.init();
  }

  private createViews() {
    const screen = getScreenDimensions();

    const bg = new ButtonView({
      superview: this.container,
      width: screen.width,
      height: screen.height,
      backgroundColor: '#222',
    });

    const monsterData = getRandomMonster();

    this.battleArena = new BattleArena({
      superview: this.container,
      monsterData,
    });
  }
}

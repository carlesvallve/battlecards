import SceneBasic from './SceneBasic';
import ButtonView from 'ui/widget/ButtonView';
import { getScreenDimensions } from 'src/lib/utils';
import { getRandomMonster } from 'src/redux/shortcuts/combat';
import BattleArena from '../components/battle/BattleArena';
import GameOver from '../components/battle/GameOver';

export default class SceneGame extends SceneBasic {
  private battleArena: BattleArena;
  private gameOver: GameOver;

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
      // backgroundColor: '#222',
    });

    this.battleArena = new BattleArena({
      superview: this.container,
    });

    this.gameOver = new GameOver({
      superview: this.container,
    })
  }
}

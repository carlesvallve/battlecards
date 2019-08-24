import SceneBasic from './SceneBasic';
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
    this.gameOver.init();
    this.battleArena.init();
  }

  private createViews() {
    this.battleArena = new BattleArena({
      superview: this.container,
    });

    this.gameOver = new GameOver({
      superview: this.container,
    });
  }
}

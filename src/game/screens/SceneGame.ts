import SceneBasic from './SceneBasic';
import ButtonView from 'ui/widget/ButtonView';
import { getScreenDimensions } from 'src/lib/utils';
import { navigateToScene } from 'src/redux/shortcuts/ui';

import BattleFooter from '../components/battle/BattleFooter';
import BattleHeader from '../components/battle/BattleHeader';
import BattleArea from '../components/battle/BattleArea';

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

    const header = new BattleHeader({
      superview: this.container,
    });

    const footer = new BattleFooter({
      superview: this.container,
    });

    const battleArea = new BattleArea({
      superview: this.container,
    });

    // const card = new Card({
    //   superview: this.container,
    //   id: 'airForce',
    //   x: screen.width / 2,
    //   y: screen.height / 2,
    // });
  }
}

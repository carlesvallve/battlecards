import animate from 'animate';
import Basic, { BasicProps } from '../basic/Basic';
import uiConfig from 'src/lib/uiConfig';
import bitmapFonts from 'src/lib/bitmapFonts';
import ButtonScaleViewWithText from 'src/lib/views/ButtonScaleViewWithText';
import StateObserver from 'src/redux/StateObserver';
import { resolveCombat } from 'src/redux/shortcuts/combat';

type ButtonActionState = 'hold' | 'attack' | 'defend';

const icons = {
  hold: 'resources/images/ui/icons/hold.png',
  attack: 'resources/images/ui/icons/sword.png',
  defend: 'resources/images/ui/icons/shield.png',
};

export default class ButtonAction extends Basic {
  private button: ButtonScaleViewWithText;
  private state: ButtonActionState;

  constructor(props: BasicProps) {
    super(props);
    this.createSelectors();
  }

  private createSelectors() {
    StateObserver.createSelector(
      ({ combat }) => combat.hero.meter - combat.monster.meter,
    ).addListener((diff) => {
      // change button action icon
      if (diff === 0) {
        this.state = 'hold';
        this.button.updateIconImage({
          url: icons.hold,
          size: 0.525,
          x: 2,
          y: -2,
        });
      } else if (diff > 0) {
        this.state = 'attack';
        this.button.updateIconImage({
          url: icons.attack,
          size: 0.475,
          x: 0,
          y: 0,
        });
      } else if (diff < 0) {
        this.state = 'defend';
        this.button.updateIconImage({
          url: icons.defend,
          size: 0.5,
          x: 0,
          y: -2,
        });
      }
    });
  }

  protected update(props: BasicProps) {
    super.update(props);
  }

  protected createViews(props: BasicProps) {
    super.createViews(props);

    this.container.updateOpts({
      // backgroundColor: 'yellow',
      width: 60,
      height: 70,
      centerOnOrigin: true,
      centerAnchor: true,
    });

    this.button = new ButtonScaleViewWithText({
      ...uiConfig.buttonMenu,
      superview: this.container,
      width: 60,
      height: 70,
      labelOffsetY: -3,
      localeText: () => '',
      size: 16,
      font: bitmapFonts('TitleStroke'),
      iconData: {
        url: 'resources/images/ui/icons/hold.png',
        size: 0.55,
        x: 2,
        y: -2,
      },
      onClick: () => {
        resolveCombat();
      },
    });
  }
}

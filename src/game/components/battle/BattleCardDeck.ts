import animate from 'animate';
import sounds from 'src/lib/sounds';
import View from 'ui/View';
import Card from '../cards/Card';
import BattleCardDetails from './BattleCardDetails';
import { getScreenDimensions, getRandomItemsFromArr } from 'src/lib/utils';
import uiConfig, { animDuration } from 'src/lib/uiConfig';
import ruleset from 'src/redux/ruleset';
import { CardType, Target } from 'src/types/custom';
import { CardID } from 'src/redux/ruleset/cards';
import ButtonScaleViewWithText from 'src/lib/views/ButtonScaleViewWithText';
import bitmapFonts from 'src/lib/bitmapFonts';
import LangBitmapFontTextView from 'src/lib/views/LangBitmapFontTextView';

type Props = {
  superview: View;
  zIndex: number;
  target: Target;
  startGame: () => void;
};

export default class BattleCardDeck {
  private props: Props;
  private container: View;
  private deckCards: Card[];
  private cardDetails: BattleCardDetails;

  public static deckData: {
    hero: CardID[];
    monster: CardID[];
  };

  constructor(props: Props) {
    BattleCardDeck.deckData = { hero: [], monster: [] };

    this.props = props;
    this.createViews(props);
  }

  init() {
    this.createDeckCards(this.props);
  }

  private createViews(props: Props) {
    const screen = getScreenDimensions();

    this.container = new View({
      superview: props.superview,
      width: screen.width,
      height: screen.height,
      x: 0,
      y: 0,
      infinite: true,
      canHandleEvents: false,
      zIndex: props.zIndex,
    });

    this.cardDetails = new BattleCardDetails({
      superview: this.container,
      zIndex: 2,
    });

    const titleText = new LangBitmapFontTextView({
      superview: this.container,
      color: 'red',
      x: screen.width * 0.5,
      y: screen.height * 0.1,
      centerOnOrigin: true,
      align: 'center',
      verticalAlign: 'center',
      width: screen.width,
      height: 100,
      font: bitmapFonts('TitleStroke'),
      size: 34,
      localeText: () => 'BATTLE DECK',
    });

    const buttonDeck = new ButtonScaleViewWithText({
      ...uiConfig.buttonWhite,
      superview: this.container,
      x: screen.width * 0.5,
      y: screen.height * 0.9 - 5,
      centerOnOrigin: true,
      width: 200,
      height: 70,
      labelOffsetY: -3,
      localeText: () => 'OKAY',
      size: 16,
      font: bitmapFonts('TitleStroke'),
      onClick: () => {
        console.log('>>> click!', props.startGame);
        animate(this.container)
          .then(
            { opacity: 0, y: screen.height * 1 },
            animDuration,
            animate.easeInOut,
          )
          .then(() => {
            this.container.hide();
            props.startGame();
          });
      },
    });
  }

  // ===================================================

  createDeckCards(props: Props) {
    const modifiers = this.getRandomCardsOfType('modifier', 4);
    const weapons = this.getRandomCardsOfType('weapon', 2);
    const shields = this.getRandomCardsOfType('shield', 2);
    const spells = this.getRandomCardsOfType('spell', 2);
    const potions = this.getRandomCardsOfType('potion', 2);

    const deckData = [
      ...modifiers,
      ...weapons,
      ...shields,
      ...spells,
      ...potions,
    ];

    this.deckCards = [];

    const columns = 4;
    const dx = 77;
    const dy = 110;

    deckData.forEach((id, index) => {
      const coords = {
        x: index % columns,
        y: Math.floor(index / columns),
      };

      const x = 45 + coords.x * dx;
      const y = 155 + coords.y * dy;

      const card = new Card({
        superview: this.container,
        id,
        side: 'front',
        mode: 'mini',
        x,
        y: y + 0,
        r: 0,
        scale: 0,

        onClick: () => this.cardDetails.showCardDetails(card),
      });

      card.getView().updateOpts({
        scale: 0,
        opacity: 0,
        visible: true,
      });

      animate(card.getView())
        .wait(animDuration * index * 0.25)
        .then(
          { scale: 0.3, y: y, opacity: 1 },
          animDuration * 0.5,
          animate.easeOut,
        );

      this.deckCards.push(card);
    });

    BattleCardDeck.deckData[this.props.target] = deckData;
    console.log('>>> deckCards', deckData, this.deckCards);
  }

  getRandomCardsOfType(type: CardType, max: number): CardID[] {
    return getRandomItemsFromArr(this.getAllCardsOfType(type), max);
  }

  getAllCardsOfType(type: CardType): CardID[] {
    return ruleset.cardIds.filter((id) => {
      const card = ruleset.cards[id];
      return card.type === type;
    });
  }
}
import animate from 'animate';
import sounds from 'src/lib/sounds';
import View from 'ui/View';
import Card from '../cards/Card';
import BattleCardDetails from './BattleCardDetails';
import {
  getScreenDimensions,
  getRandomItemsFromArr,
  shuffleArray,
} from 'src/lib/utils';
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
  private cards: CardID[];
  private deckCards: Card[];
  private cardDetails: BattleCardDetails;

  public static cards: {
    hero: CardID[];
    monster: CardID[];
  };

  constructor(props: Props) {
    BattleCardDeck.cards = { hero: [], monster: [] };

    this.props = props;
    this.createViews(props);
  }

  init() {
    this.cards = this.createDeckData();
    this.createDeckCards(this.cards);
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
      target: props.target,
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

  createDeckData(): CardID[] {
    const modifiers = this.getRandomCardsOfType('modifier', 4);
    const weapons = this.getRandomCardsOfType('weapon', 2);
    const shields = this.getRandomCardsOfType('shield', 2);
    const spells = this.getRandomCardsOfType('spell', 2);
    const potions = this.getRandomCardsOfType('potion', 2);

    return [...modifiers, ...weapons, ...shields, ...spells, ...potions];
  }

  createDeckCards(cards: CardID[]) {
    // const modifiers = this.getRandomCardsOfType('modifier', 4);
    // const weapons = this.getRandomCardsOfType('weapon', 2);
    // const shields = this.getRandomCardsOfType('shield', 2);
    // const spells = this.getRandomCardsOfType('spell', 2);
    // const potions = this.getRandomCardsOfType('potion', 2);

    // const cards = [...modifiers, ...weapons, ...shields, ...spells, ...potions];

    this.deckCards = [];

    const columns = 4;
    const dx = 77;
    const dy = 110;

    cards.forEach((id, index) => {
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

    BattleCardDeck.cards[this.props.target] = cards;
    console.log('>>> deckCards', cards, this.deckCards);
  }

  private getRandomCardsOfType(type: CardType, max: number): CardID[] {
    return getRandomItemsFromArr(this.getAllCardsOfType(type), max);
  }

  private getAllCardsOfType(type: CardType): CardID[] {
    return ruleset.cardIds.filter((id) => {
      const card = ruleset.cards[id];
      return card.type === type;
    });
  }

  public static reshuffle(target: Target) {
    shuffleArray(BattleCardDeck.cards[target]);
  }

  // public static extractCards(target: Target, max: number) {
  //   return BattleCardDeck.cards[target].splice(0, max);
  // }

  // public static insertCards(target: Target, arr: CardID[]) {
  //   arr.forEach((id) => {
  //     BattleCardDeck.cards[target].push(id);
  //   })
  // }

  public static extract(target: Target) {
    return BattleCardDeck.cards[target].splice(0, 1);
  }

  public static insert(target: Target, id: CardID) {
    BattleCardDeck.cards[target].push(id);
  }
}

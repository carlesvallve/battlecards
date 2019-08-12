import animate from 'animate';
import View from 'ui/View';
import {
  getScreenDimensions,
  waitForIt,
  getRandomFloat,
  getRandomInt,
} from 'src/lib/utils';
import { animDuration } from 'src/lib/uiConfig';
import CardNumber, { CardNum } from '../cards/CardNumber';
import { getTarget, throwDice } from 'src/redux/shortcuts/combat';
import StateObserver from 'src/redux/StateObserver';
import { blockUi } from 'src/redux/shortcuts/ui';
import sounds from 'src/lib/sounds';
import ruleset from 'src/redux/ruleset';
import { Target } from 'src/types/custom';

type Props = { superview: View; zIndex: number; target: Target };

export default class BattleCardNumbers {
  private props: Props;
  private container: View;
  private cards: CardNumber[];
  private usedCards: CardNumber[];

  constructor(props: Props) {
    this.props = props;
    this.createViews(props);
    this.createCards(props);
  }

  private createViews(props: Props) {
    const screen = getScreenDimensions();

    this.container = new View({
      superview: props.superview,
      // backgroundColor: 'rgba(255, 0, 0, 0.5)',
      width: screen.width,
      height: screen.height,
      x: 0,
      y: 0,
      infinite: true,
      canHandleEvents: false,
      zIndex: props.zIndex,
    });
  }

  generateNumbers() {
    // add numbers
    for (let i = 1; i <= 6; i++) {
      for (let j = 1; j <= 4; j++) {}
    }
  }

  createCards(props: Props) {
    this.usedCards = [];
    this.cards = [];

    for (let i = 1; i <= 6; i++) {
      for (let j = 1; j <= 4; j++) {
        const card = new CardNumber({
          superview: this.container,
          num: i as CardNum,
          onClick: () => this.spawnCard(),
        });
        this.cards.push(card);
      }
    }

    // shuffle the card deck
    this.shuffleCards();

    // display number of remaining cards in deck
    this.cards[this.cards.length - 1].updateLabel(this.cards.length.toString());
  }

  shuffleCards() {
    const screen = getScreenDimensions();

    const shuffled = this.cards.sort(() => 0.5 - Math.random());

    shuffled.forEach((card, index) => {
      const isHero = this.props.target === 'hero';

      const dx = getRandomInt(-2, 2);
      const dy = getRandomInt(-2, 2);

      const scale = isHero ? 0.15 : 0;
      const x = isHero ? 35 + dx : screen.width * 0.5 + dx;
      const y = isHero
        ? screen.height - 40 + dy
        : screen.height * ruleset.baselineY - 128 + 60 + dy;

      card.getView().updateOpts({
        zIndex: index * 0.1,
        x,
        y,
        scale,
        scaleY: 1,
        opacity: 1,
        visible: true,
      });
    });

    // display remaining cards
    this.cards[this.cards.length - 1].updateLabel(this.cards.length.toString());
  }

  spawnCard() {
    // get the card on top of the deck
    const card: CardNumber = this.cards[this.cards.length - 1];

    // block the combat ui
    blockUi(true);
    sounds.playSound('swoosh1', 0.2);

    this.updateCardLabels(card);

    const screen = getScreenDimensions();
    const target = getTarget(StateObserver.getState());
    const t = animDuration * 1;

    const xx = screen.width / 2;
    const yy = screen.height * ruleset.baselineY;
    const dx = 2;
    const dy = this.props.target === 'hero' ? -25 : 25;

    animate(card.getView())
      .clear()
      .wait(0)
      .then(
        {
          x: xx,
          y: yy - dy,
          scale: 0.3,
          scaleY: 0.75,
          r: 0,
        },
        t * 0.5,
        animate.easeInOut,
      )
      .then({ scale: 0.4, scaleY: 1 }, t * 0.5, animate.easeInOut)
      .then({ scale: 0.35, scaleY: 1 }, t * 0.5, animate.easeInOut)
      .then(() => {
        waitForIt(() => {
          throwDice(this.props.target, card.getNum()); // use the card with redux
        }, t * 0.5);
      })
      .then(() => sounds.playSound('swoosh3', 0.3))
      .then(
        {
          scale: 0,
          scaleY: 0.75,
          x: xx + dx,
          y: yy + dy - 15,
          r: getRandomFloat(-0.1, 0.1),
        },
        t * 1,
        animate.easeInOut,
      )

      .then(() => {
        sounds.playSound('click5', 0.5);
        this.usedCards.push(this.cards.pop());
        if (this.cards.length === 0) {
          this.cards = this.usedCards;
          this.usedCards = [];
          this.shuffleCards();
        }
      });
  }

  updateCardLabels(card?: CardNumber) {
    if (this.cards.length > 1) {
      this.cards[this.cards.length - 2].updateLabel(
        (this.cards.length - 1).toString(),
      );
    }

    card.updateLabel(card.getNum().toString());
  }
}

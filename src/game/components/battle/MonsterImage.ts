import animate from 'animate';
import View from 'ui/View';
import ImageView from 'ui/ImageView';
import { animDuration } from 'src/lib/uiConfig';
import playExplosion from './Explosion';
import sounds from 'src/lib/sounds';
import { waitForIt, getScreenDimensions } from 'src/lib/utils';
import ruleset from 'src/redux/ruleset';

type Props = { superview: View };

export default class MonsterImage {
  private props: Props;
  private container: View;
  private image: ImageView;
  private baseY: number;

  private alive: boolean = true;

  constructor(props: Props) {
    this.props = props;
    this.createViews(props);
  }

  getView() {
    return this.container;
  }

  isAlive() {
    return this.alive;
  }

  private createViews(props: Props) {
    const screen = getScreenDimensions();
    this.baseY = screen.height * ruleset.baselineY - 112;

    this.container = new View({
      superview: props.superview,
      x: screen.width / 2,
      y: this.baseY,
      width: 88,
      height: 88,
      centerOnOrigin: true,
    });

    this.image = new ImageView({
      superview: this.container,
      image: null,
      width: this.container.style.width,
      height: this.container.style.height,
      x: this.container.style.width * 0.5,
      y: this.container.style.height * 0.5,
      scale: 1,
      centerOnOrigin: true,
      centerAnchor: true,
    });
  }

  setImage(imageName: string) {
    console.log('>>> SET MONSTER IMAGE', imageName);
    this.alive = true;
    if (imageName) {
      this.image.updateOpts({
        image: `resources/images/monsters/${imageName}.png`,
      });
    }

    animate(this.image)
      .clear()
      .wait(animDuration * 0.5)
      .then({ scale: 1, opacity: 1 }, animDuration, animate.easeOut)
      .then(() => {});
  }

  playAttackAnimationStart() {
    // sounds.playSound('swoosh1', 0.15); // this makes sounds so crowded
    animate(this.container)
      .clear()
      .then(
        { scale: 1.25, y: this.baseY + 60 },
        animDuration,
        animate.easeInOut,
      );
  }

  playAttackAnimationEnd() {
    // sounds.playSound('swoosh4', 0.15); // // this plays after laying down a card number
    animate(this.container)
      .clear()
      .then({ scale: 1, y: this.baseY }, animDuration, animate.easeInOut);
  }

  playDeathAnimation() {
    this.alive = false;

    waitForIt(() => {
      // play death sounds
      sounds.playSound('break1', 0.2);
      sounds.playSound('break2', 0.1);
      if (Math.random() < 0.5) {
        sounds.playSound('punch1', 0.75);
      } else {
        sounds.playSound('punch2', 0.25);
      }

      waitForIt(() => sounds.playSound('ding1', 0.3), animDuration * 1.5);
    }, 100);

    // fadeout image
    animate(this.image)
      .clear()
      .then({ scale: 0.25, opacity: 0 }, animDuration, animate.easeInOut);

    // create blood particles
    playExplosion({
      superview: this.container,
      sc: 1,
      max: 20,
      startX: this.container.style.width / 2,
      startY: this.container.style.height / 2,
    });
  }
}

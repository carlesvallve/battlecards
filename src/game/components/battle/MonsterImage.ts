import animate from 'animate';
import View from 'ui/View';
import ImageView from 'ui/ImageView';
import { animDuration } from 'src/lib/uiConfig';
import playExplosion from './Explosion';
import sounds from 'src/lib/sounds';
import { waitForIt } from 'src/lib/utils';

type Props = {
  superview: View;
  x: number;
  y: number;
  width: number;
  height: number;
  image?: string;
};

export default class MonsterImage {
  private props: Props;
  private container: View;
  private image: ImageView;

  constructor(props: Props) {
    this.props = props;
    this.createViews(props);
  }

  getView() {
    return this.container;
  }

  playDeathAnimation() {
    //
    sounds.playSound('break1', 0.6);
    sounds.playSound('break2', 0.2);
    sounds.playRandomSound(['punch1', 'punch2'], 1);

    waitForIt(() => sounds.playSound('win1', 0.3), animDuration * 1.5);

    animate(this.image)
      .clear()
      .then({ scale: 0.25, opacity: 0 }, animDuration, animate.easeInOut);

    // create blood particles
    playExplosion({
      superview: this.container,
      sc: 1,
      // image: 'resources/images/ui/particles/blood-drop-1.png',
      max: 100,
      startX: this.container.style.width / 2,
      startY: this.container.style.height / 2,
    });
  }

  setImage(imageName: string) {
    this.image.updateOpts({
      image: `resources/images/monsters/${imageName}.png`,
    });

    animate(this.image)
      .clear()
      .wait(animDuration * 0.5)
      .then({ scale: 1, opacity: 1 }, animDuration, animate.easeOut)
      .then(() => {});
  }

  private createViews(props: Props) {
    this.container = new View({ ...props, centerOnOrigin: true });

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
}

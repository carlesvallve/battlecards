import View from 'ui/View';
import ImageScaleView from 'ui/ImageScaleView';
import ImageView from 'ui/ImageView';
import Image from 'ui/resource/Image';
import { getScreenDimensions, debugPoint } from 'src/lib/utils';

export default class Terrain extends View {
  constructor (opts) {
    super(opts);
    this.screen = getScreenDimensions();
    this.game = opts.parent.game;

    this.lava = new ImageScaleView({
      superview: this,
      x: 0,
      y: 5 + this.screen.height / 2,
      anchorX: 0,
      anchorY: 0,
      width: 3000,
      height: 20,
      scale: 1,
      image: 'resources/images/8bit-ninja/lava-1.png',
      scaleMethod: 'tile',
      columns: 300,
    });

    this.rock = new ImageScaleView({
      superview: this,
      x: 0,
      y: 10 + this.screen.height / 2,
      anchorX: 0,
      anchorY: 0,
      width: 3000,
      height: this.screen.height / 2,
      scale: 1,
      image: 'resources/images/8bit-ninja/terrain-center.png',
      scaleMethod: 'tile',
      columns: 360,
    });

    this.createTiles();

    debugPoint(this);
  }

  createTiles () {
    const tileImages = {
      left: new Image({ url: 'resources/images/8bit-ninja/terrain-top-left.png' }),
      right: new Image({ url: 'resources/images/8bit-ninja/terrain-top-right.png' }),
      center: new Image({ url: 'resources/images/8bit-ninja/terrain-center.png' }),
    };

    const size = 10;
    const tx = this.game.world.left - size;
    const max =  2 + ((this.game.world.walkableDistance * 2) / size);

    for (let i = 0; i < max; i++) {
      let img = tileImages.center;
      if (i === 0) { img = tileImages.left; }
      if (i === max - 1) { img = tileImages.right; }

      new ImageView({
        parent: this,
        width: size,
        height: size,
        x: tx + i * size,
        y: this.screen.height / 2,
        image: img,
      });
    }
  }
}

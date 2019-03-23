import View from 'ui/View';
import ImageView from 'ui/ImageView';
import Image from 'ui/resource/Image';
import { getScreenDimensions, debugPoint } from 'src/lib/utils';
import Tile from 'src/game/components/Tile';

export default class Terrain extends View {
  constructor (opts) {
    super(opts);
    this.screen = getScreenDimensions();
    this.game = opts.parent.game;

    this.createTiles();
    this.createPlatform();

    debugPoint(this);
  }

  createTiles () {
    const tileImages = {
      lava: new Image({ url: 'resources/images/8bit-ninja/lava-1.png' }),
      ground: 'resources/images/8bit-ninja/terrain-center.png'
    };

    const getTileType = (tx, x ,y, size) => {
      if (y === 0 && (
          tx + x * size < this.game.world.left - size ||
          tx + x * size >= this.game.world.right + size
      )) {
        return 'lava';
      }

      if (y > 0) { return 'ground'; }
      return null;
    };

    const size = 10;

    const tilesInScreen = Math.ceil(this.screen.width / size);
    const tilesInWalkableDistance = 2 + ((this.game.world.walkableDistance * 2) / size);

    const tx = (this.game.world.left - size) - (size * (tilesInScreen / 2));
    const maxX = tilesInScreen + tilesInWalkableDistance;
    const maxY = Math.ceil((this.screen.height / 2) / size);

    for (let y = 0; y < maxY; y++) {
      for (let x = 0; x < maxX; x++) {
        const type = getTileType(tx, x, y, size);
        if (type === null) { continue; }
        let img = tileImages[type];

        // get y by tile type
        let yy = y * (size) + this.screen.height / 2;
        if (type === 'lava') { yy += 4; }

        new ImageView({
          parent: this,
          width: size,
          height: size,
          x: tx + x * size,
          y: yy,
          image: img,
        });
      }
    }
  }

  createPlatform () {
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

      new Tile({
        parent: this,
        width: size,
        height: size,
        x: tx + i * size,
        y: this.screen.height / 2,
        image: img,
      });
    }
  }

  // // Find out if the given pixel is traversable.
  // // X and Y are the scene pixel coordinates
  // isPointTraversable (x, y) {
  //   const tileSize = 8;

  //   // Get the tile coordinates from the pixel coord.
  //   const tileX = Math.Floor(x / tileSize);
  //   const tileY = Math.Floor(y / tileSize);

  //   // If the point is out of bound, we assume it's traversable
  //   if (tileX < 0) return true;
  //   if (tileX >= horizontalTileCount) return true;
  //   if (tileY < 0) return true;
  //   if (tileY >= verticalTileCount) return true;

  //   const tile = getTile(tileX, tileY);

  //   // If the tile is blank the point is traversable
  //   if (tile == null) return true;

  //   // Get the coordinates of the point within the tile
  //   const localPointX = x % tileSize;
  //   const localPointY = y % tileSize;

  //   // Return "true" if the pixel is not solid
  //   return !tile.solidityMap[localPointX, localPointY];
  // }
}

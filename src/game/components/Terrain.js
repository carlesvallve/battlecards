import View from 'ui/View';
import ImageView from 'ui/ImageView';
import Image from 'ui/resource/Image';
import { getScreenDimensions, debugPoint } from 'src/lib/utils';
import Tile from 'src/game/components/Tile';

import { level } from 'src/lib/raycast';


export default class Terrain extends View {
  constructor (opts) {
    super(opts);
    this.screen = getScreenDimensions();
    this.game = opts.parent.game;

    this.createMap();

    // this.createTiles();
    // this.createPlatform();

    debugPoint(this);
  }

  createMap () {
    const tileImages = {
      topLeft: new Image({ url: 'resources/images/8bit-ninja/terrain-top-left.png' }),
      topRight: new Image({ url: 'resources/images/8bit-ninja/terrain-top-right.png' }),
      center: new Image({ url: 'resources/images/8bit-ninja/terrain-center.png' }),
      lava: new Image({ url: 'resources/images/8bit-ninja/lava-1.png' }),
    };

    const { mapData, tileSize } = level;
    console.log('mapData:', mapData);

    const mapWidth = mapData.length;
    const mapHeight = mapData[0].length;

    this.offset = {
      x: this.game.world.left - tileSize,
      y: this.screen.height / 2 - mapWidth * tileSize / 2
    };

    this.center = {
      x: this.offset.x + mapWidth * tileSize / 2,
      y: this.offset.y + mapWidth * tileSize / 2
    };

    const mapBox = new View({
      parent: this,
      backgroundColor: 'rgba(0.5,0.5,0.5,0.5)',
      width: mapWidth * tileSize,
      height: mapHeight * tileSize,
      x: this.offset.x,
      y: this.offset.y ,
    });

    const map = [];

    // const offset = { x: this.game.world.left - tileSize, y: this.screen.height / 2 };
    const tileOffset = { x: 0, y: 0 };

    for (let y = 0; y < mapHeight; y++) {
      map[y] = [];
      for (let x = 0; x < mapWidth; x++) {
        if (mapData[y][x] === 0) {
          map[y][x] = null;
        } else {
          map[y][x] = new Tile({
            parent: mapBox,
            width: tileSize,
            height: tileSize,
            x: tileOffset.x + x * tileSize,
            y: tileOffset.y + y * tileSize,
            image:tileImages.center,
          });
        }
      }
    }

    // for (let x = 0; x < mapWidth; x++) {
    //   map[x] = [];
    //   for (let y = 0; y < mapHeight; y++) {
    //     if (mapData[x][y] === 0) {
    //       map[x][y] = null;
    //     } else {
    //       map[x][y] = new Tile({
    //         parent: this,
    //         width: tileSize,
    //         height: tileSize,
    //         x: offset.x + x * tileSize,
    //         y:  offset.y + y * tileSize,
    //         image:tileImages.center,
    //       });
    //     }
    //   }
    // }

    console.log('map:', map);
    level.map = map;
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

}

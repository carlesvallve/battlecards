import View from 'ui/View';
import { getScreenDimensions, debugPoint } from 'src/lib/utils';
import Tile from 'src/game/components/Tile';

import level, { getTileData } from 'src/conf/levels/index';

export default class Terrain extends View {
  constructor(opts: { parent: View }) {
    super(opts);
    this.screen = getScreenDimensions();
    this.game = opts.parent.game;

    this.updateOpts({
      zIndex: 997,
    });

    this.createMap();
    debugPoint(this);
  }

  createMap() {
    const { mapData, tileSize } = level;
    const mapWidth = mapData[0].length;
    const mapHeight = mapData.length;

    this.offset = {
      x: 0,
      y: this.screen.height / 2 - (mapHeight * tileSize) / 2,
    };

    this.center = {
      x: this.offset.x + (mapWidth * tileSize) / 2,
      y: this.offset.y + (mapHeight * tileSize) / 2,
    };

    const mapBox = new View({
      parent: this,
      // backgroundColor: 'rgba(0.5,0.5,0.5,0.5)',
      width: mapWidth * tileSize,
      height: mapHeight * tileSize,
      x: this.offset.x,
      y: this.offset.y,
    });

    const map = [];
    for (let y = 0; y < mapHeight; y++) {
      map[y] = [];
      for (let x = 0; x < mapWidth; x++) {
        const tileData = getTileData(x, y);

        if (tileData) {
          map[y][x] = new Tile({
            parent: mapBox,
            width: tileSize,
            height: tileSize,
            x: tileData.offset.x + x * tileSize,
            y: tileData.offset.y + y * tileSize,
            image: tileData.image,
            data: tileData, // tile custom data
          });
        } else {
          map[y][x] = null;
        }
      }
    }

    level.map = map;
  }
}

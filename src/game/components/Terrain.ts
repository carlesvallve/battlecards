import View from 'ui/View';
import World from 'src/game/components/World';
import Tile from 'src/game/components/Tile';
import { getScreenDimensions, debugPoint } from 'src/lib/utils';
import level, { getTileData } from 'src/conf/levels/index';
import { point, screen } from 'src/lib/customTypes';

export default class Terrain extends View {
  screen: screen;
  center: point;

  constructor(opts: { parent: World }) {
    super(opts);
    this.screen = getScreenDimensions();

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

    this.center = {
      x: (mapWidth * tileSize) / 2,
      y: (mapHeight * tileSize) / 2,
    };

    const mapbox = new View({
      parent: this,
      // backgroundColor: 'rgba(0.5,0.5,0.5,0.5)',
      width: mapWidth * tileSize,
      height: mapHeight * tileSize,
    });

    const map = [];
    for (let y = 0; y < mapHeight; y++) {
      map[y] = [];
      for (let x = 0; x < mapWidth; x++) {
        const tileData = getTileData(x, y);

        if (tileData) {
          map[y][x] = new Tile({
            parent: mapbox,
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

import Image from 'ui/resource/Image';
import Tile from 'src/game/components/Tile';
import settings from 'src/conf/settings';
import level1 from 'src/conf/levels/01';
import level2 from 'src/conf/levels/02';
import { point } from 'src/lib/types';

const levels = [null, level1, level2];
const level = levels[settings.currentMapLevel];
console.log('Level', settings.currentMapLevel, level);

export const mapWidth = level.mapData[0].length;
export const mapHeight = level.mapData.length;
export const tileSize = level.tileSize;

export const getTile = (x: number, y: number): Tile => {
  return level.map[y][x] || null;
};

export const getTileType = (x: number, y: number): number => {
  return level.mapData[y][x] || null;
};

export const getTileData = (
  x: number,
  y: number,
): {
  type: number;
  image: Image;
  offset: point;
  walkable: boolean;
} => {
  const type = getTileType(x, y);

  switch (type) {
    case 0:
      return null;
    case 1:
      return {
        type,
        image: getTileImage(x, y),
        offset: { x: 0, y: 0 },
        walkable: true,
      };
    case 2:
      return {
        type,
        image: tileImages.lava,
        offset: { x: 0, y: tileSize * 0.4 },
        walkable: false,
      };
  }
};

// =====================================
// images

const tileImages = {
  topLeft: new Image({
    url: 'resources/images/8bit-ninja/terrain-top-left.png',
  }),
  topRight: new Image({
    url: 'resources/images/8bit-ninja/terrain-top-right.png',
  }),
  bottomLeft: new Image({
    url: 'resources/images/8bit-ninja/terrain-bottom-left.png',
  }),
  bottomRight: new Image({
    url: 'resources/images/8bit-ninja/terrain-bottom-right.png',
  }),
  center: new Image({
    url: 'resources/images/8bit-ninja/terrain-center.png',
  }),
  lava: new Image({ url: 'resources/images/8bit-ninja/lava-1.png' }),
};

export const getTileImage = (x: number, y: number): Image => {
  const neighbours = getNeighbours(x, y);

  if (!neighbours.includes('N') && !neighbours.includes('W')) {
    return tileImages.topLeft;
  }

  if (!neighbours.includes('N') && !neighbours.includes('E')) {
    return tileImages.topRight;
  }

  if (!neighbours.includes('S') && !neighbours.includes('W')) {
    return tileImages.bottomLeft;
  }

  if (!neighbours.includes('S') && !neighbours.includes('E')) {
    return tileImages.bottomRight;
  }

  return tileImages.center;
};

// =====================================
// neighbours

const NEIGHBOURS = {
  NW: { x: -1, y: -1 },
  W: { x: -1, y: 0 },
  SW: { x: -1, y: 1 },
  N: { x: 0, y: -1 },
  S: { x: 0, y: 1 },
  NE: { x: 1, y: -1 },
  E: { x: 1, y: 0 },
  SE: { x: 1, y: 1 },
};

export const getNeighbours = (x: number, y: number): string[] => {
  const neighbours = [];
  for (const [key, value] of Object.entries(NEIGHBOURS)) {
    const xx = x + value.x;
    const yy = y + value.y;
    if (xx < 0 || yy < 0 || xx >= mapWidth || yy >= mapHeight) {
      continue;
    }
    if (getTileType(x, y) === getTileType(xx, yy)) {
      neighbours.push(key);
    }
  }
  // console.log(neighbours);
  return neighbours;
};

export default level;

import level1 from './01';

const level = level1;
export const horizontalTileCount = level.mapData[0].length;
export const verticalTileCount = level.mapData.length;
export const tileSize = level.tileSize;

export const getTile = (x, y) => {
  return level.map[y][x] || null;
};

export default level;

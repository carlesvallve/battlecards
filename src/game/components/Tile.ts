import View from 'ui/View';
import ImageView from 'ui/ImageView';
import Image from 'ui/resource/Image';
import { debugPoint } from 'src/lib/utils';
import { tileData } from 'src/lib/customTypes';

export default class Tile extends ImageView {
  parent: View;
  solidityMap: number[];
  data: tileData;

  constructor(opts: {
    parent: View;
    width: number;
    height: number;
    x: number;
    y: number;
    image: Image;
    data: tileData;
  }) {
    super(opts);

    this.parent = opts.parent;
    this.data = opts.data;
    if (this.data.walkable) {
      this.solidityMap = this.buildSolidityMap(opts.width, opts.height);
    }

    debugPoint(this);
  }

  buildSolidityMap(width: number, height: number): number[] {
    const solidityMap = [];
    for (let y = 0; y < height; y++) {
      solidityMap[y] = [];
      for (let x = 0; x < width; x++) {
        solidityMap[y][x] = 1;
      }
    }

    return solidityMap;
  }

  buildSolidityMap2(imageData: ImageData): number[] {
    // console.log('>>>', imageData);

    const solidityMap = []; // new bool[bitmap.Width, bitmap.Height];

    for (let y = 0; y < imageData.height; y++) {
      solidityMap[y] = [];
      for (let x = 0; x < imageData.width; x++) {
        const index = (x + y * imageData.width) * 4;
        const r = imageData.data[index];
        const g = imageData.data[index + 1];
        const b = imageData.data[index + 2];
        const a = imageData.data[index + 3];
        // console.log(r, g, b, a);

        // if the pixel is not transparent set the solidity map value to "true"
        solidityMap[y][x] = 1; // image.getPixel(x, y).alpha != 0;
      }
    }

    return solidityMap;

    // We will need some additionnal processing here if the tile is
    // transformed in some way
    // (like scaled or horizontally or vertically flipped)
  }
}

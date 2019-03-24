import ImageView from 'ui/ImageView';
import { debugPoint } from 'src/lib/utils';

export default class Tile extends ImageView {
  constructor (opts) {
    super(opts);

    this.parent = opts.parent;
    this.solidityMap = this.buildSolidityMap(opts.width);

    debugPoint(this);
  }

  buildSolidityMap (size) {
    const solidityMap = [];
    for (let y = 0; y < size; y++) {
      solidityMap[y] = [];
      for (let x = 0; x < size; x++) {
        solidityMap[y][x] = 1;
      }
    }

    return solidityMap;
  }

  buildSolidityMap2 (imageData) {
    // console.log('>>>', imageData);

    const solidityMap = []; // new bool[bitmap.Width, bitmap.Height];

    for (let y = 0; y < imageData.height; y++) {
      solidityMap[y] = [];
      for (let x = 0; x < imageData.width; x++) {
        var index = (x + y * imageData.width) * 4;
        var r = imageData.data[index];
        var g = imageData.data[index + 1];
        var b = imageData.data[index + 2];
        var a = imageData.data[index + 3];
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

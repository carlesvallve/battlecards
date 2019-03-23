import ImageView from 'ui/ImageView';
import Image from 'ui/resource/Image';

export default class Tile extends ImageView {
  constructor (opts) {
    super(opts);

    this.parent = opts.parent;
    this.width = opts.size;
    this.height = opts.size;
    this.x = opts.x;
    this.y = opts.y;
    this.setImage(opts.image);

    console.log('>>>', opts.image.height, opts.image.getHeight()); //this.getImage(), this.image, this.style.image, this._img);

    this.buildSolidityMap(opts.image);

  }

  buildSolidityMap (image) {
    const solidityMap = []; //new bool[bitmap.Width, bitmap.Height];

    // const img = this.image;

    for (let x = 0; x < image.getWidth(); x++) {
      solidityMap[x] = [];
      for (let y = 0; y < image.getHeight(); y++) {
        // if the pixel is not transparent set
        // the solidity map value to "true"
        solidityMap[x][y] = 1; // image.getPixel(x, y).alpha != 0;
      }
    }

    console.log(solidityMap);

    // We will need some additionnal processing here if the tile is
    // transformed in some way
    // (like horizontally or vertically flipped)
    // I don't put the code here to keep it simple
    // but if needed you can find it in Tile.cs
  }
}

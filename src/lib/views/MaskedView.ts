import View from 'ui/View';
import Image from 'ui/resource/Image';
import ImageViewCache from 'ui/resource/ImageViewCache';
import Matrix2D from 'platforms/browser/webgl/Matrix2D';
import Canvas from 'platforms/browser/Canvas';

/*
usage:

this.maskedView = new MaskedView({
      superview: emblem,
      x: this.frame.style.width / 2,
      y: this.frame.style.height / 2 - 1,
      width: 116,
      height: 116,
      centerOnOrigin: true,
      centerAnchor: true,
      mask: 'resources/images/ui/cards/sets/_emblems/mask.png',
      sourceView: new ImageView({
        backgroundColor: '#111',
        image: `resources/images/ui/cards/sets/${data.image}`,
        autoSize: true,
        scale: 0.5,
      }),
    });
*/

const IDENTITY_MATRIX = new Matrix2D();

const scratchCanvas = new Canvas({ useWebGL: false });
const scratchContext = scratchCanvas.getContext('2D');

export default class MaskedView extends View {
  sourceView: View;
  canvas: Canvas;
  context: CanvasRenderingContext2D;
  hasRenderedView: boolean;

  constructor(opts: any) {
    super(opts);

    this.sourceView = opts.sourceView;
    this.canvas = new Canvas({ useWebGL: false });
    this.context = this.canvas.getContext('2D');
    this.hasRenderedView = false;

    this.renderView(opts.sourceView, opts.mask);
  }

  updateImage(url: string) {
    this.sourceView.updateOpts({ image: new Image({ url }) });
    this.sourceView.updateOpts({ centerOnOrigin: true, centerAnchor: true });
  }

  private renderView(view: View, mask: string | Image) {
    if (typeof mask === 'string') {
      mask = ImageViewCache.getImage(mask);
    }

    // center sourceView inside
    // (not sure why this /8 offset is necessary)
    view.updateOpts({
      x: this.style.x - view.style.width / 10,
      y: this.style.y - view.style.height / 10,
      centerOnOrigin: true,
      centerAnchor: true,
    });

    const width = this.style.width * this.style.scale;
    const height = this.style.height * this.style.scale;

    scratchCanvas.width = width;
    scratchCanvas.height = height;
    scratchContext.clear();

    this.canvas.width = width;
    this.canvas.height = height;

    this.context.clearRect(0, 0, width, height);

    if (mask) {
      this.context.globalCompositeOperation = 'copy';
      mask.renderShort(this.context, 0, 0, width, height);
      this.context.globalCompositeOperation = 'source-in';
    } else {
      this.context.globalCompositeOperation = 'source-over';
    }

    view.style.wrapRender(scratchContext, IDENTITY_MATRIX, 1);

    const w = view.style.width * view.style.scale;
    const h = view.style.height * view.style.scale;
    this.context.drawImage(scratchCanvas, 0, 0, w, h);

    this.canvas.__needsUpload = true;
    this.hasRenderedView = true;
  }

  private render(context) {
    if (!this.hasRenderedView) return;

    const width = this.canvas.width;
    const height = this.canvas.height;
    context.drawImage(this.canvas, 0, 0, width, height, 0, 0, width, height);
  }
}

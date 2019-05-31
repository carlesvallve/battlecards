import Canvas from 'platforms/browser/Canvas';
import TextView from 'ui/TextView';

class SingleTextBuffer {
  _canvas: Canvas;
  _ctx: any;
  _width: number;
  _height: number;

  constructor() {
    this._ctx = null;
    this._canvas = null;
    this._width = 0;
    this._height = 0;
  }

  build(width, height) {
    if (this._width >= width && this._height >= height) return this;

    this._canvas = new Canvas({
      width: width,
      height: height,
    });

    this._ctx = this._canvas.getContext('2d');
    this._ctx.clearRect(0, 0, width, height);
    this._ctx.textAlign = 'left';
    this._ctx.textBaseline = 'middle';
    this._ctx.globalCompositeOperation = 'source-over';

    this._width = width;
    this._height = height;

    return this;
  }
}

export default class FixedTextView extends TextView {
  textBuffer: SingleTextBuffer;

  constructor(opts) {
    opts.buffer = true;
    super(opts);
    this.textBuffer = new SingleTextBuffer();
  }

  _updateCtx(ctx) {
    super._updateCtx(ctx);
    ctx.lineJoin = 'round';
  }

  _renderBuffer(ctx) {
    var offsetRect = this._textFlow.getOffsetRect();
    var width = offsetRect.width;
    var height = offsetRect.height;

    if (!width || !height) return;

    var fontBuffer = this.textBuffer.build(width, height);
    var fontBufferCtx = fontBuffer._ctx;
    var words = this._textFlow.getWords();

    this._opts.lineCount = words[words.length - 1].line;
    offsetRect.text = this._opts.text;
    offsetRect.textView = this;

    if (this._cacheUpdate) {
      fontBufferCtx.clearRect(0, 0, width, height);
      this._renderToCtx(fontBufferCtx, -offsetRect.x, -offsetRect.y);
      fontBuffer._canvas.__needsUpload = true;
    }

    ctx.drawImage(
      fontBuffer._canvas,
      0,
      0,
      width,
      height,
      offsetRect.x,
      offsetRect.y,
      width,
      height,
    );
  }
}

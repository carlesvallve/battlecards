declare module 'startApplication';
declare module 'device';
declare module 'animate';

declare module 'AudioManager';

declare module 'ui/ImageView' {
  import View from 'ui/View';

  export default class ImageView extends View {
    constructor(opts: { [key: string]: any });
    [key: string]: any;
  }
}

declare module 'ui/bitmapFont/BitmapFontTextView' {
  import View from 'ui/View';

  export default class BitmapFontTextView extends View {
    constructor(opts: { [key: string]: any });
    [key: string]: any;
  }
}

declare module 'ui/TextView' {
  import View from 'ui/View';

  export default class TextView extends View {
    constructor(opts: { [key: string]: any });
    [key: string]: any;
  }
}

declare module 'ui/ImageScaleView' {
  import View from 'ui/View';

  export default class ImageScaleView extends View {
    constructor(opts: { [key: string]: any });
    [key: string]: any;
  }
}

declare module 'ui/widget/ButtonView' {
  import View from 'ui/View';

  export default class ButtonView extends View {
    constructor(opts: { [key: string]: any });
    [key: string]: any;
  }
}

declare module 'bundle-loader?lazy&name=[name]!./en';
declare module 'bundle-loader?lazy&name=[name]!./es';

declare module 'xml-loader!resources/fonts/Title.fnt';
declare module 'xml-loader!resources/fonts/TitleStroke.fnt';
declare module 'xml-loader!resources/fonts/Body.fnt';
declare module 'xml-loader!resources/fonts/BodyB.fnt';

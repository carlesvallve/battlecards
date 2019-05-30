declare module 'analytics';
declare module 'startApplication';
declare module 'device';
declare module 'platform';
declare module 'animate';

declare module 'AudioManager';

declare module 'ui/ImageView' {
  export default class ImageView {
    constructor(opts: { [key: string]: any });
    [key: string]: any;
  }
}

declare module 'ui/TextView' {
  export default class TextView {
    constructor(opts: { [key: string]: any });
    [key: string]: any;
  }
}

declare module 'ui/View' {
  export default class View {
    constructor(opts: { [key: string]: any });
    [key: string]: any;
  }
}

declare module 'ui/ImageScaleView' {
  export default class ImageScaleView {
    constructor(opts: { [key: string]: any });
    [key: string]: any;
  }
}

declare module 'ui/widget/ButtonView' {
  export default class ButtonView {
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

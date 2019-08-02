import View from 'ui/View';
import ButtonScaleView from './ButtonScaleView';
import LangBitmapFontTextView from './LangBitmapFontTextView';
import bitmapFonts from 'src/lib/bitmapFonts';
import Image from 'ui/resource/Image';
import uiConfig from 'src/lib/ui/uiConfig';
import ImageScaleView from 'ui/ImageScaleView';

type Opts<TData> = {
  superview: View;
  x: number;
  y: number;
  width: number;
  height: number;
  data: TData[]; // data: { index: number; key: string; localeText: () => string }[]

  baseUiConfig?: typeof uiConfig[keyof typeof uiConfig];

  onOpen?: () => void;
  selectedIndex?: number;
};

export default class DropdownView<TData> extends View {
  superview: View;
  data: TData[];
  itemHeight: number;
  isOpen: boolean;
  selectedIndex: number;
  selectedData: TData;
  baseUiConfig: typeof uiConfig[keyof typeof uiConfig];
  menu: ButtonScaleView;
  arrow: ImageScaleView;
  items: LangBitmapFontTextView[];

  onOpen: () => void;
  onClose: () => void;
  onSelect: (item: TData) => void;

  constructor(opts: Opts<TData>) {
    super(opts);

    this.superview = opts.superview;
    this.data = opts.data;
    this.itemHeight = opts.height;
    this.onOpen = opts.onOpen;

    this.isOpen = false;
    this.selectedIndex = opts.selectedIndex || 0;
    this.selectedData = this.data[0];

    this.updateOpts({
      height: opts.height,
    });

    this.baseUiConfig = opts.baseUiConfig || uiConfig.buttonGreen;

    this.menu = new ButtonScaleView(
      Object.assign({}, this.baseUiConfig, {
        superview: this,
        width: this.style.width,
        height: this.style.height,
        onClick: (pt: { x: number; y: number }) => {
          if (this.isOpen) {
            const i = Math.floor(pt.y / this.itemHeight);
            this.select(i);
          } else {
            this.open();
          }
        },
      }),
    );

    this.arrow = new ImageScaleView({
      superview: this.menu,
      image: new Image({
        url: 'resources/images/ui/buttons/popup-settings_arrow_dropdown.png',
      }),
      width: 30 * 0.7,
      height: 15 * 0.7,
      x: this.style.width - 45,
      y: (this.itemHeight - 15 * 0.7) * 0.5,
    });

    this.items = [];
    this.data.map((dataItem, index) => {
      this.items.push(this.createItem(index, dataItem));
    });
  }

  createItem(index: number, dataItem: any) {
    const text = new LangBitmapFontTextView({
      superview: this.menu,
      x: 20,
      y: index * this.itemHeight,
      height: this.itemHeight,
      align: 'left',
      verticalAlign: 'center',
      size: 20,
      color: 'white',
      wordWrap: false,
      font: bitmapFonts('Title'),
      localeText: dataItem.localeText,
      visible: index === 0,
    });

    text.updateOpts({
      y: index * this.itemHeight,
      visible: index === 0,
    });

    return text;
  }

  open() {
    this.isOpen = true;
    this.superview.updateOpts({
      zIndex: 999,
      height: this.data.length * this.itemHeight + this.style.y * 2,
    });
    this.updateOpts({ height: this.data.length * this.itemHeight });
    this.menu.updateOpts({ height: this.data.length * this.itemHeight });
    this.items.map((item) => {
      item.updateOpts({ visible: true });
    });

    this.onOpen && this.onOpen();
  }

  close() {
    this.isOpen = false;
    this.superview.updateOpts({
      zIndex: 0,
      height: this.itemHeight + this.style.y * 2,
    });
    this.updateOpts({ height: this.itemHeight });
    this.menu.updateOpts({ height: this.itemHeight });

    this.items.map((item, index) => {
      item.updateOpts({
        y: index * this.itemHeight,
        visible: index === 0,
      });
    });

    this.onClose && this.onClose();
  }

  select(index: number, executeCallback: boolean = true) {
    const item = this.data[index];

    this.selectedIndex = index;
    this.selectedData = item;

    this.swap(this.data, 0, index);
    this.swap(this.items, 0, index);

    this.close();

    // compensate for button's pressedOffsetY if any
    if (executeCallback) {
      const dy = this.baseUiConfig.pressedOffsetY || 0;
      this.items.map((item, index) => {
        item.updateOpts({
          y: index * this.itemHeight + dy,
        });
      });
    }

    executeCallback && this.onSelect && this.onSelect(item);
  }

  swap(arr, a, b) {
    const temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
    return arr;
  }
}

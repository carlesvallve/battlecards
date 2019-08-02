import BitmapFontTextView from 'ui/bitmapFont/BitmapFontTextView';
import StateObserver from 'src/redux/StateObserver';

const selector = StateObserver.createSelector(({ ui }) => ui.locale);

export default class LangBitmapFontTextView extends BitmapFontTextView {
  getText: () => string;
  text: string;

  constructor(opts) {
    super(opts);
    this.localeText = opts.localeText || null;

    selector.addListener(() => {
      this.localeText = this.getText;
    });
  }

  set localeText(value: () => string) {
    this.getText = value;
    this.text = value && value();
  }
}

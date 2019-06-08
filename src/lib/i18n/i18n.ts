import { getI18nBundle, loadI18nBundle } from 'src/lib/i18n/index';

let scKeyName = 'softCurrencyName'; // name of key in Google sheet
/// #if PLATFORM === 'line'
scKeyName = 'softCurrencyName-Line';
/// #endif

class I18n {
  _locale = 'und';
  _scString = 'Coins';

  getString(key, substitutions?) {
    key = key + '';

    const splitKeys = key.split('.');
    let data = this.getBundle().strings.default;
    const lastKeyIndex = splitKeys.length - 1;

    for (let i = 0; i < lastKeyIndex; i++) {
      data = data[splitKeys[i]];

      if (data === undefined) {
        return key;
      }
    }

    const result = data[splitKeys[lastKeyIndex]];

    if (result === undefined) {
      return key;
    }

    if (!substitutions) {
      return result;
    }

    return this._substitute(result, substitutions);
  }

  loadLocale(locale) {
    this._locale = locale;
    return loadI18nBundle(locale).then(() => {
      this._scString = this.getString(scKeyName);
    });
  }

  getBundle() {
    return getI18nBundle(this._locale);
  }

  get scName() {
    return this._scString;
  }

  _substitute(string, substitutions) {
    for (let token in substitutions) {
      let value = substitutions[token];

      string = string.replace('{' + token + '}', value);
    }

    return string;
  }
}

const instance = new I18n();

export { instance as i18n };

export default function(key, substitutions?) {
  return instance.getString(key, substitutions);
}

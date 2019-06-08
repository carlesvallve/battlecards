import ImageViewCache from 'ui/resource/ImageViewCache';
import BitmapFont from 'ui/bitmapFont/BitmapFont';
import { i18n } from 'src/lib/i18n/i18n';
// import designConfig from 'src/conf/designConfig';
// import uiConfig from 'src/conf/uiConfig';

const fontGlobalOptions = {
  remaps: [
    // { char: '©', url: uiConfig.miscIcons.scFontRemapIcon, offsetX: 4, offsetY: -8 },
    // { char: 'ƒ', url: 'resources/images/fonts/remaps/fish.png', scaleY: 1.2, offsetX: 2 },
    // { char: '¥', url: 'resources/images/fonts/remaps/stamina.png', scaleX: 1.3, scaleY: 1.3, offsetX: 20 },
    // { char: '\uF500', url: 'resources/images/fonts/remaps/icon_friends.png' },
    // { char: '\uF501', url: 'resources/images/fonts/remaps/up_arrow.png' }
  ],
};

const perFontOptions = {
  Title: { offsetX: 0, offsetY: -8 },
  TitleStroke: { offsetX: 0, offsetY: -8 },
  Body: { offsetX: 0, offsetY: -16 },
};

var fontCache;

function initializeFontCache() {
  fontCache = {};
  var bundle = i18n.getBundle();
  console.log('fontInfo:', bundle.fontInfo);
  for (var key in bundle.fontInfo) {
    var info = bundle.fontInfo[key];
    const physicalName = info.physicalName;

    fontCache[key] = new BitmapFont(
      ImageViewCache.getImage(info.imagePath),
      info.fnt,
      Object.assign({}, fontGlobalOptions, perFontOptions[physicalName]),
    );
  }
}

export default function bitmapFonts(name) {
  if (!fontCache) {
    initializeFontCache();
  }
  return fontCache[name];
}

// var textColors = designConfig.game.textColors;
// for (var textColor in textColors) {
//   bitmapFonts[textColor] = textColors[textColor];
// }

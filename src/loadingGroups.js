import AssetGroup from 'ui/resource/AssetGroup';

var exports = {};

// initial assets
// var fontURLs = AssetGroup.constructURLs('resources/fonts/');
var imageURLs = AssetGroup.constructURLs('resources/images/');

exports.initialAssets = new AssetGroup(imageURLs, null, AssetGroup.PRIORITY_HIGH);

// exports.initialAssets = new AssetGroup(
//   fontURLs.concat(imageURLs), null, AssetGroup.PRIORITY_HIGH
// );

// sound assets
var soundURLs = AssetGroup.constructURLs('resources/sounds/');
exports.soundAssets = new AssetGroup(
  soundURLs, null, AssetGroup.PRIORITY_LOW
);

export default exports;

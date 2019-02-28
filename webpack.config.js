const path = require('path');
// Stub to call full webpack scripts in frontend/ subrepo.

// First, load the real file, and gracefully report an error with a likely fix if we can't.
var webpackConfig = require('@blackstormlabs/timestep-build/arson/webpack.config.js');

// This is what webpack actually calls.
module.exports = function (env) {
  env.IS_DEVELOPMENT = env.buildType === 'development';

  // First run the real config script.
  var config = webpackConfig(env);

  // clientSchema entry point is required for gcf-deploy
  config.entry['clientSchema'] = path.resolve(process.cwd(), 'src', 'stormcloud', 'clientSchema');

  // If you need to alter the config you can do so here.

  // Pass config back to webpack.
  return config;
};

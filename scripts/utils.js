const https = require('https');
const url = require('url');
const childProcess = require('child_process');

const packageJSON = require('../package.json');

function getFacebookAppID(env) {
  let appId;
  try {
    appId = packageJSON.manifest.appID[env];
    if (!appId) {
      throw new Error('AppID not set');
    }
  } catch (e) {
    throw new Error(
      'Could not determine AppID from manifest. Please check package.json and set manifest.appID.' +
        env,
    );
  }

  return appId;
}

async function postJSON(uri, data) {
  return postData(
    uri,
    { 'Content-Type': 'application/json' },
    JSON.stringify(data),
  );
}

async function postData(uri, headers, data) {
  return new Promise((resolve, reject) => {
    const parsedUrl = url.parse(uri);

    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.path,
      method: 'POST',
      headers,
    };

    const req = https.request(options, (res) => {
      console.log(`statusCode: ${res.statusCode}`);
      let receivedData = '';
      res.on('data', (d) => {
        receivedData += d;
      });

      res.on('end', () => resolve(receivedData));
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

function exec(command) {
  return childProcess
    .execSync(command)
    .toString()
    .trim();
}

module.exports = {
  exec,
  postJSON,
  getFacebookAppID,
};

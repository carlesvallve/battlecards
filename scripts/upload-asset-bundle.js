// Uploads the FB bundle to Facebook.

// Usage: node upload-asset-bundle <staging | production>

const fs = require('fs');
const path = require('path');
const request = require('request');

const packageJSON = require('../package.json');

const { getFacebookAppID } = require('./utils');

const env = process.argv[2];

if (!env || (env !== 'staging' && env !== 'production')) {
  console.log('Usage: upload-asset-bundle <staging | production>\n');

  console.error('Error: unknown environment: ' + env);
  process.exit(1);
}

(async () => {
  try {
    const appId = getFacebookAppID(env);
    const assetUploadAccessToken = getUploadAccessToken(env);

    const envSuffix = env === 'staging' ? '-staging' : '-prod';
    const buildType = 'browser-mobile' + envSuffix;
    const gameDir = path.join(__dirname, '..');
    const buildDir = path.join(gameDir, 'build/release/', buildType);

    const packageVersion = packageJSON.version;
    const packageName = packageJSON.name;

    const zipName = `${packageName}${envSuffix}-${packageVersion}.zip`;
    const zipFullPath = path.join(buildDir, '..', zipName);

    const buildNum = process.env.CIRCLE_BUILD_NUM;

    if (!fs.existsSync(zipFullPath)) {
      throw new Error('Could not find ' + zipFullPath + '. Aborting.');
    }

    console.log('Uploading bundle ' + zipName + ' to FB...');

    await uploadAssetBundle({
      appId,
      assetUploadAccessToken,
      zipFullPath,
      zipName,
      buildNum,
    });

    console.log('Bundle has been uploaded!');
  } catch (e) {
    console.error('There was an error while uploading the bundle', e);
  }
})();

function getUploadAccessToken(env) {
  // Get asset upload access token
  const assetUploadAccessToken =
    env === 'staging'
      ? process.env.STAGING_UPLOAD_TOKEN
      : process.env.PROD_UPLOAD_TOKEN;

  if (!assetUploadAccessToken) {
    throw new Error(
      'Asset upload token not provided. Set the ' +
        (env === 'staging' ? 'STAGING_UPLOAD_TOKEN' : 'PROD_UPLOAD_TOKEN') +
        ' envvar to the correct upload token.',
    );
  }

  return assetUploadAccessToken;
}

async function uploadAssetBundle(opts) {
  const {
    appId,
    assetUploadAccessToken,
    zipFullPath,
    zipName,
    buildNum,
  } = opts;

  return new Promise((resolve, reject) => {
    request.post(
      {
        url: `https://graph-video.facebook.com/${appId}/assets`,
        formData: {
          access_token: assetUploadAccessToken,
          type: 'BUNDLE',
          asset: {
            value: fs.createReadStream(zipFullPath),
            options: {
              filename: zipName,
              contentType: 'application/octet-stream',
            },
          },
          comment: 'Build num ' + buildNum,
        },
      },
      (error, response, body) => {
        if (error) {
          reject(error);
        } else {
          const status = response.statusCode;

          if (status >= 200 && status < 300) {
            resolve();
          } else {
            reject('Error uploading to Facebook (' + status + '): ' + body);
          }
        }
      },
    );
  });
}

/* eslint-disable no-use-before-define */
import Promise from 'bluebird';

import loadEn from 'bundle-loader?lazy&name=[name]!./en';
import loadEs from 'bundle-loader?lazy&name=[name]!./es';
// import loadJa from 'bundle-loader?lazy&name=[name]!./ja';
// import loadPt from 'bundle-loader?lazy&name=[name]!./pt';
// import loadVi from 'bundle-loader?lazy&name=[name]!./vi';
// import loadIn from 'bundle-loader?lazy&name=[name]!./in';
// import loadTh from 'bundle-loader?lazy&name=[name]!./th';

const DEFAULT_LOCALE = 'en';

const loadFunctions = {
  en: loadEn,
  es: loadEs,
  // ja: loadJa,
  // pt: loadPt,
  // vi: loadVi,
  // in: loadIn,
  // th: loadTh
};

const loadedBundles = {};

/**
 * Async load a given locale i18n bundle
 * @param {string} [locale]
 */
export const loadI18nBundle = function(locale) {
  return new Promise((resolve) => {
    const bundle = getI18nBundle(locale);
    if (bundle) {
      resolve(bundle);
      return;
    }

    var loadFn = loadFunctions[locale] || loadFunctions[DEFAULT_LOCALE];

    loadFn((i18nBundle) => {
      loadedBundles[locale] = i18nBundle;
      resolve(i18nBundle);
    });
  });
};

/**
 * Synchronously get a loaded locale
 * @param {string} locale
 */
export const getI18nBundle = function(locale) {
  return loadedBundles[locale];
};

/**
 * Get the list of locales (language codes) that can be loaded.
 *
 * @returns {string[]} - loadable locales (e.g. ['en', 'pt'])
 */
export const getExistingLocales = function() {
  return Object.keys(loadFunctions);
};

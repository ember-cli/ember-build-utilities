
import browsersList from 'browserslist';

const browserNameMap = {
  android: 'android',
  chrome: 'chrome',
  edge: 'edge',
  firefox: 'firefox',
  ie: 'ie',
  'ios_saf': 'ios',
  safari: 'safari'
};

export function featuresForTargets(targets, features) {
  let versions = browsersList(targets.browsers).map((browser) => {
    let [name, version] = browser.split(' ');
    let normalizedName = browserNameMap[name];
    return `${normalizedName} ${version}`;
  });
  let flags = {};
  Object.keys(features).forEach(feature => {
    features[feature].forEach(browser => {
      flags[feature] = versions.indexOf(browser) > -1;
    });
  });

  return flags;
}

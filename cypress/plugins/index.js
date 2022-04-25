/// <reference types="cypress" />
const deepmerge = require('deepmerge');
const path = require('path');

function loadConfig(filename) {
  // console.debug('loadConfig:', filename);
  const configJson = require(filename);
  if (configJson.extends) {
    const baseConfigFilename = path.join(path.dirname(filename), configJson.extends);
    // console.debug('extends:', baseConfigFilename);
    const baseConfig = loadConfig(baseConfigFilename);
    // console.debug('merging %s with %s', baseConfigFilename, filename);
    const merged = deepmerge(baseConfig, configJson);
    delete merged['extends'];
    console.debug('merged:', merged);
    return merged;
  } else {
    return configJson;
  }
}

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  // console.debug('config:', config);
  console.debug('on:', on);

  return loadConfig(config.configFile);
}

/*const {beforeRunHook, afterRunHook} = require('cypress-mochawesome-reporter/lib');

module.exports = (on) => {
  on('before:run', async (details) => {
    console.log('override before:run');
    await beforeRunHook(details);
  });

  on('after:run', async () => {
    console.log('override after:run');
    await afterRunHook();
  });
};*/

const deepmerge = require('deepmerge');
const path = require('path');
const fs = require('fs');
const {beforeRunHook, afterRunHook} = require('cypress-mochawesome-reporter/lib');

function loadConfig(filename) {
  const configJson = require(filename);
  if (configJson.extends) {
    const baseConfigFilename = path.join(path.dirname(filename), configJson.extends);
    const baseConfig = loadConfig(baseConfigFilename);
    const merged = deepmerge(baseConfig, configJson);
    delete merged['extends'];
    console.debug('config:', merged);
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
  // console.debug('on:', on);
  // console.debug('config:', !!config);

  on('before:run', async (details) => {
    await beforeRunHook(details);
  });

  on('after:run', async () => {
    const jsonDir = './cypress/report/.jsons';
    if (fs.existsSync(jsonDir)) {
      await afterRunHook();
    }
  });

  return loadConfig(config.configFile);
}

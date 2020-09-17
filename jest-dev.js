// global-setup.js
const { setup: setupDevServer } = require('jest-dev-server')
 
module.exports = async function globalSetup() {
  await setupDevServer({
    command: `nodemon index.js`,
    launchTimeout: 50000,
    port: 3000,
  })
  // Your global setup
}

module.exports =jest-dev
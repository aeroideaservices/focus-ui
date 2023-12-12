const { removePlugins, pluginByName } = require("@craco/craco");
const Dotenv = require('dotenv-webpack');
const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    plugins: {
      add: [
        new Dotenv(),
      ]
    },
    configure: (webpackConfig, { env, paths }) => {
        removePlugins(webpackConfig, pluginByName("DefinePlugin"));
        return webpackConfig;
      }
  }
}

const createBundler = require("@airtable/blocks-webpack-bundler").default
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")

function createConfig(baseConfig) {
  // Adds ability to add path aliases
  baseConfig.module.rules.push({
    resolve: {
      plugins: [
        new TsconfigPathsPlugin({
          configFile: "./frontend/tsconfig.json"
        })
      ]
    }
  })

  return baseConfig
}

exports.default = () => {
  return createBundler(createConfig)
}

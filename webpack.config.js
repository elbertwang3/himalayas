// NOTE: To use this example standalone (e.g. outside of deck.gl repo)
// delete the local development overrides at the bottom of this file

// avoid destructuring for older Node version support
const resolve = require('path').resolve;
const webpack = require('webpack');

const CONFIG = {
  entry: {
    app: resolve('./app.js')
  },
  

  devtool: 'source-map',

  module: {
    rules: [
    {
      // Compile ES2015 using buble
      test: /\.js$/, 
      loader: 'buble-loader',
      include: [resolve('.')],
      exclude: [/node_modules/],
      options: {
        objectAssign: 'Object.assign'
      }
    },
    {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
    }]
  },

  resolve: {
    alias: {
      // From mapbox-gl-js README. Required for non-browserify bundlers (e.g. webpack):
      'mapbox-gl$': resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
    }
  },
  output: {
   


      // Tweak this to match your GitHub project name
      publicPath: "/himalayas/"

    },


  // Optional: Enables reading mapbox token from environment variable
  plugins: [
    new webpack.EnvironmentPlugin({MapboxAccessToken:'pk.eyJ1IjoiZWxiZXJ0d2FuZyIsImEiOiJjajk3dmw4amUwYmV2MnFydzl3NDIyaGFpIn0.46xwSuceSuv2Fkeqyiy0JQ'})
  ]
};

// This line enables bundling against src in this repo rather than installed deck.gl module
//module.exports = env => env ? require('../webpack.config.local')(CONFIG)(env) : CONFIG;
module.exports = CONFIG;

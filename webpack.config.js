const path = require('path');
const nodeExternals = require('webpack-node-externals')

module.exports = {
  target:'node',
  entry: path.join(__dirname, 'src', 'index.ts'),
  externals: [nodeExternals()],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  module: {
    rules: [{
      test: /\.ts/,
      loader: 'babel-loader'
    }]
  }
}
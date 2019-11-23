const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'app.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [{
      test: /\.(js)x?/,
      loader:'babel-loader'
    }]
  }
};

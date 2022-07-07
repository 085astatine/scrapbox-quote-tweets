const path = require('path');

module.exports = (env, argv) => {
  const mode = argv?.mode || 'development';
  return {
    mode: mode,
    devtool: mode === 'production' ? false : 'cheap-source-map',
    entry: {
      index: path.join(__dirname, 'src', 'index.js'),
    },
    output: {
      path: path.join(__dirname, 'build'),
      filename: '[name].js',
      clean: true,
    },
    module: {
    },
    resolve: {
      extensions: ['.js'],
    },
    plugins: [
    ],
  };
};

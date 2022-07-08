const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = (env, argv) => {
  const mode = argv?.mode || 'development';
  return {
    mode: mode,
    devtool: mode === 'production' ? false : 'cheap-source-map',
    entry: {
      index: path.join(__dirname, 'src', 'index.ts'),
    },
    output: {
      path: path.join(__dirname, 'build'),
      filename: '[name].js',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts'],
    },
    plugins: [
      new ESLintPlugin({
        extensions: ['ts'],
        exclude: ['node_modules'],
      }),
    ],
  };
};

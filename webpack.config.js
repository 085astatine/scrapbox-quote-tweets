const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const WextManifestPlugin = require('wext-manifest-webpack-plugin');

module.exports = (env, argv) => {
  const mode = argv?.mode || 'development';
  const browser = process.env.TARGET_BROWSER;
  return {
    mode: mode,
    devtool: mode === 'production' ? false : 'cheap-source-map',
    context: path.join(__dirname),
    entry: {
      index: path.join(__dirname, 'src', 'index.ts'),
      background: path.join(__dirname, 'src', 'background.ts'),
      'content-twitter': path.join(__dirname, 'src', 'content-twitter.tsx'),
      manifest: path.join(__dirname, 'src', 'manifest.json'),
    },
    output: {
      path: path.join(__dirname, 'build', browser),
      filename: '[name].js',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          type: 'javascript/auto',
          test: /manifest\.json$/,
          use: {
            loader: 'wext-manifest-loader',
            options: {
              usePackageJSONVersion: true,
            },
          },
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
      fallback: {
        fs: false,
      },
    },
    plugins: [
      new ESLintPlugin({
        extensions: ['ts'],
        exclude: ['node_modules'],
      }),
      new NodePolyfillPlugin(),
      new WextManifestPlugin(),
    ],
  };
};

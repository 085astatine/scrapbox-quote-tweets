const path = require('path');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
      background: path.join(__dirname, 'src', 'background.ts'),
      'content-scrapbox': path.join(__dirname, 'src', 'content-scrapbox.tsx'),
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
          test: /\.s[ac]ss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack'],
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
    optimization: {
      minimizer: [new CssMinimizerPlugin()],
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
      fallback: {
        fs: false,
      },
    },
    plugins: [
      new DotenvPlugin(),
      new ESLintPlugin({
        extensions: ['ts'],
        exclude: ['node_modules'],
      }),
      new MiniCssExtractPlugin(),
      new NodePolyfillPlugin(),
      new WextManifestPlugin(),
    ],
    performance: {
      hints: false,
    },
  };
};

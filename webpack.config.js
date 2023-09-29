const path = require('path');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const WextManifestPlugin = require('wext-manifest-webpack-plugin');

module.exports = (env, argv) => {
  const mode = argv.mode ?? 'development';
  const browser = process.env.TARGET_BROWSER;
  process.env.NODE_ENV = mode;
  return {
    mode: mode,
    devtool: mode === 'production' ? false : 'cheap-source-map',
    context: __dirname,
    entry: {
      background: './src/background.ts',
      clipboard: './src/clipboard.tsx',
      'content-scrapbox': './src/content-scrapbox.tsx',
      'content-twitter': './src/content-twitter/index.tsx',
      options: './src/options.tsx',
      popup: './src/popup.tsx',
      manifest: './src/manifest.json',
    },
    output: {
      path: path.join(__dirname, 'build', mode, browser),
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
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sassOptions: { quietDeps: true },
              },
            },
          ],
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
      alias: {
        '@lib': path.join(__dirname, 'src', 'lib'),
      },
      extensions: ['.js', '.ts', '.tsx'],
      fallback: {
        fs: false,
      },
    },
    plugins: [
      new DotenvPlugin({
        systemvars: true,
      }),
      new ESLintPlugin({
        extensions: ['ts', 'tsx'],
        exclude: ['node_modules'],
      }),
      new HtmlPlugin({
        filename: 'clipboard.html',
        template: 'src/clipboard.html',
        chunks: ['clipboard'],
      }),
      new HtmlPlugin({
        filename: 'options.html',
        template: 'src/options.html',
        chunks: ['options'],
      }),
      new HtmlPlugin({
        filename: 'popup.html',
        template: 'src/popup.html',
        chunks: ['popup'],
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

const path = require('path');
const svgToMiniDataURI = require('mini-svg-data-uri');
const CopyPlugin = require('copy-webpack-plugin');
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
  // svgr
  const svgrLoader = {
    loader: '@svgr/webpack',
    options: {
      svgoConfig: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
              },
            },
          },
        ],
      },
    },
  };
  // config
  return {
    mode: mode,
    devtool: mode === 'production' ? false : 'cheap-source-map',
    context: __dirname,
    entry: {
      background: './src/background/index.ts',
      clipboard: './src/clipboard/index.tsx',
      'content-scrapbox': './src/content-scrapbox/index.tsx',
      'content-twitter': './src/content-twitter/index.tsx',
      manifest: './src/manifest.json',
      ...(browser === 'chrome' ?
        { offscreen: './src/offscreen/index.ts' }
      : {}),
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
          oneOf: [
            {
              dependency: { not: ['url'] },
              use: [svgrLoader],
            },
            {
              type: 'asset/inline',
              generator: {
                dataUrl: (content) => svgToMiniDataURI(content.toString()),
              },
            },
          ],
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
      minimizer: ['...', new CssMinimizerPlugin()],
    },
    resolve: {
      alias: {
        '~': path.join(__dirname, 'src'),
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
        configType: 'flat',
        eslintPath: 'eslint/use-at-your-own-risk',
        extensions: ['ts', 'tsx'],
        exclude: ['node_modules'],
      }),
      new HtmlPlugin({
        filename: 'clipboard.html',
        template: 'src/clipboard/index.html',
        chunks: ['clipboard'],
      }),
      ...(browser === 'chrome' ?
        [
          new HtmlPlugin({
            filename: 'offscreen.html',
            template: 'src/offscreen/index.html',
            chunks: ['offscreen'],
          }),
        ]
      : []),
      new MiniCssExtractPlugin(),
      new NodePolyfillPlugin({
        additionalAliases: ['process'],
      }),
      new WextManifestPlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: '**/*',
            context: 'public',
            globOptions: {
              ignore: mode === 'production' ? ['**/test_data.json'] : [],
            },
          },
        ],
      }),
    ],
    performance: {
      hints: false,
    },
  };
};

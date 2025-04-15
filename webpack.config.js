//
// const webpack = require('webpack');
// const path = require('path');
// const nodeExternals = require('webpack-node-externals');
// const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');
//
// module.exports = {
//   entry: ['webpack/hot/poll?100', './src/main.ts'],
//   target: 'node',
//   externals: [
//     nodeExternals({
//       allowlist: ['webpack/hot/poll?100'],
//     }),
//   ],
//   module: {
//     rules: [
//       {
//         test: /.tsx?$/,
//         use: 'ts-loader',
//         exclude: /node_modules/,
//       },
//     ],
//   },
//   mode: 'development',
//   resolve: {
//     extensions: ['.tsx', '.ts', '.js'],
//   },
//   plugins: [new webpack.HotModuleReplacementPlugin(), new RunScriptWebpackPlugin({ name: 'server.js', autoRestart: false })],
//   output: {
//     path: path.join(__dirname, 'dist'),
//     filename: 'server.js',
//   },
// };


// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodeExternals = require('webpack-node-externals');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CopyPlugin = require('copy-webpack-plugin');

const isProduction = typeof process.env.NODE_ENV !== 'undefined' && process.env.NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';
const devtool = isProduction ? false : 'inline-source-map';

module.exports = {
  entry: ['webpack/hot/poll?100', './src/main.ts'],
  optimization: {
    minimize: false,
  },
  target: 'node',
  mode,
  devtool,
  externals: [
    nodeExternals({
      allowlist: ['webpack/hot/poll?100'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /\.\/native/,
      contextRegExp: /\/pg\//,
    }),
    new webpack.HotModuleReplacementPlugin(),
    // new RunScriptWebpackPlugin({
    //   name: 'server.js',
    //   autoRestart: true,
    // }),
    new CopyPlugin({
      patterns: [
        {
          from: `./environment/${mode}.env`,
          to: path.join(__dirname, 'build'),
        },
      ],
    }),
  ],

  output: {
    path: path.join(__dirname, 'build'),
    filename: 'server.js',
  },
};


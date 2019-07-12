/* eslint-disable */
const path = require("path");
const webpack = require("webpack");

const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const DotENV = require("dotenv-webpack");

const PUBLIC_PATH = process.env.PUBLIC_PATH ? process.env.PUBLIC_PATH : "/";
const ENV = process.env.NODE_ENV ? process.env.NODE_ENV : "development";
const hashLength = 5;

// console.log(`Running in ${ENV} !`);
const isProd = ENV === "production";

function cssLoaders(isModule) {
  return [
    ...(isProd
      ? [MiniCSSExtractPlugin.loader]
      : [
          {
            loader: "style-loader",
          },
        ]),
    {
      loader: "css-loader",
      options: {
        sourceMap: true,
        ...(isModule
          ? {
              modules: true,
              localIdentName: isProd ? `[hash:base64:${hashLength}]` : `[name]__[local]___[hash:base64:${hashLength}]`,
            }
          : {}),
        importLoaders: 2,
      },
    },
    {
      loader: "postcss-loader",
    },
    {
      loader: "sass-loader",
      options: {
        sourceMap: true,
      },
    },
  ];
}

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: [...(isProd ? [] : ["react-hot-loader/patch"]), path.resolve(__dirname, "src")],
  output: {
    publicPath: PUBLIC_PATH,
    path: path.resolve(__dirname, "dist"),
    filename: `[name].[hash:${hashLength}].js`,
    chunkFilename: `[name].[chunkhash:${hashLength}].chunk.js`,
  },
  target: "web",
  mode: isProd ? "production" : ENV,
  performance: {
    maxEntrypointSize: 2 * 1000 * 1024,
    maxAssetSize: 1 * 1000 * 1024,
  },
  optimization: {
    nodeEnv: "production",
    sideEffects: true,
    concatenateModules: true,
    runtimeChunk: "single",
    minimize: isProd,
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          warnings: false,
          compress: {
            comparisons: false,
          },
          parse: {},
          mangle: true,
          output: {
            comments: false,
            ascii_only: true,
          },
        },
        parallel: true,
        cache: true,
        sourceMap: true,
      }),
    ],
    splitChunks: {
      chunks: "all",
      maxInitialRequests: 15,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `npm.${packageName.replace("@", "")}`;
          },
        },
      },
    },
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    mainFields: ["esm2015", "module", "jsnext:main", "main", "browser"],
    alias: {
      // tree-shaking ant-icons
      "@ant-design/icons/lib/dist$": path.resolve(__dirname, "src/components/units/Icons.jsx"),
      src: path.resolve(__dirname, "src"),
      "@": path.resolve(__dirname, "src"),
      ...(isProd
        ? {}
        : {
            "react-dom": "@hot-loader/react-dom",
          }),
    },
    modules: ["node_modules", "src"], // path to search when use Relative Path
  },
  module: {
    rules: [
      {
        test: /\.[t|j]sx?$/,
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
        },
        sideEffects: false,
        exclude: /node_modules/,
      },
      {
        test: /\.scoped\.s?css$/,
        oneOf: [
          {
            use: cssLoaders(true),
          },
          {
            resourceQuery: /raw/,
            use: cssLoaders(false),
          },
        ],
      },
      {
        test: /^((?!\.scoped).)*s?css$/,
        use: cssLoaders(false),
      },
      {
        test: /\.(ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader",
        options: { name: "[name].[ext]" },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader",
        options: { name: "fonts/[name].[ext]" },
      },
      {
        test: /\.(jpg|gif|png|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader",
        options: {
          limit: 8192,
        },
      },
    ],
  },
  plugins: [
    // new webpack.NormalModuleReplacementPlugin(/\/lang\/zh-CN/, "./lang/en"),
    new DotENV({
      path: path.resolve(__dirname, "./.env"),
      safe: true,
      systemvars: isProd,
      defaults: !isProd,
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(ENV),
    }),
    new webpack.HashedModuleIdsPlugin({
      hashFunction: "sha256",
      hashDigest: "hex",
      hashDigestLength: 20,
    }),
    new MiniCSSExtractPlugin({
      filename: `[name].[contenthash:${hashLength}].css`,
      chunkFilename: `[name].[contenthash:${hashLength}].chunk.css`,
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "src", "static"),
        ignore: [".*"],
      },
    ]),
    ...(isProd
      ? [
          new webpack.SourceMapDevToolPlugin({
            publicPath: "http://localhost:8080/",
            filename: "sourcemaps/[file].map",
            exclude: [/vendor.*.js/],
          }),
        ]
      : [
          new webpack.HotModuleReplacementPlugin({
            // Options...
          }),
        ]),
    ...(ENV !== "test"
      ? [
          new HTMLWebpackPlugin({
            template: path.resolve(__dirname, "src", "index.html"),
            filename: "./index.html",
          }),
        ]
      : []),
  ],
  devtool: isProd ? false : "cheap-module-eval-source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    hot: true,
    stats: "minimal",
    historyApiFallback: true, // single-page application
  },
  stats: { children: false, modules: false, entrypoints: false },
  node: {
    dgram: "empty",
    fs: "empty",
    net: "empty",
    tls: "empty",
  },
};

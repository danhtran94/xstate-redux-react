/* eslint-disable */
const path = require("path");
const webpack = require("webpack");

const { VueLoaderPlugin } = require("vue-loader");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const PUBLIC_PATH = process.env.PUBLIC_PATH ? process.env.PUBLIC_PATH : "/";
const ENV = process.env.NODE_ENV ? process.env.NODE_ENV : "development";

// console.log(`Running in ${ENV} !`);
const isProd = ENV === "production";

function cssLoaders(isModule) {
  return [
    ...(isProd
      ? [MiniCSSExtractPlugin.loader]
      : [
          {
            loader: "style-loader"
          }
        ]),
    {
      loader: "css-loader",
      options: {
        sourceMap: true,
        ...(isModule
          ? {
              modules: true,
              localIdentName: isProd
                ? "[hash:base64:5]"
                : "[name]__[local]___[hash:base64:5]"
            }
          : {}),
        importLoaders: 2
      }
    },
    {
      loader: "postcss-loader"
    },
    {
      loader: "sass-loader",
      options: {
        sourceMap: true
      }
    }
  ];
}

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: [
    ...(isProd ? [] : ["react-hot-loader/patch"]),
    path.resolve(__dirname, "src")
  ],
  output: {
    publicPath: PUBLIC_PATH,
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[hash:5].js",
    chunkFilename: "[name].[chunkhash:5].js"
  },
  mode: isProd ? "production" : ENV,
  performance: {
    // maxEntrypointSize: 1024000,
    // maxAssetSize: 1024000
  },
  optimization: {
    // namedModules: true,
    // providedExports: true,
    // usedExports: true,
    minimize: isProd,
    // runtimeChunk: "single",
    // splitChunks: {
    //   cacheGroups: {
    //     vendor: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name: "vendors",
    //       chunks: "all"
    //     }
    //   }
    // },
    minimizer: [
      new TerserWebpackPlugin({
        sourceMap: !isProd, // Must be set to true if using source-maps in production | disable it if you don't have enough RAM
        terserOptions: {
          compress: {
            drop_console: isProd
          }
        }
      })
    ]
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      src: path.resolve(__dirname, "src"),
      "@": path.resolve(__dirname, "src"),
      ...(isProd
        ? {}
        : {
            "react-dom": "@hot-loader/react-dom"
          })
    },
    modules: ["node_modules", "src"] // path to search when use Relative Path
  },
  module: {
    rules: [
      {
        test: /\.[t|j]sx?$/,
        loader: "babel-loader",
        sideEffects: false,
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        use: "vue-loader"
      },
      {
        test: /\.comp\.s?css$/,
        oneOf: [
          {
            use: cssLoaders(true)
          },
          {
            resourceQuery: /raw/,
            use: cssLoaders(false)
          }
        ]
      },
      {
        test: /^((?!\.comp).)*s?css$/,
        use: cssLoaders(false)
      },
      {
        test: /\.(ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader",
        options: { name: "[name].[ext]" }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader",
        options: { name: "fonts/[name].[ext]" }
      },
      {
        test: /\.(jpg|gif|png|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader",
        options: {
          limit: 8192
        }
      }
    ]
  },
  plugins: [
    // new webpack.NormalModuleReplacementPlugin(/\/lang\/zh-CN/, "./lang/en"),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(ENV)
    }),
    new MiniCSSExtractPlugin({
      filename: "[name].[contenthash:5].css"
      // chunkFilename: "[name]-[id].[contenthash:5].css"
    }),
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "src", "static"),
        ignore: [".*"]
      }
    ]),
    ...(["development", "production"].includes(ENV)
      ? [
          new HTMLWebpackPlugin({
            template: path.resolve(__dirname, "src", "index.html"),
            filename: "./index.html"
          })
        ]
      : [])
  ],
  devtool: isProd ? "source-map" : "cheap-module-eval-source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    hot: true,
    historyApiFallback: true, // single-page application
    stats: {
      modules: false,
      children: false
    }
  }
};

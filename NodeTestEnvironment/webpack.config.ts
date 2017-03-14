/// <reference path="./node_modules/@types/node/index.d.ts"/>
const path = require("path");
const webpack = require("webpack");
const AureliaWebpackPlugin = require("aurelia-webpack-plugin");
var FileSystem = require("fs");
var HtmlWebpackPlugin = require("html-webpack-plugin");

process.env.BABEL_ENV = "node";
const env = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || "development";
const debug = env !== "production";

// basic configuration:
const baseUrl = "/";
const rootDir = path.resolve();
const srcDir = path.resolve("src");
const outDir = path.resolve("dist");
const assetsDir = path.resolve("assets");
const devTool = "source-map-inline";

const coreBundles = {
  bootstrap: [
    "es6-promise",
    "aurelia-bootstrapper-webpack",
    "aurelia-polyfills",
    "aurelia-pal",
    "aurelia-pal-browser",
    "regenerator-runtime"
  ],
  aurelia: [
    "aurelia-binding",
    "aurelia-dependency-injection",
    "aurelia-event-aggregator",
    "aurelia-framework",
    "aurelia-history",
    "aurelia-history-browser",
    "aurelia-loader",
    "aurelia-loader-webpack",
    "aurelia-logging",
    "aurelia-logging-console",
    "aurelia-metadata",
    "aurelia-path",
    "aurelia-route-recognizer",
    "aurelia-router",
    "aurelia-task-queue",
    "aurelia-templating",
    "aurelia-templating-binding",
    "aurelia-templating-router",
    "aurelia-templating-resources"
  ]
};

/**
 * Main Webpack Configuration
 */
var Config: any = {
  entry: {
    "app": ["./src/main" /* this is filled by the aurelia-webpack-plugin */],
    "aurelia-bootstrap": coreBundles.bootstrap,
    "aurelia": coreBundles.aurelia.filter(pkg => coreBundles.bootstrap.indexOf(pkg) === -1)

  },
  output: {
    path: outDir,
    filename: debug ? "[name].bundle.js" : "[name].[chunkhash].bundle.js",
    sourceMapFilename: debug ? "[name].bundle.map" : "[name].[chunkhash].bundle.map",
    chunkFilename: debug ? "[id].chunk.js" : "[id].[chunkhash].chunk.js"
  },
  resolve: {
    extensions: [
      ".js",
      ".ts"
    ],
    modules: [
      ".",
      "node_modules",
    ]
  },
  devtool: devTool,
  module: {
    rules: [
      {
        test: /\.ts/,
        loader: "babel-loader!ts-loader",
        exclude: /node_modules/
        //options: {
        //  doTypeCheck: false,
        //  sourceMap: false,
        //  inlineSourceMap: true,
        //  inlineSources: true,
        //  forkChecker: true
        //}
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /(node_modules|config\.js)/
      },
      {
        test: /\.html$/i,
        use: {
          loader: "html-loader"
        },
        exclude: /index\.html/
      },
      {
        test: /\.html$/i,
        include: [
          srcDir
        ],
        loader: "aurelia-template-lint-loader",
        options: {
          enforce: "pre"
        }
      },
      { test: /\.scss$/, loader: "style-loader!css-loader!sass-loader" },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
            options: {
              singleton: true
            }
          },
          "css-loader"
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|woff|woff2|ttf)$/,
        use: "url-loader"
      },
      { test: /\.json$/, loader: "json-loader" }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        aureliaTemplateLinter: {
          emitErrors: false,
          failOnHint: false
        }
      }
    }),
    new webpack.ProvidePlugin({
      regeneratorRuntime: "regenerator-runtime"
    }),
    new AureliaWebpackPlugin({
      root: rootDir,
      src: srcDir,
      baseUrl: baseUrl
    }),
    new HtmlWebpackPlugin({ template: "index.html" }),
    function () // -p adds UglifyJsPlugin to plugins, mangle breaks aurelia lazy loading - hack to disable mangle on uglify... and to stop it automatically changing the devtool when using task runner
    {
      this.options.devtool = devTool;
    }
  ]
};

if (env !== "test") {
  if (Config.plugins) {
    Config.plugins.push(
      new webpack.optimize.CommonsChunkPlugin({
        name: ["aurelia", "aurelia-bootstrap"]
      }));
  }
} else {
    if (Config.module.rules) {
        const obj = {
            test: /\.(jsx?|tsx?)$/i,
            loader: "istanbul-instrumenter-loader",
            query: {
                esModules: true,
                compact: false
            },
            enforce: "post",
            include: srcDir,
            exclude: [/node_modules/, /\.spec.(tsx?|jsx?)/]
        };

        Config.module.rules.push(obj);
        Config.devServer.port = 19876;
    }
}

module.exports = Config;

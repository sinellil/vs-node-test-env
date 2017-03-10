/// <binding />
/// <header name      = "webpack.config.js"
///         version   = "1.000.000.000"
///         copyright = "Copyright © 2016 Datatrial Ltd."
///         author    = "Nicholas Robinson"
///         created   = "YYYY-MM-DD"
/// />
/// <history>
///   <modification version="1.000.000.000" date="YYYY-MM-DD" by="Nicholas Robinson" ccref="CCxxxx">Created</modification>
/// </history>
/// <summary>
/// Sets the configuration for Webpack to bundle and copy necessary files.
/// </summary>
/// <reference path="./node_modules/@types/node/index.d.ts"/>
var path = require("path");
var webpack = require("webpack");
var AureliaWebpackPlugin = require("aurelia-webpack-plugin");
var FileSystem = require("fs");
var HtmlWebpackPlugin = require("html-webpack-plugin");
process.env.BABEL_ENV = "node";
var env = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || "development";
var debug = env !== "production";
// basic configuration:
var baseUrl = "/";
var rootDir = path.resolve();
var srcDir = path.resolve("src");
var outDir = path.resolve("sb");
var assetsDir = path.resolve("assets");
var devTool = "source-map-inline";
var coreBundles = {
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
var Config = {
    entry: {
        "app": ["./src/main" /* this is filled by the aurelia-webpack-plugin */],
        "aurelia-bootstrap": coreBundles.bootstrap,
        "aurelia": coreBundles.aurelia.filter(function (pkg) { return coreBundles.bootstrap.indexOf(pkg) === -1; })
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
        function () {
            this.options.devtool = devTool;
        }
    ]
};
if (env !== "test") {
    if (Config.plugins) {
        Config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
            name: ["aurelia", "aurelia-bootstrap"]
        }));
    }
}
module.exports = Config;
//# sourceMappingURL=webpack.config.js.map
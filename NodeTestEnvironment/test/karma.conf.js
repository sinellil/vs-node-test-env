"use strict";
const path = require("path");

module.exports = function (config) {
    config.set({
        basePath: __dirname,
        frameworks: ["jasmine"],
        files: [
            { pattern: "spec-bundle.js", watch: false }
        ],
        exclude: [],
        preprocessors: {
            "spec-bundle.js": ["coverage", "webpack", "sourcemap"]
        },
        webpack: require("../webpack.config"),
        remapIstanbulReporter: {
            src: path.join(__dirname, "coverage/coverage-final.json"),
            reports: {
                html: path.join(__dirname, "coverage/")
            },
            timeoutNotCreated: 1000,
            timeoutNoMorefiles: 1000
        },
        webpackServer: { noInfo: true },
        reporters: ["mocha", "coverage", "karma-remap-istanbul"],
        port: 9878,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: [
            "Chrome"

        ],
        singleRun: true,
        concurrency: Infinity,
        coverageReporter: {
            reporters: [
                { type: "json", subdir: ".", file: "coverage-final.json" },
                { type: "text-summary" }
            ]
        }
    });
};

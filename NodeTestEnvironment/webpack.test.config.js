"use strict";
var path = require("path");
var srcDir = path.resolve("src");
console.log(srcDir);
var config = require("./webpack.config");
config.module.rules.push({
    test: /\.(ts|js)$/,
    loader: "sourcemap-istanbul-instrumenter-loader",
    query: {
        esModules: true
    },
    enforce: "post",
    include: srcDir,
    exclude: /node_modules/
});
module.exports = config;
//# sourceMappingURL=webpack.test.config.js.map
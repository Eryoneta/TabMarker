const path = require('path');
const copyFiles = require('copy-webpack-plugin');

module.exports = {
   mode: "production",
   entry: {
      background: path.resolve(__dirname, "..", "main", "controller", "background.ts"),
      test: path.resolve(__dirname, "..", "main", "model", "test.ts"),
   },
   resolve: {
      extensions: [".ts", ".js"],
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: /node_modules/,
         },
      ],
   },
   output: {
      path: path.join(__dirname, "../dist"),
      filename: "[name].js",
   },
   plugins: [
      new copyFiles({
         patterns: [
            {from: "main/view", to: "./view"},
            {from: "main/manifest.json", to: "./manifest.json"}
         ]
      }),
    ]
};
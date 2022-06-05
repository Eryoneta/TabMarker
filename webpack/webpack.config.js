const path = require('path');
const copyFiles = require('copy-webpack-plugin');

module.exports = {
   mode: "production",
   entry: {
      background: path.resolve(__dirname, "..", "main", "src", "background.ts"),
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
      path: path.join(__dirname, "../dist/src"),
      filename: "[name].js",
   },
   plugins: [
      new copyFiles({
         patterns: [
            {from: "main/src/templates", to: "./templates"},
            {from: "main/manifest.json", to: "../manifest.json"}
         ]
      }),
    ]
};
require("dotenv").config();
const webpack = require("webpack");
const path = require("path");
const WebpackBar = require("webpackbar");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
   mode: "development",
   entry: {
      poll: __dirname + "/poll.ts",
      server: __dirname + "/server.ts",
   },
   devtool: "cheap-module-eval-source-map",
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: /node_modules/,
            options: {
               // disable type checker - we will use it in fork plugin
               transpileOnly: true,
            },
         },
         // {
         //    test: /\.tsx?$/,
         //    use: [
         //       {
         //          loader: "babel-loader",
         //       },
         //       {
         //          loader: "ts-loader",
         //          options: {
         //             transpileOnly: true,
         //             configFile: __dirname + "/tsconfig.json",
         //          },
         //       },
         //    ],
         //    exclude: /node_modules/,
         // },
      ],
   },
   output: {
      filename: "[name].[hash].js",
      path: path.resolve(__dirname, "../../build/backend"),
      // publicPath: isProduction ? "/static" : "/",
   },
   resolve: {
      extensions: [".ts", ".js"],
      alias: {
         //required due to a bug with Fastify and Webpack
         "tiny-lru": path.join(__dirname, "../../node_modules/tiny-lru"),
      },
   },
   plugins: [
      //necessary due to some wonkiness where something is trying to import pg-native, but we don't have it installed
      new webpack.IgnorePlugin(/^pg-native$/),
      new ForkTsCheckerWebpackPlugin(),
      new WebpackBar({ profile: true, fancy: true, basic: false }),
   ],
   node: {
      fs: "empty",
   },
   target: "node",
};

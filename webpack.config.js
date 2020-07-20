require("dotenv").config();
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const WebpackBar = require("webpackbar");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const cssnano = require("cssnano")({
   preset: "default",
});
const purgecss = require("@fullhuman/postcss-purgecss")({
   // Specify the paths to all of the template files in your project
   content: [
      "client-source" + "/**/*.html",
      "client-source" + "/**/*.tsx",
      "client-source" + "/**/*.ts",
   ],

   // Include any special characters you're using in this regular expression
   defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
});

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
   mode: "development",
   entry: ["react-hot-loader/patch", __dirname + "/client-source/index.tsx"],
   devtool: "cheap-module-eval-source-map",
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            use: [
               {
                  loader: "babel-loader",
               },
               {
                  loader: "ts-loader",
                  options: {
                     transpileOnly: true,
                     configFile: __dirname + "/tsconfig.json",
                  },
               },
            ],
            exclude: /node_modules/,
         },
         {
            test: /\.css$/,
            use: [
               MiniCssExtractPlugin.loader,
               {
                  loader: "css-loader",
                  options: {
                     importLoaders: 1,
                  },
               },
               {
                  loader: "postcss-loader",
                  options: {
                     ident: "postcss",
                     plugins: [
                        require("tailwindcss"),
                        require("autoprefixer"),
                        ...(process.env.NODE_ENV === "production"
                           ? [cssnano, purgecss]
                           : []),
                     ],
                  },
               },
            ],
         },
         {
            test: /\.(png|svg|jpg|gif)$/,
            use: ["file-loader"],
         },
      ],
   },
   output: {
      filename: "[name].[hash].js",
      path: path.resolve(__dirname, "client-build/"),
      // publicPath: isProduction ? "/static" : "/",
   },
   resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: {
         "react-dom": "@hot-loader/react-dom",
      },
   },
   plugins: [
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
         template: __dirname + "/client-source/index.html",
         // favicon: "client-source/favicon.png",
      }),
      // new ForkTsCheckerWebpackPlugin(),
      new WebpackBar({ profile: true, fancy: true, basic: false }),
   ],
   devServer: {
      port: 3001,
      inline: true,
      hot: true,
      host: "0.0.0.0",
      disableHostCheck: true,
      proxy: [
         {
            context: ["/api"],
            target: "http://localhost:3000",
            // target: "https://wordlink.shakahs.workers.dev/",
            secure: false,
            changeOrigin: true,
         },
      ],
      stats: {
         assets: true,
         children: false,
         chunks: false,
         hash: false,
         modules: false,
         publicPath: false,
         timings: true,
         version: false,
         warnings: true,
         colors: {
            green: "\u001b[32m",
         },
      },
   },
};

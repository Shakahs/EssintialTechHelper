require("dotenv").config();
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
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
   // css: glob.sync(
   //    `${path.join(__dirname, "node_modules", "tailwindcss")}/**/*.css`,
   //    {
   //       nodir: true,
   //    }
   // ),
   safelist: {
      greedy: [/^react-datepicker.*/, /^react-tabs.*/],
   },

   // Include any special characters you're using in this regular expression
   defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
});

const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = {
   mode: "development",
   entry: [__dirname + "/client-source/index.tsx"],
   // devtool: "inline-source-map",
   module: {
      rules: [
         {
            test: /\.m?js/,
            resolve: {
               fullySpecified: false,
            },
         },
         {
            test: /\.tsx?$/,
            use: [
               {
                  loader: "babel-loader",
                  options: {
                     cacheDirectory: true,
                     plugins: [
                        isDevelopment && require.resolve("react-refresh/babel"),
                     ].filter(Boolean),
                  },
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
                     postcssOptions: {
                        plugins: [
                           require("tailwindcss"),
                           require("autoprefixer"),
                           ...(process.env.NODE_ENV === "production"
                              ? [cssnano, purgecss]
                              : []),
                        ],
                     },
                  },
               },
            ],
         },
         {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
               {
                  loader: "file-loader",
                  options: { name: "images/[hash]-[name].[ext]" },
               },
            ],
         },
      ],
   },
   output: {
      filename: "[name].[contenthash].js",
      path: path.resolve(__dirname, "../../build/frontend/"),
      // publicPath: isProduction ? "/static" : "/",
   },
   resolve: {
      extensions: [".tsx", ".ts", ".js"],
   },
   plugins: [
      new MiniCssExtractPlugin({ filename: "[name].[hash].css" }),
      new HtmlWebpackPlugin({
         template: __dirname + "/client-source/index.html",
         // favicon: "client-source/favicon.png",
      }),
      // new ForkTsCheckerWebpackPlugin(),
      isDevelopment && new ReactRefreshWebpackPlugin(),
      isDevelopment && new webpack.HotModuleReplacementPlugin(),
      new WebpackBar({ profile: true, fancy: true, basic: false }),
      // new webpack.ProgressPlugin(),
      // new webpack.debug.ProfilingPlugin(),
   ].filter(Boolean),
   devServer: {
      port: 3001,
      inline: true,
      hot: true,
      historyApiFallback: true,
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

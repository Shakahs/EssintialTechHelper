module.exports = (env, argv) => {
   process.env.NODE_ENV = "production";
   const devConfig = require("./webpack.config");
   const prodConfig = {
      ...devConfig,
      mode: "production",
      devtool: undefined,
      devServer: undefined,
   };

   return prodConfig;
};

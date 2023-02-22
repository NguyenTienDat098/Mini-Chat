const webpack = require("webpack");

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ["file-loader"],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      process: { env: {} },
    }),
  ],
  // ...
};

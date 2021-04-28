import path from "path";
import webpack from "webpack";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

const config: webpack.Configuration = {
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
      // {
      //   test: /\.(gif|png|jpg|svg)(\?.*$|$)/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: 'file-loader',
      //     options: {
      //       limit: 8192,
      //     },
      //   },
      // },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
  },
  devServer: {
    contentBase: path.join(__dirname, "build"),
    compress: true,
    port: 4000,
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: false,
      eslint: {
        files: "./src/*",
      },
    }),
    new webpack.DefinePlugin({
      "process.env": {
        DEPLOYMENT_ENDPOINT: JSON.stringify(process.env["DEPLOYMENT_ENDPOINT"]),
      },
    }),
  ],
};

export default config;

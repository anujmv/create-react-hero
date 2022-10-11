const HtmlWebPackPlugin = require("html-webpack-plugin");

const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const webpack = require("webpack");
const path = require("path");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const { MFLiveReloadPlugin } = require("@module-federation/fmr");

const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const isDevelopment = process.env.NODE_ENV !== "production";
console.log("development", isDevelopment);

const deps = require("./package.json").dependencies;
module.exports = {
  mode: isDevelopment ? "development" : "production",
  entry: ["./src/index.js"],
  output: {
    publicPath: "http://localhost:3000/",
    path: path.resolve(__dirname, "build"),
    filename: "static/js/[name].[contenthash].js",
    clean: true,
  },
  devtool: "source-map",
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: 3000,
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.(svg|jpe?g|png|gif)$/i,
        use: {
          loader: "file-loader",
          options: {
            outputPath: "static/media/",
          },
        },
      },
      // {
      //   test: /\.png$/,
      //   use: [
      //     {
      //       loader: "url-loader",
      //       options: {
      //         mimetype: "image/png",
      //         outputPath: "static/media/",
      //       },
      //     },
      //   ],
      // },
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: [
          isDevelopment
            ? { loader: "style-loader" }
            : {
                loader: MiniCssExtractPlugin.loader,
              },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          "postcss-loader",
        ],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
              isDevelopment && require.resolve("react-refresh/babel"),
            ].filter(Boolean),
          },
        },
      },
    ],
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "styles",
          type: "css/mini-extract",
          chunks: "all",
          enforce: true,
        },
      },
    },
  },

  plugins: [
    isDevelopment && new ReactRefreshWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash].css", // change this RELATIVE to your output.path!
      chunkFilename: "static/css/[id].[contenthash].css",
    }),
    new CssMinimizerPlugin(),
    new MFLiveReloadPlugin({
      port: 3000, // the port your app runs on
      container: "home", // the name of your app, must be unique
      standalone: true, // false uses chrome extention
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false,
    }),
    new ModuleFederationPlugin({
      name: "home",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {},
      shared: {
        ...deps,
        react: {
          eager: true,
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          eager: true,
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      favicon: "./public/favicon.ico",
    }),
  ].filter(Boolean),
};

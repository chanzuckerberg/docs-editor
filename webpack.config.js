var webpack = require("webpack"),
    CleanWebpackPlugin = require("clean-webpack-plugin"),
    CopyWebpackPlugin = require("copy-webpack-plugin"),
    FlowWebpackPlugin = require('flow-webpack-plugin'),
    HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin'),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
    WriteFilePlugin = require("write-file-webpack-plugin");
    env = require("./utils/env"),
    fileSystem = require("fs"),
    path = require("path");

// load the secrets
var alias = {
  "docs-editor": path.resolve(__dirname, "src/index.js"),
};

var secretsPath = path.join(__dirname, ("secrets." + env.NODE_ENV + ".js"));

var fileExtensions = ["jpg", "jpeg", "png", "gif", "eot", "otf", "svg", "ttf", "woff", "woff2"];

if (fileSystem.existsSync(secretsPath)) {
  alias["secrets"] = secretsPath;
}

var isDev = env.NODE_ENV === "development";

var options = {
  entry: {
    examples: path.join(__dirname, "examples_src", "examples.js"),
  },
  output: {
    path: path.join(__dirname, "examples"),
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['env', 'react'],
          plugins: ['transform-class-properties']
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
        }],
      },
      {
        test: /\.(png|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'icons/',
            },
        }],
      },
      {
        test: new RegExp('\.(' + fileExtensions.join('|') + ')$'),
        loader: "file-loader?name=[name].[ext]",
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    alias: alias
  },
  plugins: [
    new FlowWebpackPlugin(),
    // clean the examples folder
    new CleanWebpackPlugin(["examples"]),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV)
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "examples_src", "examples.html"),
      filename: "index.html",
      chunks: ["examples"],
      inlineSource: isDev ? '$^' : '.(js|css)$'
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new WriteFilePlugin()
  ]
};

if (env.NODE_ENV === "development") {
  options.devtool = "cheap-module-eval-source-map";
} else {
  options.plugins.push(new UglifyJsPlugin());
}

module.exports = options;

const path = require("path");
const webpack = require("webpack");

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};

  Object.assign(fallback, {
    crypto: require.resolve("crypto-browserify"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    stream: require.resolve("stream-browserify"),
    url: require.resolve("url"),
    util: require.resolve("util"),
  });
  config.resolve.fallback = fallback;

  config.resolve.alias = {
    ...config.alias,
    "~": path.resolve(__dirname, "src"),
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);

  config.module.rules = config.module.rules.map((rule) => {
    if (rule.oneOf instanceof Array) {
      rule.oneOf[rule.oneOf.length - 1].exclude = [
        /\.(js|mjs|jsx|cjs|ts|tsx)$/,
        /\.html$/,
        /\.json$/,
      ];
    }
    return rule;
  });

  // Ignore some warnings
  config.ignoreWarnings = [
    /Failed to parse source map/, // until fixed by cra https://github.com/facebook/create-react-app/pull/11752
  ];

  return config;
};

/* eslint-disable */
const AutoPrefixerPlugin = require("autoprefixer");
const CSSNano = require("cssnano")({
  preset: "default"
});

module.exports = {
  plugins: [AutoPrefixerPlugin, CSSNano]
};

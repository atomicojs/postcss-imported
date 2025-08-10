'use strict';

var promises = require('fs/promises');
var postcss = require('postcss');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var postcss__default = /*#__PURE__*/_interopDefaultLegacy(postcss);

const normalize = (src) => src.replace(/\\/g, "/").replace(/^file:\/(\w)/, "file:///$1");
const postcssImported = ({
  report = {},
  atrule = "import",
  map = (atRule) => {
    const test = atRule.params.match(/("|')(\.[^"']+)("|')/);
    if (test) {
      const [, , src] = test;
      return src;
    }
  },
  plugins = []
}) => ({
  postcssPlugin: "@atomico/postcss-imported",
  AtRule: {
    [atrule]: async (atRule) => {
      const src = map(atRule);
      if (src) {
        const file = atRule.source.input.file;
        const source = normalize(/^file:/.test(file) ? file : "file:///" + file);
        const url = new URL(src, source);
        const href = normalize(url.href);
        report[href] = report[href] || [];
        if (!report[href].includes(source)) {
          report[href].push(source);
        }
        if (atrule === "import") {
          await postcss__default["default"]([
            postcssImported({ report }),
            ...plugins
          ]).process(await promises.readFile(url, "utf8"), {
            from: href
          });
        }
      }
    }
  }
});
postcssImported.postcss = true;

module.exports = postcssImported;

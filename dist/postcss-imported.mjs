import { readFile } from 'fs/promises';
import postcss from 'postcss';

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
          await postcss([
            postcssImported({ report }),
            ...plugins
          ]).process(await readFile(url, "utf8"), {
            from: href
          });
        }
      }
    }
  }
});
postcssImported.postcss = true;

export { postcssImported as default };

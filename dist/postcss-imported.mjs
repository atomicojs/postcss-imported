import path from 'path';
import { readFile } from 'fs/promises';
import postcss from 'postcss';

const normalize = (src) => path.normalize(src).replace(/\\/g, "/").replace(/file:\/(\w)/, "file:///$1");
const postcssImported = ({
  report = {},
  atrule = "import",
  map = (atRule) => {
    const test = atRule.params.match(/("|')(\.[^"']+)("|')/);
    if (test) {
      const [, , src] = test;
      return src;
    }
  }
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
        await postcss([postcssImported({ report })]).process(await readFile(url, "utf8"), {
          from: href
        });
      }
    }
  }
});
postcssImported.postcss = true;

export { postcssImported as default };

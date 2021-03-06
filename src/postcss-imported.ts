import path from "path";
import { readFile } from "fs/promises";
import postcss, { PluginCreator, AtRule, AcceptedPlugin } from "postcss";

interface Report {
    [file: string]: string[];
}

interface Options {
    report: Report;
    atrule?: string;
    map?: (atRule: AtRule) => string | undefined;
    plugins?: AcceptedPlugin[];
}

const normalize = (src: string) =>
    path
        .normalize(src)
        .replace(/\\/g, "/")
        .replace(/file:\/(\w)/, "file:///$1");

const postcssImported: PluginCreator<Options> = ({
    report = {},
    atrule = "import",
    map = (atRule: AtRule): string | undefined => {
        const test = atRule.params.match(/("|')(\.[^"']+)("|')/);
        if (test) {
            const [, , src] = test;
            return src;
        }
    },
    plugins = [],
}) => ({
    postcssPlugin: "@atomico/postcss-imported",
    AtRule: {
        [atrule]: async (atRule) => {
            const src = map(atRule);
            if (src) {
                const file = atRule.source.input.file;

                const source = normalize(
                    /^file:/.test(file) ? file : "file:///" + file
                );

                const url = new URL(src, source);

                const href = normalize(url.href);

                report[href] = report[href] || [];

                if (!report[href].includes(source)) {
                    report[href].push(source);
                }

                await postcss([
                    postcssImported({ report }),
                    ...plugins,
                ]).process(await readFile(url, "utf8"), {
                    from: href,
                });
            }
        },
    },
});

postcssImported.postcss = true;

export default postcssImported;

import { PluginCreator, AtRule } from "postcss";
interface Report {
    [file: string]: string[];
}
interface Options {
    report: Report;
    atrule?: string;
    map?: (atRule: AtRule) => string | undefined;
}
declare const postcssTokens: PluginCreator<Options>;
export default postcssTokens;

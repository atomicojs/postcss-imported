import { PluginCreator, AtRule } from "postcss";
interface Report {
    [file: string]: string[];
}
interface Options {
    report: Report;
    atrule?: string;
    map?: (atRule: AtRule) => string | undefined;
}
declare const postcssImported: PluginCreator<Options>;
export default postcssImported;

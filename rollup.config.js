import esbuild from "rollup-plugin-esbuild";

export default {
    input: ["./src/postcss-imported.ts"],
    output: [
        {
            file: "dist/postcss-imported.cjs",
            format: "cjs",
        },
        {
            file: "dist/postcss-imported.mjs",
            format: "esm",
        },
    ],
    plugins: [esbuild({ target: "esnext" })],
};

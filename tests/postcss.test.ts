import { test } from "uvu";
import * as assert from "uvu/assert";
import postcss from "postcss";
import postcssImported from "../src/postcss-imported";
import { readFile, writeFile } from "fs/promises";

test("result host", async () => {
    const report = {};

    await postcss([postcssImported(report)]).process(
        `@import "./deep-1.css";`,
        {
            from: "./tests/demo.css",
        }
    );

    console.log(report);
    // await writeFile("./tests/expect-host.txt", result.css);
    // assert.is(result.css, await readFile("./tests/expect-host.txt", "utf8"));
});

test.run();

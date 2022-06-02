# @atomico/postcss-imported

This plugin allows to know the local imports, in order to be observed by third-party tools

```js
const report = {};

await postcss([postcssImported(report)]).process(`@import "./deep-1.css";`, {
    from: "./tests/demo.css",
});

console.log(report);
```

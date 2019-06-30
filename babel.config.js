// eslint-disable-next-line
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          esmodules: true // target browsers supporting ES Modules
        },
        modules: false, // true for transformation of ES6 module syntax to another module type
        loose: true, // true mean not strict to es5
        useBuiltIns: "usage", // imports for polyfills when they are used in each file
        corejs: 3
      }
    ],
    // ["@babel/typescript", { jsxPragma: "h" }] // preact
    "@babel/preset-typescript",
    "@babel/preset-react"
  ],
  plugins: [
    // ["@babel/transform-react-jsx", { pragma: "h" }], // preact
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-proposal-optional-chaining"
  ]
};

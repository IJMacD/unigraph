require('reify');
const util = require('util');
const { tokenize } = require("./tokenizer.js");
const { parse } = require("./parser.js");

const tokens = tokenize("ax³ + bx + c");
console.log(tokens);

const ast = parse(tokens);
console.log(util.inspect(ast, { depth: null }));
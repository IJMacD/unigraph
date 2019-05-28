import { NODE_TYPES } from './parser';

const OP_MAP = {
    "+": (a,b) => a + b,
    "-": (a,b) => a - b,
    "×": (a,b) => a * b,
    "*": (a,b) => a * b,
    "÷": (a,b) => a / b,
    "/": (a,b) => a / b,
    "^": (a,b) => Math.pow(a, b),
};

/**
 * @param {import('./parser').Node} expr
 * @param {{ [symbol: string]: number }} symbols
 * @returns {number}
 */
export function evaluate (expr, symbols) {
    if (!expr) {
        throw RangeError("Node passed was null");
    }

    if (expr.type === NODE_TYPES.CONSTANT) {
        return expr.value;
    }

    if (expr.type === NODE_TYPES.SYMBOL) {
        if (expr.name in symbols) {
            return symbols[expr.name];
        }

        return 0;
        // throw RangeError(`Symbol '${expr.name}' not found.`);
    }

    if (expr.type === NODE_TYPES.OPERATOR) {
        const { name, children } = expr;

        if (!(name in OP_MAP)) {
            throw RangeError(`Operator '${name}' not found`);
        }

        const c0 = evaluate(children[0], symbols);
        const c1 = evaluate(children[1], symbols);

        return OP_MAP[name](c0, c1);
    }

    throw RangeError(`Unknown node type '${expr.type}'`);
} 
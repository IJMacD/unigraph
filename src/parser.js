import { TOKEN_TYPES } from "./tokenizer.js";

export const NODE_TYPES = {
    UNKNOWN: 0,
    SYMBOL: 1,
    CONSTANT: 2,
    OPERATOR: 3,
};

/**
 * @typedef Node
 * @prop {number} type
 * @prop {string} [name]
 * @prop {number} [value]
 * @prop {Node[]} [children]
 */

/**
 * @param {import("./tokenizer").Token[]} tokens
 * @returns {Node}
 */
export function parse (tokens) {
    /** @type {Node[]} */
    const nodes = [];
    let i = 0;

    for (const token of tokens) {
        const prev = nodes.length > 0 ? nodes[nodes.length - 1] : null;
        
        switch (token.type) {
            case TOKEN_TYPES.NAME: {
                if (prev && 
                    (prev.type === NODE_TYPES.SYMBOL || prev.type === NODE_TYPES.CONSTANT))
                {
                    nodes.push({ type: NODE_TYPES.OPERATOR, name: "*", children: [] });
                }
                nodes.push({ type: NODE_TYPES.SYMBOL, name: token.name });
            }
            break;
            case TOKEN_TYPES.NUMBER: {
                nodes.push({ type: NODE_TYPES.CONSTANT, value: token.value });
            }
            break;
            case TOKEN_TYPES.OPERATOR: {
                nodes.push({ type: NODE_TYPES.OPERATOR, name: token.name, children: [ ] });
            }
            break;
            case TOKEN_TYPES.SUPERSCRIPT: {
                nodes.push({ type: NODE_TYPES.OPERATOR, name: "^", children: [ ] });
                nodes.push({ type: NODE_TYPES.CONSTANT, value: token.value });
            }
            break;
            case TOKEN_TYPES.SUBSCRIPT: {
                if (!prev) {
                    throw RangeError("Subscript cannot appear as first token");
                }

                if (prev.type !== NODE_TYPES.SYMBOL) {
                    throw TypeError("Subscript must appear after a symbol");
                }
                
                prev.name += token.value.toString();
            }
            break;
            default:
                throw TypeError("Unecpected node type");
        }
    }

    // console.log(nodes);

    canonicalOperators(nodes);

    bubbleOperators(nodes);

    // console.log(nodes);

    let index = 0;
    
    function descend () {
        const n = nodes[index++];

        if (n.type === NODE_TYPES.OPERATOR) {
            n.children.push(descend(), descend());
        }

        return n;
    }

    const node = descend();

    if (index !== nodes.length) {
        throw Error(`Too many nodes. Expected ${index-1}, Got ${nodes.length}`);
    }

    return node;
}


/**
 * Operator precedence
 * Higher number is tighter binding
 */
const PRECEDENCE = {
    "+": 30,
    "-": 30,
    "*": 40,
    "/": 40,
    "×": 40,
    "÷": 40,
    "^": 50,
};

/**
 *
 * @param {Node[]} nodes
 */
function bubbleOperators (nodes) {
    for (let i = nodes.length - 1; i > 0; i--) {
        const n = nodes[i];

        if (n.type !== NODE_TYPES.OPERATOR) {
            continue;
        }

        for (let j = i; j > 0; j--) {
            const a = nodes[j];
            const b = nodes[j-1];

            if (b.type === NODE_TYPES.OPERATOR && PRECEDENCE[b.name] <= PRECEDENCE[a.name]) {
                break;
            }

            nodes[j-1] = a;
            nodes[j] = b;
        }
    }
}

/**
 * @param {Node[]} nodes
 */
function canonicalOperators (nodes) {
    for (const node of nodes) {
        if (node.name === "*") { node.name = "×" }
        else if (node.name === "/") { node.name = "÷" }
    }
}
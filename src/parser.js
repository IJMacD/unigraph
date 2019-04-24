import { TOKEN_TYPES } from "./tokenizer";

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
    /** @type {Node} */
    let root;
    /** @type {Node} */
    let current;

    for (const token of tokens) {
        /** @type {Node} */
        let node;
        switch (token.type) {
            case TOKEN_TYPES.NAME: {
                node = { type: NODE_TYPES.SYMBOL, name: token.name };
            }
            break;
            case TOKEN_TYPES.NUMBER: {
                node = { type: NODE_TYPES.CONSTANT, value: token.value };
            }
            break;
            case TOKEN_TYPES.OPERATOR: {
                node = { type: NODE_TYPES.OPERATOR, name: token.name, children: [ root ] };
                root = node;
            }
            break;
            case TOKEN_TYPES.SUPERSCRIPT: {
                const exponent = { type: NODE_TYPES.CONSTANT, value: token.value };
                node = { type: NODE_TYPES.OPERATOR, name: "^", children: [ current, exponent ] };
                root = node;
            }
            break;
            case TOKEN_TYPES.SUBSCRIPT: {
                if (current.type === NODE_TYPES.SYMBOL) {
                    current.name += token.value.toString();
                }
            }
            break;
        }

        if (!root) {
            root = node;
        }

        if (current) {
            if (current.type === NODE_TYPES.OPERATOR && current.children.length === 1) {
                current.children.push(node);
            } else if (current.type === NODE_TYPES.SYMBOL && node.type === NODE_TYPES.SYMBOL) {
                node = { type: NODE_TYPES.OPERATOR, name: "×", children: [ current, node ] }
            }
        }

        current = node;
    }

    return root;
}
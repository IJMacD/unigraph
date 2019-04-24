import { NODE_TYPES } from './parser';

/**
 * @param {import('./parser').Node} expr
 * @returns {string[]}
 */
export function findParamaters (expr, variable='') {
    /** @type {string[]} */
    const params = [];

    /**
     * @param {import('./parser').Node} node
     */
    function descend (node) {
        if (node.type === NODE_TYPES.SYMBOL) {
            if (node.name !== variable) {
                params.push(node.name);
            }
        } else if (node.type === NODE_TYPES.OPERATOR) {
            node.children.map(descend);
        }
    }

    descend(expr);

    return Array.from(new Set(params));
}
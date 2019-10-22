import { NODE_TYPES } from './parser';

/**
 * @typedef {import('./parser').Node} Node
 */

/**
 * @param {Node} node
 * @returns {Node}
 */
export function rebalance (node) {
    if (node.type !== NODE_TYPES.OPERATOR) {
        return node;
    }

    // console.group("Start rebalance");

    let leftChild = node.children[0];
    let rightChild = node.children[1];

    // console.log(`Initial Left: ${depth(leftChild)} Right: ${depth(rightChild)}`);

    if (depth(leftChild) === depth(rightChild)) {
        // console.groupEnd();
        return node;
    }

    while ((node.name === "+" || node.name === "*") && node.name === leftChild.name && depth(leftChild) > depth(rightChild) + 1) {
        node = rotateRight(node);
        leftChild = node.children[0];
        rightChild = node.children[1];
        // console.log(`Rebalanced Left ${node.name} Depths: ${depth(leftChild)} & ${depth(rightChild)}`);
    }

    while ((node.name === "+" || node.name === "*") && node.name === rightChild.name && depth(leftChild) < depth(rightChild)) {
        node = rotateLeft(node);
        leftChild = node.children[0];
        rightChild = node.children[1];
        // console.log(`Rebalanced Left ${node.name} Depths: ${depth(leftChild)} & ${depth(rightChild)}`);
    }

    // Balance sub-trees
    node.children[0] = rebalance(node.children[0]);
    node.children[1] = rebalance(node.children[1]);

    // console.groupEnd();

    return node;
}

/**
 * @param {Node} node
 */
export function depth (node) {
    if (node.type !== NODE_TYPES.OPERATOR) {
        return 1;
    }

    const leftDepth = depth(node.children[0]);
    const rightDepth = depth(node.children[1]);

    return 1 + Math.max(leftDepth, rightDepth);
}

function rotateLeft (node) {
    const root = node;
    const pivot = root.children[1];
    root.children[1] = pivot.children[0];
    pivot.children[0] = root;
    return pivot;
}

function rotateRight (node) {
    const root = node;
    const pivot = root.children[0];
    root.children[0] = pivot.children[1];
    pivot.children[1] = root;
    return pivot;
}

export function constantEvaluation (node) {
    if (node.type !== NODE_TYPES.OPERATOR) {
        return node;
    }

    node.children[0] = constantEvaluation(node.children[0]);
    node.children[1] = constantEvaluation(node.children[1]);

    const leftChild = node.children[0];
    const rightChild = node.children[1];

    if (leftChild.type !== NODE_TYPES.CONSTANT ||
        rightChild.type !== NODE_TYPES.CONSTANT)
    {
        return node;
    }

    let value;

    if (node.name === "+") {
        value = leftChild.value + rightChild.value;
    } else if (node.name === "-") {
        value = leftChild.value - rightChild.value;
    } else if (node.name === "*") {
        value = leftChild.value * rightChild.value;
    } else if (node.name === "/") {
        value = leftChild.value / rightChild.value;
    } else if (node.name === "×") {
        value = leftChild.value * rightChild.value;
    } else if (node.name === "÷") {
        value = leftChild.value / rightChild.value;
    } else {
        throw Error("Unrecognized Operator: " + node.name);
    }

    return { type: NODE_TYPES.CONSTANT, value };
}
import React from 'react';
import { NODE_TYPES } from './parser';

export default function DebugAST ({ node, variable }) {
    if (!node) {
        return null;
    }

    if (node.type === NODE_TYPES.CONSTANT) {
        return <span style={{ color: '#33a', display: "inline-block", margin: "0 4px", verticalAlign: "top" }}>{node.value}</span>;
    } else if (node.type === NODE_TYPES.SYMBOL) {
        if (node.name === variable) {
            return <span style={{ color: '#000', display: "inline-block", margin: "0 4px", verticalAlign: "top" }}>{node.name}</span>;
        }
        return <span style={{ color: "#3a3", display: "inline-block", margin: "0 4px", verticalAlign: "top" }}>{node.name}</span>;
    } else { // Operator
        if (node.name === "^" && node.children[1].type === NODE_TYPES.CONSTANT) {
            return (
                <span>
                    { DebugAST({ node: node.children[0], variable }) }
                    { numToSuperscript(node.children[1].value) }
                </span>
            );
        }

        return (
            <span style={{ padding: "1px 2px", border: "1px solid #666", display: "inline-block" }}>
                <div>{ node.name }</div>
                { DebugAST({ node: node.children[0], variable }) }
                { DebugAST({ node: node.children[1], variable }) }
            </span>
        );
    }
}

function numToSuperscript (n) {
    return "⁰¹²³⁴⁵⁶⁷⁸⁹"[n];
}
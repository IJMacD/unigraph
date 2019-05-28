import React from 'react';
import { NODE_TYPES } from './parser';

export default function DebugAST ({ node, variable }) {
    if (!node) {
        return null;
    }
    
    if (node.type === NODE_TYPES.CONSTANT) {
        return <span style={{ color: '#33a' }}>{node.value}</span>;
    } else if (node.type === NODE_TYPES.SYMBOL) {
        if (node.name === variable) {   
            return <span style={{ color: '#000' }}>{node.name}</span>;
        }
        return <span style={{ color: "#3a3" }}>{node.name}</span>;
    } else {
        return (
            <span style={{ padding: "2px 6px", border: "1px solid #666", display: "inline-block" }}>
                { DebugAST({ node: node.children[0], variable }) }
                { node.name }
                { DebugAST({ node: node.children[1], variable }) }
            </span>
        );
    }
}
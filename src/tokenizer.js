export const TOKEN_TYPES = {
    UNKNOWN: 0,
    NAME: 1,
    NUMBER: 2,
    OPERATOR: 3,
    SUPERSCRIPT: 4,
    SUBSCRIPT: 5,
};

/**
 * @typedef Token
 * @prop {number} type 
 * @prop {string} [name]
 * @prop {number} [value]
 */

 /**
  * @param {string} input
  */
export function tokenize (input) {
    /** @type {Token[]} */
    const out = [];
    
    let i = 0;

    while (i < input.length) {
        const c = input[i];

        if (/\s/.test(c)) {
            i++;
        } else if (/[a-zA-Zα-ωΑ-Ω]/.test(c)) {
            out.push({ type: TOKEN_TYPES.NAME, name: c });
            i++;
        } else if (/[0-9]/.test(c)) {
            const match = /[0-9.]+/.exec(input.substr(i));
            out.push({ type: TOKEN_TYPES.NUMBER, value: parseFloat(match[0]) });
            i += match[0].length;
        } else if (/[+\-*^/×÷]/.test(c)) {
            let name = c;
            if (name === "*") {
                name = "×";
            }
            else if (name === "/") {
                name = "÷";
            }
            out.push({ type: TOKEN_TYPES.OPERATOR, name });
            i++;
        } else if (/[⁰¹²³⁴-⁹]/.test(c)) {
            // TODO: x¹²
            let value = "⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(c);
            out.push({ type: TOKEN_TYPES.SUPERSCRIPT, value });
            i++;
        } else if (/[₀-₉]/.test(c)) {
            // TODO: x₀₀₇
            let value = "₀₁₂₃₄₅₆₇₈₉".indexOf(c);
            out.push({ type: TOKEN_TYPES.SUBSCRIPT, value });
            i++;
        } 
        else {
            console.log(`Unexpected: '${c}'`);
            i++;
        }
    }

    return out;
}
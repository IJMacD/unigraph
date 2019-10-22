import React from 'react';
import Graph from './Graph';
import './App.css';
import { tokenize } from './tokenizer';
import { parse } from './parser';
import { findParamaters } from './tools';
import { evaluate } from './evaluate';
import DebugAST from './DebugAST';
import { rebalance, constantEvaluation } from './optimise';

const STORAGE_KEY = "unigraph_";

function App() {
  // const [ expression, setExpression ] = React.useState("5ax³ + bx + c");
  // const [ expression, setExpression ] = React.useState("x + x₀ + x₁");
  // const [ expression, setExpression ] = React.useState("1 + 2 + 3 + 4 + 5 + 6");
  const [ expression, setExpression ] = useStorage(STORAGE_KEY + "expression", "a + b + c + d");
  const [ variable, setVariable ] = useStorage(STORAGE_KEY + "variable", "x");
  const [ paramValues, setParamValues ] = useStorage(STORAGE_KEY + "param_values", {});
  const [ xMin, setXMin ] = useStorage(STORAGE_KEY + "xmin", -5);
  const [ xMax, setXMax ] = useStorage(STORAGE_KEY + "xmax", 5);
  const [ yMin, setYMin ] = useStorage(STORAGE_KEY + "ymin", -10);
  const [ yMax, setYMax ] = useStorage(STORAGE_KEY + "ymax", 50);
  const [ instantValue, setInstantValue ] = useStorage(STORAGE_KEY + "instant_value", 0);

  let valid = true;
  let tokens;
  let expr;
  let params;

  try {
    tokens = tokenize(expression);
    // console.log(tokens);
    expr = parse(tokens);
    // console.log(expr);
    // console.log(depth(expr));
    expr = rebalance(expr);
    // console.log(depth(expr));
    expr = constantEvaluation(expr);
    // expr = rebalance(expr);
    // expr = constantEvaluation(expr);

    params = findParamaters(expr, variable);
  } catch (e) {
    // console.error(e);
    valid = false;
  }

  function updateParamValues (param, value) {
    const newValues = { ...paramValues };
    newValues[param] = parseFloat(value);
    setParamValues(newValues);
  }

  function evaluator (x) {
    const symbols = { ...paramValues, [variable]: x };
    try {
      return evaluate(expr, symbols);
    } catch (e) {
      // console.error(e);
    }
  }

  return (
    <div className="App">
      <label>
        y({variable}) =
        <input placeholder="Equation" value={expression} onChange={e => setExpression(e.target.value)} style={{ borderColor: valid ? "initial" : "red" }} />
      </label>
      {/* <label>
        Variable:
        <input value={variable} onChange={e => setVariable(e.target.value)} />
      </label> */}
      <DebugAST node={expr} variable={variable} />
      <h2>Paramaters</h2>
      <ul>
      {
        valid && params.map(p => <li key={p}><label>{p}:<input value={paramValues[p]||0} onChange={e => updateParamValues(p, e.target.value)} type="number" /></label></li>)
      }
      </ul>
      <hr />
      x = <input value={instantValue} onChange={e => setInstantValue(+e.target.value)} type="number" />
      y(x) = { evaluator(instantValue) }
      <hr />
      <Graph evaluator={evaluator} xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} />
      <label>
        xMin:
        <input value={xMin} onChange={e => setXMin(parseFloat(e.target.value))} type="number" />
      </label>
      <label>
        xMax:
        <input value={xMax} onChange={e => setXMax(parseFloat(e.target.value))} type="number" />
      </label>
      <label>
        yMin:
        <input value={yMin} onChange={e => setYMin(parseFloat(e.target.value))} type="number" />
      </label>
      <label>
        yMax:
        <input value={yMax} onChange={e => setYMax(parseFloat(e.target.value))} type="number" />
      </label>
    </div>
  );
}

export default App;

/**
 * @param {string} key
 * @param {T} initialValue
 * @returns {[ T, (newValue: T) => void]}
 * @template T
 */
function useStorage (key, initialValue=null) {
  const storedJSON = localStorage.getItem(key);
  let stored = initialValue;

  if (storedJSON) {
    try {
      stored = JSON.parse(storedJSON);
    } catch (e) {}
  }

  const [ value, setValue ] = React.useState(stored);

  return [
    value,
    newValue => { localStorage.setItem(key, JSON.stringify(newValue)); setValue(newValue); }
  ];
}
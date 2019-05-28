import React from 'react';
import Graph from './Graph';
import './App.css';
import { tokenize } from './tokenizer';
import { parse } from './parser';
import { findParamaters } from './tools';
import { evaluate } from './evaluate';
import DebugAST from './DebugAST';

function App() {
  const [ expression, setExpression ] = React.useState("ax³ + bx + c");
  // const [ value, setValue ] = React.useState("x + x₀ + x₁");
  const [ variable, setVariable ] = React.useState("x");
  const [ paramValues, setParamValues ] = React.useState({});
  const [ xMin, setXMin ] = React.useState(-5);
  const [ xMax, setXMax ] = React.useState(5);
  const [ yMin, setYMin ] = React.useState(-10);
  const [ yMax, setYMax ] = React.useState(50);
  const [ instantValue, setInstantValue ] = React.useState(0);

  let valid = true;
  let tokens;
  let expr;
  let params;

  try {
    tokens = tokenize(expression);
    // console.log(tokens);
    expr = parse(tokens);
    // console.log(expr);

    params = findParamaters(expr, variable);
  } catch (e) {
    console.error(e);
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
      console.error(e);
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

import React from 'react';
import Graph from './Graph';
import './App.css';
import { tokenize } from './tokenizer';
import { parse } from './parser';
import { findParamaters } from './tools';
import { evaluate } from './evaluate';

function App() {
  const [ value, setValue ] = React.useState("ax³ + c");
  // const [ value, setValue ] = React.useState("x + x₀ + x₁");
  const [ variable, setVariable ] = React.useState("x");
  const [ paramValues, setParamValues ] = React.useState({});
  const [ xMin, setXMin ] = React.useState(-5);
  const [ xMax, setXMax ] = React.useState(5);
  const [ yMin, setYMin ] = React.useState(0);
  const [ yMax, setYMax ] = React.useState(100);

  const tokens = tokenize(value);
  // console.log(tokens);
  const expr = parse(tokens);
  // console.log(expr);

  const params = findParamaters(expr, variable);

  function updateParamValues (param, value) {
    const newValues = { ...paramValues };
    newValues[param] = parseFloat(value);
    setParamValues(newValues);
  }

  function evaluator (x) {
    const symbols = { ...paramValues, [variable]: x };
    try {
      return evaluate(expr, symbols);
    } catch (e) {}
  }


  return (
    <div className="App">
      <label>
        y({variable}) = 
        <input placeholder="Equation" value={value} onChange={e => setValue(e.target.value)} />
      </label>
      {/* <label>
        Variable:
        <input value={variable} onChange={e => setVariable(e.target.value)} />
      </label> */}
      <h2>Paramaters</h2>
      <ul>
      {
        params.map(p => <li key={p}><label>{p}:<input value={paramValues[p]||0} onChange={e => updateParamValues(p, e.target.value)} type="number" /></label></li>)
      }
      </ul>
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

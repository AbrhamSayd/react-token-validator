import React, { useState, useEffect } from 'react';

const expresionRegular = /^(\w+) (\w+) = "(.*?)"(?:;)?|(^\w+) (\w+) = (\d+);$/;

type TableData = {
  type: string;
  variable: string;
  value: any;
};

function App() {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [textareaValue, setTextareaValue] = useState('');
  const [error, setError] = useState(false);
  const [tokenValues, setTokenValues] = useState<Record<string, any>>({} as Record<string, any>);
  const [tokenHistory, setTokenHistory] = useState<Record<string, any[]>>({});
  const dataTypePattern = /^(\w+)\s+/;
  const expressions = {
    'int': /^int\s+([a-zA-Z_]\w*)\s*=\s*(-?\d+);$/,
    'string': /^string\s+([a-zA-Z_]\w*)\s*=\s*"(.*)";$/,
    'boolean': /^boolean\s+([a-zA-Z_]\w*)\s*=\s*(true|false);$/,
  }
  
  const handleInput = (code: string) => {
    const lines = code.split('\n');
    const newTokenValues: Record<string, any> = { ...tokenValues };
    let matches: TableData[] = [];
  
    for (const line of lines) {
      let match;

      for (const dataType in expressions) {
        if ((match = expressions[dataType].exec(line)) !== null) {
          setError(false);
          const instruction = {
            'type': dataType,
            'variable': match[1],
            'value': match[2]
          };
          newTokenValues[instruction.variable] = instruction.value;

          if (!tokenHistory[instruction.variable]) {
            tokenHistory[instruction.variable] = [];
          }
          tokenHistory[instruction.variable].push(instruction.value);
  
          matches.push(instruction);
          break; // Exit the loop once a match is found
        }
      }
  
      if (!match) {
        setError(true);
      }
    }
  
    setTableData(matches);
    setTokenValues(newTokenValues);
    console.log(tokenValues)
  };

  useEffect(() => {
  }, [tokenValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleInput(textareaValue);
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="code">Introduce el código:</label>
          <textarea
            id="code"
            className="form-control"
            rows={5}
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Procesar</button>
      </form>
  
      {error && <p className="error text-danger">Código inválido</p>}
  
      <div className="row mt-4">
        <div className="col-md-6">
          <h3>Resultados</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Tipo de dato</th>
                <th>Variable</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((data, index) => (
                <tr key={index}>
                  <td>{data.type}</td>
                  <td>{data.variable}</td>
                  <td>{data.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        <div className="col-md-6">
          <h3>Nuevo valor de los tokens</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Variable</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(tokenValues).map(([variable, value], index) => (
                <tr key={index}>
                  <td>{variable}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <TokenHistory tokenHistory={tokenHistory}></TokenHistory>
    </div>
  );
}

function TokenHistory({ tokenHistory }: { tokenHistory: Record<string, any[]> }) {
  return (
    <div className="col-md-6">
      <h3>Historial Tokens</h3>
      {Object.entries(tokenHistory).map(([variable, history], index) => (
        <div key={index}>
          <h5>Historial de {variable}:</h5>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {history.map((value, i) => (
                <tr key={i}>
                  <td>{new Date().toLocaleString()}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}


export default App;

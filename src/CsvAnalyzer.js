import React, { useState } from 'react';

function CsvAnalyzer({ data }) {
  const [analysis, setAnalysis] = useState(null);

  const analyzeCsv = () => {
    const numericColumns = ['GPS Speed(km/h)', 'Engine RPM(rpm)', 'Intake Air Temperature(°F)'];
    const results = {};

    numericColumns.forEach(column => {
      const values = data.map(row => parseFloat(row[column])).filter(val => !isNaN(val));
      const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
      const max = Math.max(...values);
      const min = Math.min(...values);

      results[column] = {
        average: avg.toFixed(2),
        max: max.toFixed(2),
        min: min.toFixed(2)
      };
    });

    setAnalysis(results);
  };

  return (
    <div className="csv-analyzer">
      <button onClick={analyzeCsv}>Analisar CSV</button>
      {analysis && (
        <div className="analysis-result">
          <h3>Resultado da Análise</h3>
          {Object.entries(analysis).map(([column, stats]) => (
            <div key={column}>
              <h4>{column}</h4>
              <p>Média: {stats.average}</p>
              <p>Máximo: {stats.max}</p>
              <p>Mínimo: {stats.min}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CsvAnalyzer;

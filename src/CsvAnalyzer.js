import React, { useState } from 'react';

function CsvAnalyzer({ data }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeCsv = async () => {
    setLoading(true);

    try {
      const prompt = `Analyze the following CSV data for potential issues in a vehicle's performance:\n${JSON.stringify(data)}`;
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ` + apiKey, // Substitua pela sua chave de API
        },
        body: JSON.stringify({
          model: "davinci-002", // Use GPT-3.5
          prompt: prompt,
          max_tokens: 150,
        }),
      });

      const result = await response.json();
      setAnalysis(result.choices[0].text.trim());
    } catch (error) {
      console.error('Error analyzing CSV:', error);
      setAnalysis('Failed to analyze CSV.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="csv-analyzer">
      <button onClick={analyzeCsv} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze CSV'}
      </button>
      {analysis && (
        <div className="analysis-result">
          <h3>Analysis Result</h3>
          <p>{analysis}</p>
        </div>
      )}
    </div>
  );
}

export default CsvAnalyzer;

import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Brush,
} from "recharts";

const Chart = ({ data, xAxisColumn, yAxisDomain, selectedColumns }) => {
  const formatDecimal = (value) => {
    return value.toFixed(4);
  };

  const generateLineColor = (index) => {
    const colors = [
      "#8884d8",
      "#82ca9d",
      "#ffc658",
      "#ff7300",
      "#ff0066",
      "#00cc99",
      "#cc0099",
    ];
    return colors[index % colors.length];
  };

  const axisTextColor = "#e0e0e0";

  return (
    <div className="chart-container">
      <LineChart width={window.innerWidth * 0.9} height={600} data={data}>
        <CartesianGrid stroke="#444" /> {}
        <XAxis
          dataKey={xAxisColumn}
          tick={{ fill: axisTextColor }}
          axisLine={{ stroke: axisTextColor }}
          tickLine={{ stroke: axisTextColor }}
        />
        <YAxis
          domain={yAxisDomain}
          tickFormatter={formatDecimal}
          tick={{ fill: axisTextColor }}
          axisLine={{ stroke: axisTextColor }}
          tickLine={{ stroke: axisTextColor }}
        />
        <Tooltip />
        <Legend />
        {selectedColumns.map((col, index) => (
          <Line
            key={col}
            type="monotone"
            dataKey={col}
            stroke={generateLineColor(index)}
            name={col}
          />
        ))}
        <Brush />
      </LineChart>
    </div>
  );
};

export default Chart;

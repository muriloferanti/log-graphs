import React from "react";

const XAxisSelection = ({
  columns,
  xAxisColumn,
  onXAxisColumnChange,
  isVisible = true,
}) => {
  return (
    <div className={`x-axis-selection ${isVisible ? "active" : ""}`}>
      <div className="header-row-input">
        <label>Selecione a coluna para o eixo X</label>
        <select
          value={xAxisColumn}
          onChange={(e) => onXAxisColumnChange(e.target.value)}
        >
          {columns.map((column) => (
            <option key={column} value={column}>
              {column}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default XAxisSelection;
